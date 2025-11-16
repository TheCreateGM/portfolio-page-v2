# 🚨 Quick Fix: Giscus 404 Error

## Your Current Error

```
404: NOT_FOUND Code: NOT_FOUND
```

This happens when Giscus can't find your GitHub Discussions configuration.

## ⚡ 5-Minute Fix

### 1. Enable GitHub Discussions (30 seconds)

```bash
# Visit this URL:
https://github.com/TheCreateGM/portfolio-page-v2/settings

# Then:
# 1. Scroll to "Features"
# 2. Check ✅ "Discussions"
# 3. Click "Set up discussions"
```

### 2. Install Giscus App (30 seconds)

```bash
# Visit:
https://github.com/apps/giscus

# Then:
# 1. Click "Install" or "Configure"
# 2. Select: TheCreateGM/portfolio-page-v2
# 3. Click "Install"
```

### 3. Get Configuration (1 minute)

```bash
# Visit:
https://giscus.app

# Fill in:
# - Repository: TheCreateGM/portfolio-page-v2
# - Mapping: pathname
# - Category: Announcements (or create one)

# Copy these values from the generated script:
# - data-repo-id
# - data-category-id
```

### 4. Update Vercel (2 minutes)

Go to your Vercel dashboard and add these environment variables:

```bash
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=<your-repo-id-from-step-3>
VITE_GISCUS_CATEGORY=Announcements
VITE_GISCUS_CATEGORY_ID=<your-category-id-from-step-3>
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
VITE_GISCUS_ORIGIN=https://axogm.vercel.app
```

**Important:** 
- Set for all environments (Production, Preview, Development)
- The `VITE_GISCUS_ORIGIN` must match your production URL exactly
- This fixes the "404 NOT_FOUND" error when users try to sign in with GitHub

### 5. Redeploy (1 minute)

```bash
# Option A: Push a commit
git commit --allow-empty -m "Fix Giscus configuration"
git push

# Option B: Manual redeploy in Vercel dashboard
# Go to Deployments → Click "..." → Redeploy
```

## ✅ Verify It Works

After redeployment, visit:
```
https://axogm.vercel.app/blog/welcome-to-my-portfolio
```

You should see the comment section at the bottom!

## 🔍 Still Not Working?

Run the diagnostic:
```bash
npm run check:giscus
```

This will tell you exactly what's wrong.

## 📚 Need More Help?

- **Detailed Setup:** `docs/GISCUS_SETUP.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **CI/CD Setup:** `docs/CI_CD_SETUP.md`
