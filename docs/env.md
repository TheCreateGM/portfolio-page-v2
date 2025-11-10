# Environment Variables

This document explains all environment variables required for the portfolio application.

## Overview

All environment variables use the `VITE_` prefix to be accessible in the client-side Vite application. These variables are embedded during build time and are safe to expose (except where noted).

---

## Required Variables

### Supabase (Auth + Database + Storage)

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

| Variable | Description | Security | Where to Find |
|----------|-------------|----------|---------------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | ✅ Public | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Public anonymous key | ✅ Public | Supabase Dashboard → Settings → API |

**Notes:**
- The anon key is **safe to expose** - it's designed for client-side use
- Row-Level Security (RLS) policies protect your data
- Never use the `service_role` key on the client

---

### Directus (Headless CMS)

```bash
VITE_DIRECTUS_URL=https://cms.yourdomain.com
```

| Variable | Description | Security | Where to Find |
|----------|-------------|----------|---------------|
| `VITE_DIRECTUS_URL` | Base URL of your Directus instance | ✅ Public | Your Directus deployment URL |

**Notes:**
- Configure public role for read-only access to published content
- No authentication token needed if public role is properly configured
- Admin access via Directus UI (not client-side)

---

### Meilisearch (Search Engine)

```bash
VITE_MEILISEARCH_URL=https://search.yourdomain.com
VITE_MEILISEARCH_KEY=your-search-only-api-key
```

| Variable | Description | Security | Where to Find |
|----------|-------------|----------|---------------|
| `VITE_MEILISEARCH_URL` | Meilisearch instance URL | ✅ Public | Your Meilisearch deployment |
| `VITE_MEILISEARCH_KEY` | Search-only API key | ⚠️ Limited | Meilisearch Dashboard → Keys |

**Notes:**
- Use a **search-only key** (not master key)
- Search-only key allows queries but not index modifications
- Create indexes with master key, then use search key in client

---

### Giscus (GitHub-based Comments)

```bash
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOxxxxxx
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxx
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=light
```

| Variable | Description | Security | Where to Find |
|----------|-------------|----------|---------------|
| `VITE_GISCUS_REPO` | GitHub repo in format `owner/repo` | ✅ Public | Your GitHub repository |
| `VITE_GISCUS_REPO_ID` | GitHub repository ID | ✅ Public | https://giscus.app (configuration tool) |
| `VITE_GISCUS_CATEGORY` | Discussions category name | ✅ Public | GitHub repo → Discussions settings |
| `VITE_GISCUS_CATEGORY_ID` | Category ID | ✅ Public | https://giscus.app |
| `VITE_GISCUS_MAPPING` | Comment mapping strategy | ✅ Public | Usually `pathname` or `title` |
| `VITE_GISCUS_LANG` | Interface language | ✅ Public | e.g., `en`, `es`, `fr` |
| `VITE_GISCUS_THEME` | Comment theme | ✅ Public | e.g., `light`, `dark`, `preferred_color_scheme` |

**Setup Steps:**
1. Enable Discussions in your GitHub repository
2. Visit https://giscus.app
3. Follow the configuration wizard
4. Copy generated IDs

---

### Umami (Analytics)

```bash
VITE_UMAMI_SCRIPT_URL=https://analytics.yourdomain.com/script.js
VITE_UMAMI_WEBSITE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

| Variable | Description | Security | Where to Find |
|----------|-------------|----------|---------------|
| `VITE_UMAMI_SCRIPT_URL` | URL to Umami tracking script | ✅ Public | Umami Dashboard → Settings → Tracking Code |
| `VITE_UMAMI_WEBSITE_ID` | Your website's tracking ID | ✅ Public | Umami Dashboard → Websites |

**Notes:**
- Privacy-friendly analytics (GDPR compliant)
- No cookies, respects Do Not Track
- Self-host or use Umami Cloud

---

## Setup Instructions

### Local Development

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your credentials:**
   ```bash
   # Edit .env.local with your favorite editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Verify variables are loaded:**
   ```bash
   npm run dev
   ```
   Check browser console: `import.meta.env.VITE_*` should show your values

---

### Vercel Deployment

1. **Go to your Vercel project:**
   https://vercel.com/your-username/portfolio-page-v2

2. **Navigate to Settings → Environment Variables**

3. **Add each variable:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://your-project.supabase.co`
   - Environment: Select **Production**, **Preview**, and **Development**

4. **Repeat for all variables**

5. **Redeploy:**
   - Push to main branch, or
   - Click "Redeploy" in Vercel dashboard

---

## Security Best Practices

### ✅ Safe to Expose (Public)
These are designed for client-side use:
- Supabase anon key
- Directus URL (with public role configured)
- Meilisearch search-only key
- Giscus IDs
- Umami tracking IDs

### ❌ Never Expose (Keep Secret)
These should NEVER be in client code:
- Supabase `service_role` key
- Directus admin token
- Meilisearch master key
- Database connection strings
- Any private API keys

### 🔒 Protection Mechanisms

1. **Row-Level Security (RLS) in Supabase:**
   ```sql
   -- Example: Users can only read their own profiles
   CREATE POLICY "Users can view own profile"
   ON profiles FOR SELECT
   USING (auth.uid() = id);
   ```

2. **Directus Public Role:**
   - Read-only access
   - Filter: `published = true`
   - No admin operations

3. **Meilisearch Search Key:**
   - Query only, no index modifications
   - Rate-limited if needed

4. **Content Security Policy (CSP):**
   - Configured in `vercel.json`
   - Restricts which domains can be accessed

---

## Verification Checklist

Before deploying, verify:

- [ ] All `VITE_*` variables set in `.env.local`
- [ ] `.env.local` is in `.gitignore` (never commit secrets)
- [ ] All variables added to Vercel Environment Variables
- [ ] Supabase RLS policies enabled
- [ ] Directus public role configured
- [ ] Meilisearch using search-only key
- [ ] CSP allows required domains
- [ ] Test build locally: `npm run build && npm run preview`

---

## Troubleshooting

### Variables Not Loading

**Problem:** `import.meta.env.VITE_SUPABASE_URL` is `undefined`

**Solutions:**
1. Ensure variable starts with `VITE_` prefix
2. Restart dev server after changing `.env.local`
3. Check `.env.local` is in project root (not `/src`)
4. Verify no syntax errors in `.env.local` (no quotes needed for values)

---

### CORS Errors

**Problem:** API requests blocked by CORS policy

**Solutions:**
1. **Supabase:** CORS is auto-configured for your domain
2. **Directus:** Add your domain to CORS whitelist in Directus settings
3. **Meilisearch:** Enable CORS in Meilisearch configuration
4. **Vercel:** Update CSP in `vercel.json` to allow API domains

---

### Build Fails on Vercel

**Problem:** Build fails with "Environment variable not found"

**Solutions:**
1. Add missing variable in Vercel → Settings → Environment Variables
2. Ensure variable is added to **Production** environment
3. Redeploy after adding variables
4. Check Vercel build logs for specific missing variable

---

## Environment-Specific Configurations

### Development (`.env.local`)
```bash
# Local Directus instance
VITE_DIRECTUS_URL=http://localhost:8055

# Local Meilisearch
VITE_MEILISEARCH_URL=http://localhost:7700
```

### Production (Vercel)
```bash
# Production Directus
VITE_DIRECTUS_URL=https://cms.yourdomain.com

# Production Meilisearch
VITE_MEILISEARCH_URL=https://search.yourdomain.com
```

---

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Supabase Client Library](https://supabase.com/docs/reference/javascript/installing)
- [Directus API](https://docs.directus.io/reference/introduction.html)
- [Meilisearch API Keys](https://www.meilisearch.com/docs/learn/security/master_api_keys)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Last Updated:** 2025-11-10
