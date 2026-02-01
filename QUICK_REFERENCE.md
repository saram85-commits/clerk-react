# ⚡ Quick Reference Card

## Environment Variables

```env
# .env.local
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
CLERK_SECRET_KEY=sk_test_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

## Key Dashboards

| Service | URL | Purpose |
|---------|-----|---------|
| Clerk | dashboard.clerk.com | Authentication |
| Supabase | supabase.com/dashboard | Database |
| Local App | localhost:5173 | Dev server |

## Commands

```bash
npm install --legacy-peer-deps    # Install deps
npm run dev                         # Start dev server
npm run build                       # Build for production
npm run lint                        # Check code quality
```

## Database Schema Quick Reference

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| users | User accounts | id, email, full_name |
| profiles | User info | user_id, name, title, bio, skills, interests |
| matches | Connections | mentor_id, mentee_id, status |
| topics | Topics (future) | id, name |
| user_topics | Topic mapping (future) | user_id, topic_id |

## API Endpoints (Future)

```
GET  /api/mentors              - List all mentors
GET  /api/mentors/:id          - Get mentor details
GET  /api/profile/:userId      - Get user profile
PUT  /api/profile/:userId      - Update profile
POST /api/matches              - Send connection
GET  /api/matches/:userId      - Get user matches
PUT  /api/matches/:id          - Update match status
```

## Pages

| Page | Path | Role |
|------|------|------|
| Home | `/` | Public |
| Dashboard | `/dashboard` | Signed in |
| Profile | `/profile` | Signed in |

## Key Components

- **NavBar** - Header with navigation
- **MentorCard** - Mentor profile display
- **IconButton** - Icon with button
- **Dashboard** - Mentor list & search
- **Profile** - User profile editor
- **Home** - Landing page

## Colors

```css
--primary: #6366f1         (Indigo)
--secondary: #8b5cf6       (Purple)
--success: #10b981         (Green)
--danger: #ef4444          (Red)
--warning: #f59e0b         (Orange)
```

## File Locations

| File | Purpose |
|------|---------|
| `SQL_RLS_POLICIES.sql` | Run in Supabase SQL Editor |
| `JWT_SETUP_GUIDE.md` | Configuration instructions |
| `CLERK_WEBHOOK_HANDLER.ts` | Deploy to backend |
| `SETUP_SUMMARY.md` | Complete checklist |
| `README_SETUP.md` | Getting started guide |

## Testing

**Sign Up Flow**
1. Go to home page
2. Click "Get Started"
3. Complete Clerk signup
4. User created in Supabase
5. Redirect to profile
6. Edit and save profile
7. Go to dashboard
8. View mentors and filter
9. Send connection request

## Useful SQL Queries

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- See all policies
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Get user profiles
SELECT * FROM public.profiles WHERE user_id = 'USER_ID';

-- Get user matches
SELECT * FROM public.matches 
WHERE mentor_id = 'USER_ID' OR mentee_id = 'USER_ID';
```

## JWT Token Structure

```json
{
  "iss": "https://your-clerk-domain.clerk.accounts.com",
  "sub": "clerk_user_id",
  "email": "user@example.com",
  "user_id": "clerk_user_id",
  "aud": "authenticated",
  "iat": 1234567890,
  "exp": 1234571490
}
```

## RLS Policy Logic

- **Profiles**: Public read, user edit own
- **Users**: User read own, service insert
- **Matches**: Users can read their own, mentee insert, mentor update status
- **Topics**: Public read, admin write

## Development Tips

1. Use browser DevTools F12 to debug
2. Check Supabase logs for database errors
3. Check Clerk logs for auth issues
4. Use `console.log()` to debug state
5. Check `.env.local` is loaded
6. Restart dev server after env changes

## Production Checklist

- [ ] All env vars set
- [ ] Clerk webhook configured
- [ ] Supabase JWT secret set
- [ ] RLS policies enabled
- [ ] Database backups enabled
- [ ] Error tracking setup
- [ ] SSL certificate valid
- [ ] CORS headers configured

## Useful Links

- React Docs: https://react.dev
- Clerk: https://clerk.com/docs
- Supabase: https://supabase.com/docs
- Framer Motion: https://www.framer.com/motion
- TypeScript: https://www.typescriptlang.org

---

**Save this page for quick reference while developing!**
