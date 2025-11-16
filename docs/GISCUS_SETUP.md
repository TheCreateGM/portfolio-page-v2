# Giscus Setup Guide

## 🎯 Quick Fix for Your 404 Error

Your Giscus 404 error is likely caused by missing or incorrect configuration. Follow these steps:

### Step 1: Enable GitHub Discussions (2 minutes)

1. Go to: https://github.com/TheCreateGM/portfolio-page-v2/settings
2. Scroll to "Features"
3. Check ✅ "Discussions"
4. Click "Set up discussions"

### Step 2: Install Giscus App (1 minute)

1. Visit: https://github.com/apps/giscus
2. Click "Install" or "Configure"
3. Select repository: `TheCreateGM/portfolio-page-v2`
4. Grant permissions

### Step 3: Get Your Configuration (2 minutes)

1. Go to: https://giscus.app
2. Fill in the form:
   - **Repository:** `TheCreateGM/portfolio-page-v2`
   - **Page ↔️ Discussions Mapping:** Choose "pathname"
   - **Discussion Category:** Select "Announcements" (or create one)
   
3. Scroll down to see the generated script tag
4. Copy these values:
   - `data-repo-id` (looks like: `R_kgDOHxYzAw`)
   - `data-category-id` (looks like: `DIC_kwDOHxYzA84CRxyz`)

### Step 4: Update Local Environment (1 minute)

Edit your `.env.local` file:

```bash
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOHxYzAw  # ← Replace with your actual ID
VITE_GISCUS_CATEGORY=Announcements
VITE_GISCUS_CATEGORY_ID=DIC_kwDOHxYzA84CRxyz  # ← Replace with your actual ID
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
```

### Step 5: Update Vercel Environment Variables (3 minutes)

1. Go to: https://vercel.com/your-username/portfolio-page-v2/settings/environment-variables
2. Add these variables (one by one):

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `VITE_GISCUS_REPO` | `TheCreateGM/portfolio-page-v2` | Production, Preview, Development |
| `VITE_GISCUS_REPO_ID` | Your repo ID from Step 3 | Production, Preview, Development |
| `VITE_GISCUS_CATEGORY` | `Announcements` | Production, Preview, Development |
| `VITE_GISCUS_CATEGORY_ID` | Your category ID from Step 3 | Production, Preview, Development |
| `VITE_GISCUS_MAPPING` | `pathname` | Production, Preview, Development |
| `VITE_GISCUS_LANG` | `en` | Production, Preview, Development |
| `VITE_GISCUS_THEME` | `preferred_color_scheme` | Production, Preview, Development |

3. Click "Save" for each variable

### Step 6: Redeploy (1 minute)

1. Go to: https://vercel.com/your-username/portfolio-page-v2
2. Click "Deployments"
3. Click "..." on the latest deployment
4. Click "Redeploy"

**OR** push a new commit to trigger automatic deployment.

### Step 7: Verify (1 minute)

Run the diagnostic script:
```bash
npm run check:giscus
```

This will verify:
- ✅ Environment variables are set
- ✅ Repository is accessible
- ✅ Discussions are enabled
- ✅ Configuration format is correct

---

## 🔍 Testing

After redeployment, visit your blog post:
```
https://axogm.vercel.app/blog/welcome-to-my-portfolio
```

You should now see the Giscus comment section at the bottom of the page.

---

## 🐛 Still Not Working?

### Check Browser Console
1. Open your blog post
2. Press F12 (Developer Tools)
3. Go to "Console" tab
4. Look for Giscus-related errors

### Common Issues

**Issue:** "Discussion not found"
- **Solution:** Make sure the category exists in your GitHub Discussions

**Issue:** "Repository not found"
- **Solution:** Verify the repository is public or Giscus app has access

**Issue:** CSP Error
- **Solution:** Already configured in `vercel.json`, but verify it includes:
  ```json
  "script-src": "... https://giscus.app"
  "frame-src": "https://giscus.app"
  ```

**Issue:** Environment variables not loading
- **Solution:** Make sure variables start with `VITE_` prefix
- **Solution:** Redeploy after adding variables

---

## 📝 How Giscus Works

1. User visits your blog post
2. Giscus loads in an iframe
3. It maps the page URL to a GitHub Discussion
4. If discussion doesn't exist, it creates one
5. Comments are stored as GitHub Discussion comments
6. Users authenticate with GitHub to comment

---

## 🎨 Customization

You can customize Giscus appearance in your component:

```typescript
<Giscus
  repo="TheCreateGM/portfolio-page-v2"
  repoId={import.meta.env.VITE_GISCUS_REPO_ID}
  category="Announcements"
  categoryId={import.meta.env.VITE_GISCUS_CATEGORY_ID}
  mapping="pathname"
  reactionsEnabled="1"
  emitMetadata="0"
  inputPosition="top"  // or "bottom"
  theme="preferred_color_scheme"  // or "light", "dark", "dark_dimmed"
  lang="en"
  loading="lazy"
/>
```

---

## 🔗 Resources

- **Giscus Configuration:** https://giscus.app
- **GitHub Discussions:** https://docs.github.com/en/discussions
- **Giscus Component:** https://github.com/giscus/giscus-component
- **Troubleshooting:** See `docs/TROUBLESHOOTING.md`
