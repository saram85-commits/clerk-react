# JWT & Clerk Integration Setup Guide

## Overview
This guide explains how to set up JWT token integration between Clerk and Supabase for proper authentication and Row Level Security (RLS).

## Step 1: Get Clerk JWT Template

### 1.1 Create Supabase JWT Template in Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to: **Settings** → **API Keys**
4. Copy your **Publishable Key** and **Secret Key**
5. Go to: **Settings** → **JWT Templates**
6. Create a new template named `supabase`:

```json
{
  "iss": "https://your-clerk-domain.clerk.accounts.com",
  "sub": "{{user_id}}",
  "aud": "authenticated",
  "iat": "{{issued_at}}",
  "exp": "{{expires_at}}",
  "email": "{{user.primary_email_address}}",
  "user_id": "{{user_id}}",
  "role": "authenticated"
}
```

7. Click **Create** and copy the **Signing key**

## Step 2: Configure Supabase JWT

### 2.1 Get Supabase Project Settings

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to: **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon Public Key** → `VITE_SUPABASE_ANON_KEY`

### 2.2 Configure JWT Secret (Important!)

1. In Supabase Dashboard, go to: **Settings** → **API**
2. Scroll down to **JWT Settings**
3. Paste the Clerk JWT Template's **Signing key** into the **JWT Secret** field
4. Click **Save**

⚠️ **IMPORTANT**: Keep this secret! Add to environment variables only.

## Step 3: Environment Variables

Create `.env.local` file in your project root:

```env
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
CLERK_SECRET_KEY=sk_test_your_clerk_secret

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Run SQL Setup Script

1. In Supabase Dashboard, go to: **SQL Editor**
2. Create a new query
3. Copy and paste the contents of `SQL_RLS_POLICIES.sql`
4. Click **Run**

This will:
- Enable Row Level Security (RLS) on all tables
- Create security policies for users, profiles, and matches
- Set up helper functions

## Step 5: Verify Setup

### 5.1 Check RLS is Enabled

Run in Supabase SQL Editor:

```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'profiles', 'matches', 'topics', 'user_topics');
```

**Expected output**: All should show `rowsecurity = true`

### 5.2 Check Policies Are Created

Run in Supabase SQL Editor:

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected output**: You should see policies for each table

## Step 6: Test JWT Token Flow

### 6.1 In Your React App

```typescript
import { useAuth } from '@clerk/clerk-react'

function TestJWT() {
  const { getToken } = useAuth()

  const testToken = async () => {
    const token = await getToken({ template: 'supabase' })
    console.log('JWT Token:', token)
  }

  return <button onClick={testToken}>Test JWT Token</button>
}
```

### 6.2 Verify Token Contains Correct Claims

The token should contain:
```json
{
  "iss": "https://your-clerk-domain.clerk.accounts.com",
  "sub": "user_clerk_id",
  "email": "user@example.com",
  "user_id": "user_clerk_id",
  "aud": "authenticated",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## Step 7: Database Sync - Clerk to Supabase

### Option A: Automatic via Webhook (Recommended)

1. In Clerk Dashboard: **Settings** → **Webhooks**
2. Create new endpoint pointing to your backend:
   ```
   https://your-backend.com/api/webhooks/clerk
   ```

3. Subscribe to events:
   - `user.created`
   - `user.updated`

4. Handle webhook to sync user to Supabase:

```typescript
// Backend endpoint
export async function handleClerkWebhook(req, res) {
  const event = req.body
  
  if (event.type === 'user.created' || event.type === 'user.updated') {
    const user = event.data
    
    await supabase.from('users').upsert({
      id: user.id,
      email: user.email_addresses[0].email_address,
      full_name: user.first_name + ' ' + user.last_name,
    })
  }
  
  res.status(200).json({ received: true })
}
```

### Option B: Manual on First Login (Current Implementation)

The `useEnsureUser` hook in your app handles this:

```typescript
// src/hooks/useEnsureUser.ts
export function useEnsureUser() {
  const { user, isLoaded } = useUser()
  
  useEffect(() => {
    if (isLoaded && user) {
      ensureUserExists(
        user.id,
        user.primaryEmailAddress?.emailAddress || '',
        user.fullName || ''
      )
    }
  }, [user, isLoaded])
}
```

## Step 8: Security Best Practices

### 8.1 RLS Policies

All tables have policies to ensure:
- ✅ Users can only see their own data (unless public)
- ✅ Users can't modify other users' data
- ✅ Profiles are public (for mentor discovery)
- ✅ Matches are private to involved parties

### 8.2 API Keys

- **Anon Key**: Safe to expose in frontend (limited by RLS)
- **Service Key**: NEVER expose in frontend! Only use in backend
- **JWT Secret**: Keep secure! Used only by Clerk and Supabase

### 8.3 Token Expiration

- Default: 3600 seconds (1 hour)
- Supabase auto-refreshes before expiry
- Clerk handles token refresh automatically

## Troubleshooting

### Issue: "401 Unauthorized" errors

**Solution**:
```typescript
// Check if token is being included
const token = await getToken({ template: 'supabase' })
console.log('Token exists:', !!token)

// Verify JWT secret matches in Supabase
// Check Supabase Settings → API → JWT Settings
```

### Issue: "Permission denied" on queries

**Solution**:
```sql
-- Check RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check policy conditions
SELECT policyname, qual FROM pg_policies 
WHERE tablename = 'profiles';
```

### Issue: User can't see their data

**Solution**:
```sql
-- Verify user exists in public.users
SELECT * FROM public.users WHERE id = 'clerk_user_id';

-- Verify profile exists
SELECT * FROM public.profiles 
WHERE user_id = 'clerk_user_id';

-- Test policy directly
SELECT * FROM public.profiles 
WHERE user_id = auth.uid();
```

### Issue: Clerk template not syncing

**Solution**:
1. Regenerate Clerk JWT template
2. Copy new signing key to Supabase JWT Secret
3. Wait 2-3 minutes for propagation
4. Re-login to get new token

## Quick Reference

| Component | Location | Purpose |
|-----------|----------|---------|
| Clerk JWT Template | Clerk Dashboard → Settings → JWT Templates | Defines token structure |
| Supabase JWT Secret | Supabase Dashboard → Settings → API → JWT Settings | Validates token signature |
| RLS Policies | Supabase Dashboard → SQL Editor | Controls data access |
| useEnsureUser Hook | src/hooks/useEnsureUser.ts | Syncs Clerk user to Supabase |
| Supabase Helpers | src/lib/supabase.ts | Database operations |

## Next Steps

1. ✅ Complete all steps above
2. ✅ Run the SQL setup script
3. ✅ Set environment variables
4. ✅ Test JWT token flow
5. ✅ Verify RLS policies work
6. ✅ Deploy to production

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Tokens Explained](https://jwt.io)

---

Need help? Check the error logs in Supabase and Clerk dashboards for detailed error messages.
