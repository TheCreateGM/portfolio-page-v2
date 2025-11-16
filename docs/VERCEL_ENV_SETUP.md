# Vercel Environment Variables Setup

## 🚨 Quick Fix for Giscus 404 Error on Production

If you're getting `404: NOT_FOUND` errors when trying to login/comment on your deployed site (but it works on localhost), you need to add environment variables to Vercel.

### Why This Happens
- Localhost reads from `.env.local` (which is NOT committed to git)
- Vercel doesn't have access to your `.env.local` file
- Without the env vars, Giscus gets `undefined` values and fails

---

## 📋 Step-by-Step Fix

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/dashboard

### 2. Select Your Project
Click on your project (e.g., `axogm`)

### 3. Open Environment Variables
Navigate to: **Settings** → **Environment Variables**

### 4. Add Required Variables

Copy these from your `.env.local` file:

#### Giscus (Comments System)
```
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOPeMVXQ
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_CATEGORY_ID=DIC_kwDOPeMVXc4Cx2cW
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_STRICT=1
VITE_GISCUS_REACTIONS_ENABLED=1
VITE_GISCUS_EMIT_METADATA=1
VITE_GISCUS_INPUT_POSITION=top
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
VITE_GISCUS_LOADING=lazy
```

#### Supabase (Authentication & Database)
```
VITE_SUPABASE_URL=https://hzeidojgdzjwwhikowdq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6ZWlkb2pnZHpqd3doaWtvd2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NTk3NjAsImV4cCI6MjA3ODMzNTc2MH0.QU9Dcu1j-ud3xd13R7HRYeAXlhRc7nl6UGK3dNNakfM
```

#### Other Services (Update with Production URLs)
```
VITE_DIRECTUS_URL=<your-production-directus-url>
VITE_MEILISEARCH_URL=<your-production-meilisearch-url>
VITE_MEILISEARCH_KEY=<your-production-key>
VITE_UMAMI_SCRIPT_URL=<your-production-umami-url>
VITE_UMAMI_WEBSITE_ID=<your-umami-id>
```

### 5. Set Environment Scope
For each variable, select:
- ✅ **Production**
- ✅ **Preview** (optional, for preview deployments)
- ✅ **Development** (optional, for Vercel dev)

### 6. Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the three dots (⋯)
4. Select **Redeploy**
5. Wait for deployment to complete

---

## ✅ Verify It Works

After redeployment:
1. Visit your site: https://axogm.vercel.app
2. Navigate to a blog post
3. Try to login/comment with Giscus
4. Should work without 404 errors!

---

## 🔍 Troubleshooting

### Still Getting 404?
1. **Double-check IDs are correct:**
   - Go to https://giscus.app
   - Enter your repo: `TheCreateGM/portfolio-page-v2`
   - Verify the `data-repo-id` and `data-category-id` match your env vars

2. **Verify GitHub Discussions is enabled:**
   - Go to: https://github.com/TheCreateGM/portfolio-page-v2/settings
   - Check "Discussions" is enabled

3. **Check Giscus app is installed:**
   - Visit: https://github.com/apps/giscus
   - Ensure it's installed for your repo

### Environment Variables Not Taking Effect?
- Make sure you **redeployed** after adding variables
- Check the deployment logs for any errors
- Verify variable names are EXACTLY as shown (case-sensitive)

---

## 🛠️ Local Verification Script

Run this to check if your local env vars are set:
```bash
./scripts/verify-env.sh
```

---

## 📝 Important Notes

1. **Never commit `.env.local`** to git (it's in `.gitignore`)
2. **Production URLs should differ from localhost:**
   - Directus: Use your hosted CMS URL
   - Meilisearch: Use your hosted search URL
   - Umami: Use your hosted analytics URL
3. **Supabase and Giscus** can use the same values for local and production
4. **Redeploy is required** after changing environment variables

---

## 🔗 Related Documentation

- [Giscus Setup Guide](./GISCUS_SETUP.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Environment Variables Reference](./env.md)
- [Vercel Docs: Environment Variables](https://vercel.com/docs/projects/environment-variables)
