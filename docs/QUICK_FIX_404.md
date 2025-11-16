# ⚡ Quick Fix for Giscus 404 Error

## The Problem
Getting 404 error when GitHub redirects back after OAuth: `https://axogm.vercel.app/blog/welcome-to-my-portfolio?giscus=...`

## The Solution (3 Steps)

### Step 1: Files Already Updated ✅
- `vercel.json` - Added explicit blog post rewrites
- `.env.local` - Verified VITE_GISCUS_ORIGIN is correct

### Step 2: Update Vercel Environment Variables
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Find or add: `VITE_GISCUS_ORIGIN`
3. Set value to: `https://axogm.vercel.app` (NOT `/giscus-callback`)
4. Apply to: Production, Preview, Development
5. Click "Save"

### Step 3: Deploy
```bash
git add .
git commit -m "fix: Update Vercel rewrites for Giscus OAuth"
git push
```

## Test It
1. Visit: https://axogm.vercel.app/blog/welcome-to-my-portfolio
2. Click "Sign in with GitHub" in comments
3. Complete OAuth
4. Should return to blog post (no 404!)

## Need Help?
See detailed guide: `docs/GISCUS_VERCEL_404_FIX.md`

Or run: `bash scripts/fix-vercel-giscus-404.sh`
