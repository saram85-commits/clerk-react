# Complete Mentorship App Setup - JWT & Database Configuration

## 📋 Files Created/Updated

### 1. **SQL_RLS_POLICIES.sql**
   - Row Level Security policies for all tables
   - JWT verification setup
   - Helper functions for queries
   - Run in Supabase SQL Editor

### 2. **JWT_SETUP_GUIDE.md**
   - Complete step-by-step JWT configuration
   - Clerk to Supabase integration
   - Environment variables setup
   - Troubleshooting guide

### 3. **CLERK_WEBHOOK_HANDLER.ts**
   - Backend webhook handler for user sync
   - Express & Vercel function examples
   - Automatic user/profile creation

### 4. **src/lib/supabase.ts** (Updated)
   - Clerk JWT token integration
   - Helper functions for database operations
   - Error handling and logging

---

## 🚀 Quick Start Checklist

### Phase 1: Clerk Setup (5 min)
- [ ] Go to [Clerk Dashboard](https://dashboard.clerk.com)
- [ ] Create JWT Template named `supabase`
- [ ] Copy signing key
- [ ] Get Publishable Key and Secret Key

### Phase 2: Supabase Setup (10 min)
- [ ] Go to [Supabase Dashboard](https://supabase.com/dashboard)
- [ ] Copy Project URL and Anon Key
- [ ] Paste Clerk signing key into JWT Secret
- [ ] Run `SQL_RLS_POLICIES.sql` in SQL Editor

### Phase 3: Environment Variables (2 min)
Create `.env.local`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

### Phase 4: Backend Webhook (5 min)
- [ ] Set up Clerk webhook endpoint in dashboard
- [ ] Deploy `CLERK_WEBHOOK_HANDLER.ts` to backend
- [ ] Test webhook sends events
- [ ] Verify users sync to Supabase

### Phase 5: Test & Deploy (10 min)
- [ ] Sign up new user via Clerk
- [ ] Verify user appears in Supabase
- [ ] Test profile creation
- [ ] Test mentor search
- [ ] Test mentorship request

---

## 📊 Database Schema Summary

```
users
├── id (UUID, Clerk user ID)
├── email (text)
├── full_name (text)
└── created_at (timestamp)

profiles
├── id (UUID)
├── user_id (UUID → users)
├── name (text)
├── title (text)
├── bio (text)
├── skills (array)
├── interests (array)
├── availability (text)
├── location (text)
├── role (mentee|mentor|both)
├── created_at (timestamp)
└── updated_at (timestamp)

matches
├── id (UUID)
├── mentor_id (UUID)
├── mentee_id (UUID)
├── status (pending|accepted|rejected)
└── created_at (timestamp)

topics
├── id (UUID)
└── name (text)

user_topics
├── user_id (UUID)
└── topic_id (UUID)
```

---

## 🔐 Security Overview

### Row Level Security (RLS)
✅ Users can only see their own protected data
✅ Profiles are public for mentor discovery
✅ Matches are private to involved parties
✅ All queries enforce auth.uid() checks

### JWT Flow
1. User signs in with Clerk
2. Clerk creates JWT with template `supabase`
3. App sends JWT to Supabase
4. Supabase validates with shared secret
5. RLS policies check auth.uid()
6. Data is filtered by user

### Token Contents
```json
{
  "sub": "user_clerk_id",
  "email": "user@example.com",
  "user_id": "user_clerk_id",
  "aud": "authenticated",
  "exp": "1234567890"
}
```

---

## 🔄 User Sync Flow

### Option A: Webhook (Recommended)
```
User Signs Up → Clerk Event → Webhook → Supabase
     ↓
  User record created
  Profile created automatically
  Ready to use app
```

### Option B: On First Login (Current)
```
User Signs Up → App Loads → useEnsureUser → Supabase
     ↓
  User record created (if missing)
  Profile created (if missing)
  Ready to use app
```

---

## 📁 Important Files

| File | Purpose | Action |
|------|---------|--------|
| `SQL_RLS_POLICIES.sql` | Database security setup | Run in Supabase SQL Editor |
| `JWT_SETUP_GUIDE.md` | Configuration instructions | Read & follow steps |
| `CLERK_WEBHOOK_HANDLER.ts` | Backend webhook handler | Deploy to backend |
| `src/lib/supabase.ts` | Supabase client & helpers | Already configured |
| `.env.local` | Environment variables | Create with your keys |

---

## ✅ Verification Checklist

### Clerk Verification
```
❓ Is JWT template created?
→ Clerk Dashboard → Settings → JWT Templates → Look for 'supabase'

❓ Is signing secret copied?
→ Click template → Copy signing key

❓ Is Publishable Key in .env?
→ Check VITE_CLERK_PUBLISHABLE_KEY is set
```

### Supabase Verification
```
❓ Is JWT Secret set?
→ Supabase Dashboard → Settings → API → JWT Settings

❓ Are RLS policies created?
→ Run: SELECT * FROM pg_policies WHERE schemaname = 'public'

❓ Can you query tables?
→ Try: SELECT * FROM public.profiles
```

### App Verification
```
❓ Does app start?
→ npm run dev (should not have errors)

❓ Can you sign up?
→ Click Sign Up button
→ Complete Clerk signup

❓ Does user appear in Supabase?
→ Check public.users table
→ User ID should match Clerk user ID

❓ Can you edit profile?
→ Click Profile button
→ Update your bio and skills
→ Click Save
→ Changes should appear in Supabase

❓ Can you search mentors?
→ Click Dashboard
→ Search and filter mentors
→ Send connection request
```

---

## 🐛 Common Issues & Solutions

### Issue: "Missing environment variables"
**Fix**: Add all keys to `.env.local` and restart dev server

### Issue: "401 Unauthorized" from Supabase
**Fix**: Verify JWT secret matches Clerk signing key

### Issue: "Permission denied" on queries
**Fix**: Run SQL_RLS_POLICIES.sql and verify RLS is enabled

### Issue: User doesn't appear in Supabase
**Fix**: Call ensureUserExists() or check webhook is working

### Issue: Profile not saving
**Fix**: Verify user_id matches auth.uid() in RLS policies

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All environment variables set in production
- [ ] Clerk webhook endpoint updated to production URL
- [ ] Supabase JWT Secret verified matches Clerk
- [ ] All RLS policies in place
- [ ] Tested user signup → profile creation → data access
- [ ] Tested mentor search and connections
- [ ] Monitored Supabase logs for errors
- [ ] Set up error tracking (Sentry, LogRocket, etc.)
- [ ] Enabled Supabase backups

---

## 📞 Support

### Documentation
- [Clerk Docs](https://clerk.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [JWT Explanation](https://jwt.io)

### Debugging
- Check Clerk Dashboard logs for authentication issues
- Check Supabase logs for database issues
- Check browser console for client-side errors
- Use `console.log()` to verify token is present

### Still Need Help?
1. Read JWT_SETUP_GUIDE.md completely
2. Verify all environment variables
3. Check Supabase RLS policies are enabled
4. Run test queries in Supabase SQL Editor
5. Review error logs in both dashboards

---

## 🎉 Next Features to Add

Once basic setup is working:

1. **Real-time Messaging**: Add Supabase Realtime
2. **Notifications**: Push notifications for matches
3. **Reviews & Ratings**: Rating system for mentors
4. **Session Scheduling**: Calendar integration
5. **Advanced Search**: Full-text search & filters
6. **Analytics**: User engagement tracking
7. **Admin Panel**: Manage users and topics
8. **Payment**: Stripe integration for premium

---

**Last Updated**: February 1, 2026
**Status**: Ready for configuration
**Questions?**: Check the detailed guides in project files
