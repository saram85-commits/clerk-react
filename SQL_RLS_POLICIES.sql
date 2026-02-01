-- ============================================
-- SUPABASE RLS POLICIES & JWT CONFIGURATION
-- ============================================

-- 1. ENABLE ROW LEVEL SECURITY ON ALL TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topics ENABLE ROW LEVEL SECURITY;

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own user record
CREATE POLICY "Users can view own user data" ON public.users
FOR SELECT USING (auth.uid() = id);

-- Users can update their own user record
CREATE POLICY "Users can update own user data" ON public.users
FOR UPDATE USING (auth.uid() = id);

-- Service role can insert users (for signup)
CREATE POLICY "Service role can insert users" ON public.users
FOR INSERT WITH CHECK (true);

-- ============================================
-- PROFILES TABLE POLICIES
-- ============================================

-- Anyone can view all profiles (for mentor discovery)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- MATCHES TABLE POLICIES
-- ============================================

-- Users can view matches where they are mentor or mentee
CREATE POLICY "Users can view their matches" ON public.matches
FOR SELECT USING (
  auth.uid() = mentor_id 
  OR auth.uid() = mentee_id
);

-- Users can insert matches (send mentorship requests)
CREATE POLICY "Users can insert matches as mentee" ON public.matches
FOR INSERT WITH CHECK (auth.uid() = mentee_id);

-- Mentors can update match status
CREATE POLICY "Mentors can update match status" ON public.matches
FOR UPDATE USING (auth.uid() = mentor_id);

-- ============================================
-- TOPICS TABLE POLICIES
-- ============================================

-- Anyone can view topics
CREATE POLICY "Topics are viewable by everyone" ON public.topics
FOR SELECT USING (true);

-- Only admins can insert/update topics (set via custom claims)
CREATE POLICY "Only admins can manage topics" ON public.topics
FOR INSERT WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
);

-- ============================================
-- USER_TOPICS TABLE POLICIES
-- ============================================

-- Users can view their own topics
CREATE POLICY "Users can view own topics" ON public.user_topics
FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own topics
CREATE POLICY "Users can manage own topics" ON public.user_topics
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own topics" ON public.user_topics
FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- JWT ENVIRONMENT SETUP (Done in Supabase Dashboard)
-- ============================================

/*
INSTRUCTIONS TO CONFIGURE JWT IN SUPABASE DASHBOARD:

1. Go to Supabase Dashboard
2. Navigate to: Project Settings > API
3. Check these JWT settings are correct:

   JWT Secret: Should be set (keep it secret!)
   JWT Expiration: Recommended 3600 seconds (1 hour)
   
4. For custom claims in JWT, update user metadata:

   Call this after user signup or via Clerk webhook:
   
   UPDATE auth.users 
   SET raw_user_meta_data = jsonb_set(
     raw_user_meta_data, 
     '{role}', 
     '"mentor"'::jsonb
   ) 
   WHERE id = '[user_id]';

5. Token will then contain:
   {
     "sub": "user_id",
     "aud": "authenticated",
     "role": "authenticated",
     "email": "user@example.com",
     "user_metadata": {
       "role": "mentor"
     }
   }

6. Refresh tokens automatically:
   - Supabase refreshes tokens when they expire
   - Client-side SDK handles this automatically
   - Make sure to call auth.refreshSession() if needed
*/

-- ============================================
-- VERIFY RLS IS ENABLED
-- ============================================

-- Check which tables have RLS enabled:
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'profiles', 'matches', 'topics', 'user_topics');

-- Check all policies:
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================
-- HELPFUL FUNCTIONS FOR CLERK INTEGRATION
-- ============================================

-- Function to get current user info
CREATE OR REPLACE FUNCTION get_current_user()
RETURNS TABLE (
  id UUID,
  email TEXT,
  full_name TEXT
) AS $$
  SELECT id, email, full_name FROM public.users 
  WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to get user profile
CREATE OR REPLACE FUNCTION get_user_profile()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  name TEXT,
  title TEXT,
  bio TEXT,
  skills TEXT,
  interests TEXT,
  availability TEXT,
  role TEXT
) AS $$
  SELECT * FROM public.profiles 
  WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to send mentorship request
CREATE OR REPLACE FUNCTION request_mentorship(mentor_id_param UUID)
RETURNS TABLE (
  id UUID,
  mentor_id UUID,
  mentee_id UUID,
  status TEXT,
  created_at TIMESTAMP
) AS $$
  INSERT INTO public.matches (mentor_id, mentee_id, status)
  VALUES (mentor_id_param, auth.uid(), 'pending')
  RETURNING *
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- TESTING JWT & POLICIES
-- ============================================

/*
To test your RLS policies work correctly:

1. Sign in with Clerk
2. Get the JWT token from Clerk
3. Use it to call Supabase API:

   const { data } = await supabase
     .from('profiles')
     .select('*')
     .eq('user_id', user.id);

4. Verify you can only see your own data in protected tables
5. Verify you can see all profiles in public tables

Common issues:
- JWT not being passed: Check Clerk token is configured
- Policy not working: Verify RLS is enabled with: ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
- Permission denied: Check policy conditions match your use case
- User not found: Ensure user exists in public.users before policy check
*/

-- ============================================
-- BACKUP SQL SCRIPT TO RESET ALL POLICIES
-- ============================================

/*
IF YOU NEED TO RESET ALL POLICIES, RUN THIS:

DROP POLICY IF EXISTS "Users can view own user data" ON public.users;
DROP POLICY IF EXISTS "Users can update own user data" ON public.users;
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their matches" ON public.matches;
DROP POLICY IF EXISTS "Users can insert matches as mentee" ON public.matches;
DROP POLICY IF EXISTS "Mentors can update match status" ON public.matches;
DROP POLICY IF EXISTS "Topics are viewable by everyone" ON public.topics;
DROP POLICY IF EXISTS "Only admins can manage topics" ON public.topics;
DROP POLICY IF EXISTS "Users can view own topics" ON public.user_topics;
DROP POLICY IF EXISTS "Users can manage own topics" ON public.user_topics;
DROP POLICY IF EXISTS "Users can delete own topics" ON public.user_topics;

THEN RERUN THIS SCRIPT.
*/
