# Supabase Setup Guide

## Overview

Supabase provides authentication, database, and real-time subscriptions. For this portfolio, we're primarily using it for user authentication.

**Estimated Time**: 30 minutes  
**Difficulty**: Easy  
**Cost**: Free tier (50,000 monthly active users)

---

## Step 1: Create Supabase Project

1. **Sign up / Log in**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up with GitHub (recommended) or email

2. **Create New Project**
   - Click "New Project"
   - **Organization**: Create or select existing
   - **Name**: `portfolio-prod` (or your preference)
   - **Database Password**: Generate strong password (save it securely!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient

3. **Wait for Provisioning**
   - Takes 2-3 minutes
   - Don't close the tab

---

## Step 2: Get API Credentials

Once your project is ready:

1. Go to **Settings** → **API**
2. Find these values:

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGc...very_long_string
   ```

3. **Copy to .env.local**:

   ```bash
   VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...very_long_string
   ```

---

## Step 3: Configure Authentication

### Enable Email Provider

1. Go to **Authentication** → **Providers**
2. **Email** should be enabled by default
3. Configure settings:
   - ✅ Enable Email Signup
   - ✅ Enable Email Confirmations (optional for dev, recommended for prod)
   - ✅ Enable Email Change Confirmations
   - Set **Site URL**: `http://localhost:5173` (dev) or `https://axogm.vercel.app` (prod)

### Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. Customize:
   - **Confirm Signup**: Welcome email with confirmation link
   - **Magic Link**: Passwordless login email
   - **Change Email Address**: Email change confirmation
   - **Reset Password**: Password reset instructions

3. **Use your branding**:
   ```html
   <h2>Welcome to {{ .SiteURL }}</h2>
   <p>Click here to confirm your email:</p>
   <p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
   ```

### Redirect URLs (Important for Production)

1. Go to **Authentication** → **URL Configuration**
2. Add **Redirect URLs**:
   ```
   http://localhost:5173/**
   https://axogm.vercel.app/**
   ```

---

## Step 4: Create User Profiles Table (Optional)

This step is optional but recommended for storing user metadata.

### SQL Editor

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

   ```sql
   -- Create profiles table
   CREATE TABLE IF NOT EXISTS public.profiles (
     id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
     username TEXT UNIQUE,
     full_name TEXT,
     avatar_url TEXT,
     bio TEXT,
     website TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

   -- Create policies
   -- Anyone can view profiles
   CREATE POLICY "Public profiles are viewable by everyone"
     ON public.profiles FOR SELECT
     USING (true);

   -- Users can insert their own profile
   CREATE POLICY "Users can insert their own profile"
     ON public.profiles FOR INSERT
     WITH CHECK (auth.uid() = id);

   -- Users can update their own profile
   CREATE POLICY "Users can update their own profile"
     ON public.profiles FOR UPDATE
     USING (auth.uid() = id);

   -- Create function to auto-create profile on signup
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, username, full_name, avatar_url)
     VALUES (
       NEW.id,
       NEW.raw_user_meta_data->>'username',
       NEW.raw_user_meta_data->>'full_name',
       NEW.raw_user_meta_data->>'avatar_url'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   -- Create trigger
   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```

4. Click **Run** (F5)
5. Verify: Go to **Table Editor** → you should see `profiles` table

---

## Step 5: Test Locally

### Update .env.local

Create `.env.local` in project root:

```bash
# Supabase
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your_actual_key

# Other services (leave empty for now)
VITE_DIRECTUS_URL=
VITE_MEILISEARCH_URL=
VITE_MEILISEARCH_KEY=
VITE_GISCUS_REPO=
VITE_GISCUS_REPO_ID=
VITE_GISCUS_CATEGORY=
VITE_GISCUS_CATEGORY_ID=
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=light
VITE_UMAMI_SCRIPT_URL=
VITE_UMAMI_WEBSITE_ID=
```

### Start Dev Server

```bash
npm run dev
```

### Test Authentication

1. Open browser: `http://localhost:5173`
2. Click **Login** in navbar
3. Click **Register** tab
4. Fill out form:
   - Email: `test@example.com`
   - Password: `Test1234!` (min 6 chars)
5. Click **Sign Up**
6. Check Supabase dashboard:
   - **Authentication** → **Users** → you should see new user
7. Try logging out and back in

### Verify in Code

Open browser console (F12) and type:

```javascript
console.log(window.localStorage.getItem('sb-<project-ref>-auth-token'))
```

You should see a JSON object with your session token.

---

## Step 6: Configure Vercel Environment Variables

Once you're ready to deploy:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variables for **Production**, **Preview**, and **Development**:

   | Name | Value |
   |------|-------|
   | `VITE_SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...your_actual_key` |

5. Redeploy: Vercel will auto-redeploy with new env vars

---

## Step 7: Update CSP Header

Your `vercel.json` already includes Supabase domains:

```json
"connect-src": "... https://*.supabase.co wss://*.supabase.co"
```

✅ **No action needed** - CSP is already configured.

---

## Troubleshooting

### "Invalid API key" Error

- **Issue**: Wrong `VITE_SUPABASE_ANON_KEY`
- **Fix**: Go to Supabase Settings → API, copy the **anon public** key (not service_role!)

### Email Confirmations Not Working

- **Issue**: Redirect URL mismatch
- **Fix**: Go to Authentication → URL Configuration, add your exact domain

### "User already registered" but Can't Login

- **Issue**: Email not confirmed
- **Fix**: 
  1. Go to Authentication → Users
  2. Click user → Mark email as confirmed
  3. Or disable email confirmations in dev

### Session Not Persisting

- **Issue**: LocalStorage blocked or cleared
- **Fix**: Check browser privacy settings, allow localStorage

### Rate Limiting

- **Issue**: Too many requests from same IP
- **Fix**: Supabase has rate limits (10 req/sec on free tier). Add retry logic or upgrade.

---

## Security Best Practices

### ⚠️ Never Commit These

```bash
# .gitignore should already have:
.env.local
.env*.local
```

### ✅ Use Environment Variables

```typescript
// ✅ Good
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL

// ❌ Bad
const supabaseUrl = "https://xxxxx.supabase.co"
```

### 🔒 Row Level Security (RLS)

- **Always enable RLS** on tables accessible from frontend
- Use policies to restrict access:
  ```sql
  -- Users can only update their own data
  CREATE POLICY "Users update own data"
    ON table_name FOR UPDATE
    USING (auth.uid() = user_id);
  ```

### 🚨 Never Use service_role Key in Frontend

- `anon` key = safe for frontend ✅
- `service_role` key = backend only, bypasses RLS ❌

---

## Next Steps

✅ Supabase is now ready!

Continue to:
- **Directus Setup** → [setup-directus.md](./setup-directus.md)
- **Meilisearch Setup** → [setup-meilisearch.md](./setup-meilisearch.md)

---

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
