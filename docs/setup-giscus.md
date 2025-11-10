# Giscus Setup Guide

## Overview

Giscus is a GitHub Discussions-based comment system. It's the **easiest service** to set up and requires no hosting.

**Estimated Time**: 15 minutes  
**Difficulty**: Very Easy  
**Cost**: Free (uses GitHub Discussions)  
**Prerequisites**: GitHub account with your portfolio repo

---

## Step 1: Enable GitHub Discussions

1. **Go to your GitHub repo**:
   ```
   https://github.com/TheCreateGM/portfolio-page-v2
   ```

2. **Go to Settings**:
   - Click **Settings** tab
   - Scroll to **Features** section

3. **Enable Discussions**:
   - Check ✅ **Discussions**
   - Click **Set up discussions**

4. **Create Welcome Post** (optional):
   - GitHub will prompt you to create a welcome post
   - You can customize or skip this

5. **Verify**:
   - You should now see a **Discussions** tab in your repo

---

## Step 2: Install Giscus App

1. **Go to Giscus App**:
   - Visit [https://github.com/apps/giscus](https://github.com/apps/giscus)

2. **Install**:
   - Click **Install**
   - Select **Only select repositories**
   - Choose `TheCreateGM/portfolio-page-v2`
   - Click **Install**

3. **Authorize**:
   - GitHub will ask for permissions:
     - ✅ Read discussions
     - ✅ Write discussions
   - Click **Authorize**

---

## Step 3: Configure Giscus

1. **Go to Giscus Configuration**:
   - Visit [https://giscus.app](https://giscus.app)

2. **Repository Section**:
   - Enter: `TheCreateGM/portfolio-page-v2`
   - Click **Check**
   - ✅ Should show "Success! This repository meets all of the above criteria."

3. **Page ↔️ Discussions Mapping**:
   - Choose: **pathname**
   - This maps `/blog/my-post` → discussion titled `/blog/my-post`

4. **Discussion Category**:
   - Choose: **Announcements** or create new category **Comments**
   - Recommended: Create new category:
     1. Go to your repo → Discussions → Categories
     2. Click **New category**
     3. Name: `Comments`
     4. Description: `Blog post comments`
     5. Format: **Open-ended discussion**
     6. Click **Create**

5. **Features**:
   - ✅ Enable reactions for the main post
   - ✅ Emit discussion metadata
   - ✅ Place the comment box above the comments
   - ✅ Load the comments lazily

6. **Theme**:
   - Choose: **light** or **preferred_color_scheme**
   - For your portfolio: `light` matches the design

7. **Copy Configuration**:
   - Scroll down to **Enable giscus** section
   - You'll see something like:

   ```html
   <script src="https://giscus.app/client.js"
           data-repo="TheCreateGM/portfolio-page-v2"
           data-repo-id="R_kgDOxxxxxxx"
           data-category="Comments"
           data-category-id="DIC_kwDOxxxxxxx"
           data-mapping="pathname"
           data-strict="0"
           data-reactions-enabled="1"
           data-emit-metadata="0"
           data-input-position="top"
           data-theme="light"
           data-lang="en"
           crossorigin="anonymous"
           async>
   </script>
   ```

8. **Extract Values**:
   - `data-repo` → `VITE_GISCUS_REPO`
   - `data-repo-id` → `VITE_GISCUS_REPO_ID`
   - `data-category` → `VITE_GISCUS_CATEGORY`
   - `data-category-id` → `VITE_GISCUS_CATEGORY_ID`

---

## Step 4: Update Environment Variables

Add to `.env.local`:

```bash
# Giscus
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOxxxxxxx
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxxx
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=light
```

**Replace** `R_kgDOxxxxxxx` and `DIC_kwDOxxxxxxx` with your actual values from giscus.app.

---

## Step 5: Test Locally

### Start Dev Server

```bash
npm run dev
```

### Test Comments

1. Open browser: `http://localhost:5173/blog/test-post`
   - You'll see a 404 since we don't have Directus yet
   - That's OK! We just need to test the URL pattern

2. For now, test on any existing page:
   - Edit `src/pages/BlogPost.tsx` temporarily
   - Change the condition to always render comments:

   ```tsx
   // Temporary test - always show comments
   <GiscusComments />
   ```

3. Visit any page (e.g., homepage)
4. You should see:
   - Giscus comment widget
   - "Sign in with GitHub" button
   - If you sign in, you can post a test comment

5. **Verify on GitHub**:
   - Go to your repo → Discussions
   - You should see a new discussion created automatically
   - Comments appear both on your site and GitHub Discussions

### Remove Test Code

After verifying, revert `BlogPost.tsx` to original state.

---

## Step 6: Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add for **Production**, **Preview**, and **Development**:

   | Name | Value |
   |------|-------|
   | `VITE_GISCUS_REPO` | `TheCreateGM/portfolio-page-v2` |
   | `VITE_GISCUS_REPO_ID` | `R_kgDOxxxxxxx` |
   | `VITE_GISCUS_CATEGORY` | `Comments` |
   | `VITE_GISCUS_CATEGORY_ID` | `DIC_kwDOxxxxxxx` |
   | `VITE_GISCUS_MAPPING` | `pathname` |
   | `VITE_GISCUS_LANG` | `en` |
   | `VITE_GISCUS_THEME` | `light` |

---

## Step 7: Update CSP Header

Your `vercel.json` already includes Giscus domains:

```json
"script-src": "... https://giscus.app",
"style-src": "... https://giscus.app",
"frame-src": "https://giscus.app"
```

✅ **No action needed** - CSP is already configured.

---

## Customization Options

### Theme Switching

If you want to support dark mode later:

```typescript
// src/components/Comments/GiscusComments.tsx
const theme = import.meta.env.VITE_GISCUS_THEME || 'preferred_color_scheme'
```

Then set `VITE_GISCUS_THEME=preferred_color_scheme` to auto-match user's system theme.

### Custom CSS

Giscus supports custom themes. See [Giscus Advanced Usage](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md).

### Localization

Support multiple languages by changing `VITE_GISCUS_LANG`:
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- [Full list](https://github.com/giscus/giscus/blob/main/CONTRIBUTING.md#adding-localizations)

### Anonymous Posting

Giscus requires GitHub authentication. This is a **feature**, not a bug - it prevents spam!

---

## Troubleshooting

### Comments Not Loading

- **Issue**: Blank space where comments should be
- **Fix**: Check browser console for errors
  - CSP violation? Update `vercel.json`
  - Network error? Check `VITE_GISCUS_REPO_ID` and `VITE_GISCUS_CATEGORY_ID`

### "Discussion not found"

- **Issue**: Wrong `data-mapping` setting
- **Fix**: Ensure `VITE_GISCUS_MAPPING=pathname` matches your Giscus config

### "Repository is not public"

- **Issue**: Giscus requires public repo
- **Fix**: Go to repo Settings → Danger Zone → Change visibility → Public

### "Category not found"

- **Issue**: Wrong `VITE_GISCUS_CATEGORY_ID`
- **Fix**: Go to giscus.app, reconfigure, copy new category ID

### Comments Appearing in Wrong Discussion

- **Issue**: Multiple pages mapping to same discussion
- **Fix**: Use unique pathnames (e.g., `/blog/post-1`, `/blog/post-2`)

---

## Moderation

### Comment Moderation

1. Go to your repo → **Discussions**
2. Find the discussion (auto-created by Giscus)
3. You have full GitHub moderation powers:
   - ✏️ Edit comments
   - 🗑️ Delete spam
   - 🚫 Block users
   - 📌 Pin important comments

### Privacy

- All comments are stored on GitHub Discussions (public)
- Users must sign in with GitHub (no anonymous comments)
- You can disable comments by locking the discussion

---

## Benefits of Giscus

✅ **No Database Required** - Uses GitHub Discussions as backend  
✅ **No Hosting Costs** - Completely free  
✅ **Spam Protection** - Requires GitHub authentication  
✅ **SEO Friendly** - Comments indexed by search engines  
✅ **Markdown Support** - Users can format comments  
✅ **Emoji Reactions** - GitHub-style reactions  
✅ **Open Source** - Self-hostable if needed  

---

## Next Steps

✅ Giscus is now ready!

Continue to:
- **Supabase Setup** → [setup-supabase.md](./setup-supabase.md)
- **Directus Setup** → [setup-directus.md](./setup-directus.md)

---

## Resources

- [Giscus Website](https://giscus.app)
- [Giscus GitHub](https://github.com/giscus/giscus)
- [GitHub Discussions Docs](https://docs.github.com/en/discussions)
- [Advanced Usage](https://github.com/giscus/giscus/blob/main/ADVANCED-USAGE.md)
