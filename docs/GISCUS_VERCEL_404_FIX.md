# 🔧 Complete Fix for Giscus 404 Error on Vercel

## The Problem

When users try to sign in with GitHub to comment via Giscus, they get a 404 error:
```
404: NOT_FOUND Code: NOT_FOUND
URL: https://axogm.vercel.app/blog/welcome-to-my-portfolio?giscus=...
```

## Root Cause

Vercel's routing wasn't properly handling the blog post URLs with query parameters (the `?giscus=...` part). When GitHub redirects back after OAuth, Vercel tries to serve a static file instead of routing to your SPA.

## The Complete Fix

### 1. Update `vercel.json` Rewrites

The rewrites need to be more explicit for Vercel to handle all routes correctly:

```json
"rewrites": [
  { "source": "/blog/:slug", "destination": "/index.html" },
  { "source": "/giscus-callback", "destination": "/index.html" },
  { "source": "/(.*)", "destination": "/index.html" }
]
```

**Why this works:**
- Explicit `/blog/:slug` route ensures blog posts are always routed to the SPA
- `/giscus-callback` route is explicitly defined (though not currently used)
- Catch-all `/(.*)`  handles everything else

### 2. Verify Environment Variables

Your `.env.local` should have:

```bash
VITE_GISCUS_ORIGIN=https://axogm.vercel.app
```

**Important:** This should be your site's BASE URL, NOT a callback path. Giscus will automatically append the `giscus` parameter to the current page URL.

### 3. Update Vercel Environment Variables

Go to: https://vercel.com/your-project/settings/environment-variables

Ensure these are set for **all environments** (Production, Preview, Development):

```bash
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
VITE_GISCUS_ORIGIN=https://axogm.vercel.app
```

### 4. Deploy the Fix

```bash
git add vercel.json .env.local docs/GISCUS_VERCEL_404_FIX.md
git commit -m "fix: Update Vercel rewrites to handle Giscus OAuth redirects"
git push
```

Or trigger a manual redeploy from Vercel dashboard.

## How Giscus OAuth Flow Works

1. **User clicks "Sign in with GitHub"** on your blog post
   - Current URL: `https://axogm.vercel.app/blog/welcome-to-my-portfolio`

2. **Giscus redirects to GitHub OAuth**
   - URL: `https://github.com/login/oauth/authorize?client_id=...`

3. **User authorizes the Giscus app**

4. **GitHub redirects to Giscus**
   - URL: `https://giscus.app/api/oauth/authorized?code=...`

5. **Giscus processes auth and redirects back to your site**
   - URL: `https://axogm.vercel.app/blog/welcome-to-my-portfolio?giscus=TOKEN`
   - The `giscus` parameter contains the auth token

6. **Your SPA receives the token**
   - Giscus iframe detects the token in the URL
   - User is now authenticated and can comment

## Testing the Fix

After deployment:

1. Visit: https://axogm.vercel.app/blog/welcome-to-my-portfolio
2. Scroll to the comments section
3. Click "Sign in with GitHub"
4. Authorize the Giscus app
5. You should be redirected back to the blog post (no 404!)
6. Comments should load and you can post

## Troubleshooting

### Still getting 404?

1. **Check Vercel deployment logs:**
   - Go to Vercel dashboard → Deployments → Latest deployment
   - Check if the build succeeded
   - Look for any routing errors

2. **Verify the rewrite rules were applied:**
   - Check the deployment's `vercel.json` in the Vercel dashboard
   - Ensure the rewrites section matches the fix above

3. **Clear Vercel's edge cache:**
   - Go to Vercel dashboard → Settings → General
   - Scroll to "Clear Cache"
   - Click "Clear Cache" and redeploy

4. **Test with browser dev tools:**
   - Open browser console (F12)
   - Go to Network tab
   - Try the OAuth flow
   - Check if the redirect URL is correct

### Other Issues

**Issue:** "Discussion not found"
- **Fix:** Ensure the "Comments" category exists in your GitHub Discussions
- Go to: https://github.com/TheCreateGM/portfolio-page-v2/discussions
- Create a "Comments" category if it doesn't exist

**Issue:** CSP errors in console
- **Fix:** Already configured in `vercel.json`, includes:
  ```
  script-src: ... https://giscus.app
  frame-src: https://giscus.app
  ```

**Issue:** Giscus not loading at all
- **Fix:** Check that the Giscus app is installed:
  - Visit: https://github.com/apps/giscus
  - Click "Configure"
  - Ensure your repository is selected

## Why the `/giscus-callback` Route Exists

The `/giscus-callback` route in your Router is a **fallback** for handling OAuth redirects if needed, but Giscus doesn't actually use it by default. The OAuth flow redirects back to the original page URL with the `giscus` parameter appended.

You can keep this route for future use or remove it if you want to simplify your codebase.

## Summary

The fix involves:
1. ✅ Update `vercel.json` with explicit blog post rewrites
2. ✅ Ensure `VITE_GISCUS_ORIGIN` is set to base URL (not callback path)
3. ✅ Deploy to Vercel
4. ✅ Test the OAuth flow

This ensures Vercel properly routes all blog post URLs (with or without query parameters) to your SPA, allowing Giscus to work correctly.

## Additional Resources

- **Giscus Configuration:** https://giscus.app
- **Vercel Rewrites Documentation:** https://vercel.com/docs/projects/project-configuration#rewrites
- **GitHub Discussions:** https://docs.github.com/en/discussions
- **Giscus GitHub:** https://github.com/giscus/giscus
