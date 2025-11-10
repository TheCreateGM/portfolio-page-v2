# Directus Setup Guide - Railway (100% Free)

## Overview

Directus is your headless CMS for managing blog posts and projects. We'll deploy it on Railway's free tier.

**Estimated Time**: 20-30 minutes  
**Difficulty**: Moderate  
**Cost**: 100% FREE ($5/month credit, auto-renews)  
**Requirements**: GitHub account (no credit card needed)

---

## Why Railway?

✅ **$5 free credit every month** (renews automatically)  
✅ **No credit card required** for trial  
✅ **PostgreSQL database included**  
✅ **Auto-SSL certificates**  
✅ **One-click Directus template**  
✅ **~500 hours uptime/month** (enough for always-on portfolio)

---

## Step 1: Sign Up for Railway

1. **Go to**: https://railway.app
2. **Click**: "Login" → "Sign in with GitHub"
3. **Authorize Railway** to access your GitHub account
4. **You get**: $5 free credit immediately (no credit card)

---

## Step 2: Deploy Directus

### Option A: Using Template (Easiest) ⭐

1. **Go to Railway Template Gallery**:
   - Visit: https://railway.app/templates
   - Or direct link: https://railway.app/template/directus

2. **Click "Deploy Now"**

3. **Configure Environment Variables**:
   Railway will show a form with these fields:
   
   - **Admin Email**: `your-email@example.com` (your email)
   - **Admin Password**: Create a strong password (save it!)
   - **Secret Key**: Click "Generate" or use random string
   - **Database**: Auto-configured ✅

4. **Click "Deploy"**

5. **Wait 3-5 minutes** for deployment

6. **Get Your URL**:
   - Click on the Directus service
   - Go to "Settings" → "Domains"
   - Copy URL: `https://your-app-name.up.railway.app`

---

### Option B: Manual Deploy (Advanced)

If template doesn't work:

1. **New Project** → "Deploy from GitHub"
2. **Connect Repository** or use empty project
3. **Add Service** → "Database" → "PostgreSQL"
4. **Add Service** → "New Service"
5. **Deploy Docker Image**: `directus/directus:latest`
6. **Add Environment Variables**:

   ```bash
   KEY=your-secret-key-here
   SECRET=your-secret-key-here
   
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=YourStrongPassword123!
   
   DB_CLIENT=pg
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_DATABASE=${{Postgres.PGDATABASE}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   
   PUBLIC_URL=https://your-app.up.railway.app
   ```

7. **Deploy**

---

## Step 3: Access Directus Admin

1. **Open your Railway URL** in browser:
   ```
   https://your-app-name.up.railway.app
   ```

2. **Login**:
   - Email: (the one you set in ADMIN_EMAIL)
   - Password: (the one you set in ADMIN_PASSWORD)

3. **You should see** the Directus admin dashboard!

---

## Step 4: Create Collections for Blog & Projects

### Create "posts" Collection

1. **Go to**: Settings (gear icon) → Data Model
2. **Click**: "Create Collection"
3. **Collection Name**: `posts`
4. **Type**: Standard
5. **Click**: "Create Collection"

### Add Fields to "posts":

Click on `posts` collection → Create Field:

| Field Name | Type | Interface | Options |
|------------|------|-----------|---------|
| `id` | UUID | Input (read-only) | Primary Key (auto-created) ✅ |
| `title` | String | Input | Required ✅ |
| `slug` | String | Input | Required ✅, Unique ✅ |
| `excerpt` | Text | Textarea | Optional |
| `content` | Text | WYSIWYG / Markdown | Required ✅ |
| `cover_image` | Image | File | Optional |
| `tags` | JSON | Tags | Optional |
| `published` | Boolean | Toggle | Default: false |
| `published_at` | Timestamp | Datetime | Optional |
| `created_at` | Timestamp | Datetime | Auto (created) ✅ |
| `updated_at` | Timestamp | Datetime | Auto (updated) ✅ |

**Field Creation Tips**:
- Click "+ Create Field" for each field
- Choose type from list
- Set options (required, unique, etc.)
- Click "Save"

---

### Create "projects" Collection

1. **Click**: "Create Collection"
2. **Collection Name**: `projects`
3. **Click**: "Create Collection"

### Add Fields to "projects":

| Field Name | Type | Interface | Options |
|------------|------|-----------|---------|
| `id` | UUID | Input (read-only) | Primary Key ✅ |
| `name` | String | Input | Required ✅ |
| `slug` | String | Input | Required ✅, Unique ✅ |
| `description` | Text | Textarea | Required ✅ |
| `url` | String | Input | Optional (live demo URL) |
| `repo_url` | String | Input | Optional (GitHub repo) |
| `cover_image` | Image | File | Optional |
| `tags` | JSON | Tags | Optional |
| `featured` | Boolean | Toggle | Default: false |
| `created_at` | Timestamp | Datetime | Auto (created) ✅ |
| `updated_at` | Timestamp | Datetime | Auto (updated) ✅ |

---

## Step 5: Configure Public Access

**IMPORTANT**: Your frontend needs read-only access to published content.

### Set Public Role Permissions

1. **Go to**: Settings → Access Control → Public
2. **Click**: "Public" role
3. **Set Permissions**:

   **For "posts" collection**:
   - ✅ Read: Custom Access Rule
     - Filter: `published = true`
     - Fields: All fields
   - ❌ Create: No
   - ❌ Update: No
   - ❌ Delete: No

   **For "projects" collection**:
   - ✅ Read: Custom Access Rule
     - Filter: (no filter = all projects)
     - Fields: All fields
   - ❌ Create: No
   - ❌ Update: No
   - ❌ Delete: No

4. **Click**: "Save"

This allows your frontend to fetch published posts and all projects without authentication.

---

## Step 6: Create Test Content

### Create a Test Blog Post

1. **Go to**: Content → posts
2. **Click**: "+ Create Item"
3. **Fill in**:
   - Title: `My First Blog Post`
   - Slug: `my-first-blog-post`
   - Excerpt: `This is a test post for my portfolio.`
   - Content: `# Hello World\n\nThis is my first blog post using Directus!`
   - Tags: `["test", "demo"]`
   - Published: ✅ (toggle ON)
   - Published At: (select today's date)
4. **Click**: "Save"

### Create a Test Project

1. **Go to**: Content → projects
2. **Click**: "+ Create Item"
3. **Fill in**:
   - Name: `Portfolio Website`
   - Slug: `portfolio-website`
   - Description: `My personal portfolio built with React and TypeScript`
   - URL: `https://axogm.vercel.app`
   - Repo URL: `https://github.com/TheCreateGM/portfolio-page-v2`
   - Tags: `["react", "typescript", "vite"]`
   - Featured: ✅ (toggle ON)
4. **Click**: "Save"

---

## Step 7: Get API URL

1. **Go to**: Settings → Project Settings
2. **Copy your Project URL**:
   ```
   https://your-app-name.up.railway.app
   ```

---

## Step 8: Update .env.local

Update your local environment file:

```bash
VITE_DIRECTUS_URL=https://your-app-name.up.railway.app
```

**Replace** `https://your-app-name.up.railway.app` with your actual Railway URL.

---

## Step 9: Test API Connection

### Test in Browser

Open your browser and test these URLs:

```bash
# Get all published posts
https://your-app-name.up.railway.app/items/posts?filter[published][_eq]=true

# Get all projects
https://your-app-name.up.railway.app/items/projects

# Get single post by slug
https://your-app-name.up.railway.app/items/posts?filter[slug][_eq]=my-first-blog-post
```

You should see JSON responses with your content!

### Test from Your App

```bash
# Start dev server
npm run dev

# Open http://localhost:5173/blog
# You should see your test post!
```

---

## Step 10: Update CSP Header (vercel.json)

Add your Railway domain to CSP:

```json
"connect-src": "'self' ... https://your-app-name.up.railway.app",
"img-src": "'self' data: https: blob: https://your-app-name.up.railway.app"
```

See `docs/csp-configuration.md` for detailed instructions.

---

## Troubleshooting

### "Failed to connect to database"

- **Issue**: PostgreSQL not connected
- **Fix**: Check Railway environment variables reference Postgres correctly
- **Solution**: Use `${{Postgres.PGHOST}}` syntax

### "Forbidden" or "Unauthorized"

- **Issue**: Public role permissions not set
- **Fix**: Go to Settings → Access Control → Public → Enable Read for collections

### "Collection not found"

- **Issue**: Collections not created
- **Fix**: Go to Settings → Data Model → Create collections

### Railway App Sleeps

- **Issue**: Free tier spins down after inactivity
- **Fix**: First request after sleep takes 10-30 seconds (normal)
- **Solution**: Upgrade to prevent sleep OR accept occasional cold starts

### CORS Errors

- **Issue**: Cross-origin request blocked
- **Fix**: Directus automatically allows CORS. Check if PUBLIC_URL is set correctly

---

## Railway Free Tier Limits

**Monthly Credits**: $5 (renews automatically)  
**Uptime**: ~500 hours/month (always-on for portfolio)  
**Database**: 1GB PostgreSQL  
**Bandwidth**: 100GB/month  
**No Sleep**: App stays active (doesn't sleep like Render)

**Usage Estimate for Portfolio**:
- Directus + PostgreSQL: ~$3-4/month
- ✅ Fits comfortably in free tier

---

## Next Steps

✅ Directus is now ready!

Continue to:
- **Meilisearch Setup** → [setup-meilisearch.md](./setup-meilisearch.md)
- **Umami Setup** → [setup-umami.md](./setup-umami.md)

---

## Resources

- [Directus Docs](https://docs.directus.io/)
- [Directus API Reference](https://docs.directus.io/reference/introduction.html)
- [Railway Docs](https://docs.railway.app/)
- [Railway Templates](https://railway.app/templates)
