# Giscus OAuth Callback Fix

## Problem
Users were getting 404 errors when trying to comment via Giscus because the GitHub OAuth callback wasn't being handled properly.

## Solution
Created a dedicated callback page that handles the GitHub OAuth redirect flow.

## What Was Changed

### 1. New Callback Page (`src/pages/GiscusCallback.tsx`)
- Handles the OAuth redirect from GitHub
- Stores and retrieves the original page URL
- Redirects users back to where they were commenting

### 2. Updated Router (`src/components/Router.tsx`)
- Added `/giscus-callback` route
- This route processes the GitHub OAuth response

### 3. Updated Giscus Component (`src/components/Comments/GiscusComments.tsx`)
- Stores the current page URL before OAuth redirect
- Ensures users return to the correct page after login

### 4. Updated Environment Variables
- Changed `VITE_GISCUS_ORIGIN` from `https://axogm.vercel.app` to `https://axogm.vercel.app/giscus-callback`

## Deployment Steps

### Step 1: Update Vercel Environment Variables
Go to your Vercel dashboard:
1. Navigate to: https://vercel.com/your-project/settings/environment-variables
2. Find `VITE_GISCUS_ORIGIN`
3. Update its value to: `https://axogm.vercel.app/giscus-callback`
4. Click "Save"

### Step 2: Redeploy
```bash
git add .
git commit -m "fix: Add Giscus OAuth callback handler"
git push
```

Or trigger a redeploy from Vercel dashboard.

## How It Works

1. User clicks "Sign in with GitHub" on a blog post
2. Giscus stores the current page URL in sessionStorage
3. User is redirected to GitHub for authentication
4. GitHub redirects back to `/giscus-callback` with auth token
5. Callback page retrieves the stored URL and redirects user back
6. User is now authenticated and can comment

## Testing

1. Visit any blog post: https://axogm.vercel.app/blog/welcome-to-my-portfolio
2. Scroll to comments section
3. Click "Sign in with GitHub"
4. Complete GitHub OAuth
5. You should be redirected back to the same blog post
6. Comments should now work

## Troubleshooting

If comments still don't work:

1. **Clear browser cache and cookies**
2. **Check Vercel environment variables** - Make sure `VITE_GISCUS_ORIGIN` is set correctly
3. **Verify GitHub Discussions** - Ensure Discussions are enabled in your repo
4. **Check Giscus app installation** - Visit https://github.com/apps/giscus and verify it's installed
5. **Verify repo and category IDs** - Run `bash scripts/check-giscus.sh` to validate

## Notes

- The callback page shows a loading spinner during redirect
- Session storage is used (not localStorage) for security
- The solution works with all blog posts and pages
- No changes needed to individual blog post pages
