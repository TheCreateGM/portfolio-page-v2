# Giscus OAuth 404 Fix - Summary

## What Was the Problem?

Users clicking "Sign in with GitHub" to comment were getting:
```
404: NOT_FOUND Code: NOT_FOUND
```

This happens because the OAuth callback from GitHub → Giscus → Your Site wasn't properly configured.

## What We Fixed

### 1. Updated Component
- Removed invalid `origin` prop that was causing TypeScript errors
- The Giscus React component handles OAuth automatically

### 2. Added Environment Variable
- Added `VITE_GISCUS_ORIGIN=https://axogm.vercel.app` to `.env.local`
- This ensures callbacks know where to return to

### 3. Created Documentation
- `docs/GISCUS_OAUTH_FIX.md` - Comprehensive fix guide
- `scripts/fix-giscus-oauth.sh` - Diagnostic helper script

## How to Deploy the Fix

### Step 1: Update Vercel Environment Variables

Go to your Vercel dashboard and add:

```bash
VITE_GISCUS_ORIGIN=https://axogm.vercel.app
```

**Important:** Set this for ALL environments (Production, Preview, Development)

### Step 2: Verify Giscus Configuration

Run the diagnostic:
```bash
npm run fix:giscus
```

This will check:
- ✅ All environment variables are set
- ✅ GitHub Discussions is enabled
- ✅ Giscus app is installed
- ✅ Category exists

### Step 3: Redeploy

```bash
git add .
git commit -m "Fix Giscus OAuth 404 error"
git push
```

Or manually redeploy in Vercel dashboard.

## Root Cause Analysis

The 404 error happens when:

1. **Giscus App Not Installed** - Install at https://github.com/apps/giscus
2. **Wrong Category ID** - Must match exactly from https://giscus.app
3. **Discussions Not Enabled** - Enable in repo settings
4. **OAuth Callback Mismatch** - The callback URL doesn't match your domain

## Testing the Fix

After deployment:

1. Visit: https://axogm.vercel.app/blog/welcome-to-my-portfolio
2. Scroll to comments section
3. Click "Sign in with GitHub"
4. You should be redirected to GitHub, authorize, then back to your site
5. You should now be able to comment!

## If It Still Doesn't Work

### Option 1: Reinstall Giscus App

1. Go to https://github.com/settings/installations
2. Find "giscus" and uninstall
3. Go to https://github.com/apps/giscus
4. Install and select `TheCreateGM/portfolio-page-v2`

### Option 2: Use Different Category

Instead of "Comments", try "Announcements":

1. Go to https://giscus.app
2. Enter: `TheCreateGM/portfolio-page-v2`
3. Select "Announcements" category
4. Copy the new `data-category-id`
5. Update in Vercel:
   ```bash
   VITE_GISCUS_CATEGORY=Announcements
   VITE_GISCUS_CATEGORY_ID=<new-id>
   ```

### Option 3: Get Fresh IDs

Sometimes the IDs get stale:

1. Go to https://giscus.app
2. Re-enter your repo: `TheCreateGM/portfolio-page-v2`
3. Copy ALL the IDs again
4. Update in Vercel
5. Redeploy

## Quick Commands

```bash
# Check current configuration
npm run check:giscus

# Run diagnostic helper
npm run fix:giscus

# Test locally
npm run dev
# Then visit http://localhost:5173/blog/welcome-to-my-portfolio
```

## Files Changed

- ✅ `src/components/Comments/GiscusComments.tsx` - Removed invalid props
- ✅ `.env.local` - Added VITE_GISCUS_ORIGIN
- ✅ `.env.example` - Added VITE_GISCUS_ORIGIN
- ✅ `docs/GISCUS_OAUTH_FIX.md` - Comprehensive fix guide
- ✅ `docs/QUICK_FIX_GISCUS.md` - Updated with origin fix
- ✅ `scripts/fix-giscus-oauth.sh` - Diagnostic helper
- ✅ `package.json` - Added `npm run fix:giscus` command

## Need More Help?

- **Detailed Guide:** `docs/GISCUS_OAUTH_FIX.md`
- **Quick Fix:** `docs/QUICK_FIX_GISCUS.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **Giscus Docs:** https://github.com/giscus/giscus
