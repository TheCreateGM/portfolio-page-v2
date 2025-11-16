# Fix Giscus 404 NOT_FOUND OAuth Error

## The Problem

When users click "Sign in with GitHub" to comment, they get redirected back to your site with a `giscus` token parameter, but it fails with:

```
404: NOT_FOUND Code: NOT_FOUND
ID: sin1::vf7q5-1763312951356-c90bf3f7b507
```

This happens because the **OAuth callback URL** isn't properly configured in the Giscus GitHub App.

## The Solution

### Option 1: Reconfigure Giscus App (Recommended)

1. **Go to Giscus App Settings:**
   ```
   https://github.com/apps/giscus
   ```

2. **Click "Configure" next to your repository**

3. **Verify Repository Access:**
   - Make sure `TheCreateGM/portfolio-page-v2` is selected
   - Ensure "Discussions" permission is granted

4. **Check Callback URL:**
   - The Giscus app should automatically handle callbacks to `https://giscus.app`
   - Your site URL (`https://axogm.vercel.app`) should be in the allowed origins

### Option 2: Reinstall Giscus App

Sometimes the easiest fix is to reinstall:

1. **Uninstall Giscus:**
   ```
   https://github.com/settings/installations
   ```
   Find "giscus" and click "Configure" → "Uninstall"

2. **Reinstall Giscus:**
   ```
   https://github.com/apps/giscus
   ```
   Click "Install" and select `TheCreateGM/portfolio-page-v2`

3. **Reconfigure on giscus.app:**
   ```
   https://giscus.app
   ```
   - Enter your repo: `TheCreateGM/portfolio-page-v2`
   - Select category: `Comments` (or create it)
   - Copy the new IDs and update your Vercel environment variables

### Option 3: Check GitHub Discussions Settings

1. **Enable Discussions:**
   ```
   https://github.com/TheCreateGM/portfolio-page-v2/settings
   ```
   - Scroll to "Features"
   - Check ✅ "Discussions"

2. **Create/Verify the Category:**
   ```
   https://github.com/TheCreateGM/portfolio-page-v2/discussions
   ```
   - Click "Categories" (gear icon)
   - Make sure "Comments" category exists
   - Note the category name (must match `VITE_GISCUS_CATEGORY`)

3. **Get the Correct IDs:**
   ```
   https://giscus.app
   ```
   - Enter: `TheCreateGM/portfolio-page-v2`
   - Select the "Comments" category
   - Copy `data-repo-id` and `data-category-id` from the generated script

## Update Your Environment Variables

In Vercel dashboard (Settings → Environment Variables):

```bash
# These MUST match exactly what giscus.app generates
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOPeMVXQ
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_CATEGORY_ID=DIC_kwDOPeMVXc4Cx2cW
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
```

**Important:** Set these for ALL environments (Production, Preview, Development)

## Verify the Fix

1. **Redeploy your site:**
   ```bash
   git commit --allow-empty -m "Fix Giscus OAuth"
   git push
   ```

2. **Test the comments:**
   - Visit: `https://axogm.vercel.app/blog/welcome-to-my-portfolio`
   - Scroll to comments section
   - Click "Sign in with GitHub"
   - You should be redirected to GitHub, then back to your site successfully

3. **Check for errors:**
   - Open browser DevTools (F12)
   - Look for any console errors
   - The Giscus iframe should load without errors

## Common Mistakes

1. **Wrong Category ID:** The category must exist in your GitHub Discussions
2. **Wrong Repo ID:** Must match exactly from giscus.app
3. **Giscus App Not Installed:** Install at https://github.com/apps/giscus
4. **Discussions Not Enabled:** Enable in repo settings
5. **Environment Variables Not Set:** Must be in Vercel for all environments

## Still Not Working?

Run the diagnostic script:

```bash
npm run check:giscus
```

This will verify:
- ✅ All environment variables are set
- ✅ GitHub Discussions is enabled
- ✅ Giscus app is installed
- ✅ Category exists and matches

## Alternative: Use a Different Category

If "Comments" category is causing issues, try "Announcements":

1. Go to https://giscus.app
2. Select "Announcements" instead of "Comments"
3. Copy the new `data-category-id`
4. Update in Vercel:
   ```bash
   VITE_GISCUS_CATEGORY=Announcements
   VITE_GISCUS_CATEGORY_ID=<new-id-from-giscus-app>
   ```

## Need More Help?

- **Giscus Documentation:** https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md
- **GitHub Discussions Guide:** https://docs.github.com/en/discussions
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables
