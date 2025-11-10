# Meilisearch Setup Guide - Meilisearch Cloud (100% Free)

## Overview

Meilisearch provides instant search for your blog posts and projects. We'll use the official Meilisearch Cloud free tier.

**Estimated Time**: 15 minutes  
**Difficulty**: Easy  
**Cost**: 100% FREE (100K docs, 10K searches/month)  
**Requirements**: Email address (no credit card)

---

## Why Meilisearch Cloud?

✅ **100% free tier** (no credit card required)  
✅ **100,000 documents** (way more than needed)  
✅ **10,000 searches/month** (plenty for portfolio)  
✅ **Official hosting** by Meilisearch team  
✅ **Auto-scaling and backups**  
✅ **No server management**

---

## Step 1: Sign Up for Meilisearch Cloud

1. **Go to**: https://cloud.meilisearch.com
2. **Click**: "Start for Free"
3. **Sign up** with email or GitHub
4. **Verify your email** (check inbox)
5. **Login** to dashboard

---

## Step 2: Create a Project

1. **Click**: "Create Project"
2. **Project Name**: `portfolio-search` (or your preference)
3. **Region**: Choose closest to your users (e.g., `us-east-1`, `eu-west-1`)
4. **Plan**: Select **Free** (should be pre-selected)
5. **Click**: "Create Project"
6. **Wait 1-2 minutes** for provisioning

---

## Step 3: Get API Keys

Once your project is ready:

1. **Go to**: Settings → API Keys
2. **You'll see two keys**:
   - **Default Admin API Key**: For managing indexes (backend only)
   - **Default Search API Key**: For searching (safe for frontend) ⭐

3. **Copy the Search API Key** (starts with `sk_...`)
4. **Copy the Host URL**: `https://your-project-id.meilisearch.io`

---

## Step 4: Create Indexes

Indexes are like database tables for search.

### Option A: Using Dashboard (Easy) ⭐

1. **Go to**: Indexes tab
2. **Click**: "Create Index"
3. **Index Name**: `posts`
4. **Primary Key**: `id`
5. **Click**: "Create"

6. **Repeat** for projects:
   - **Index Name**: `projects`
   - **Primary Key**: `id`
   - **Click**: "Create"

---

### Option B: Using API (Advanced)

```bash
# Create posts index
curl -X POST 'https://your-project-id.meilisearch.io/indexes' \
  -H 'Authorization: Bearer YOUR_ADMIN_API_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "uid": "posts",
    "primaryKey": "id"
  }'

# Create projects index
curl -X POST 'https://your-project-id.meilisearch.io/indexes' \
  -H 'Authorization: Bearer YOUR_ADMIN_API_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "uid": "projects",
    "primaryKey": "id"
  }'
```

---

## Step 5: Configure Search Settings

### Searchable Attributes

Tell Meilisearch which fields to search in:

1. **Go to**: Indexes → `posts` → Settings
2. **Searchable Attributes**:
   ```json
   [
     "title",
     "excerpt",
     "content",
     "tags"
   ]
   ```
3. **Click**: "Save"

4. **Repeat for `projects`**:
   ```json
   [
     "name",
     "description",
     "tags"
   ]
   ```

---

### Displayed Attributes (Optional)

Control which fields are returned:

1. **Go to**: Settings → Displayed Attributes
2. **For `posts`**:
   ```json
   [
     "id",
     "title",
     "slug",
     "excerpt",
     "cover_image",
     "tags",
     "published_at"
   ]
   ```

3. **For `projects`**:
   ```json
   [
     "id",
     "name",
     "slug",
     "description",
     "url",
     "repo_url",
     "cover_image",
     "tags"
   ]
   ```

---

## Step 6: Add Documents (Test Data)

### Option A: Using Dashboard

1. **Go to**: Indexes → `posts` → Documents
2. **Click**: "Add Documents"
3. **Paste JSON**:

```json
[
  {
    "id": "1",
    "title": "My First Blog Post",
    "slug": "my-first-blog-post",
    "excerpt": "This is a test post for my portfolio.",
    "content": "Hello World! This is my first blog post using Directus and Meilisearch!",
    "tags": ["test", "demo"],
    "published_at": "2025-11-10T00:00:00Z"
  }
]
```

4. **Click**: "Add Documents"

---

### Option B: Using API

```bash
curl -X POST 'https://your-project-id.meilisearch.io/indexes/posts/documents' \
  -H 'Authorization: Bearer YOUR_ADMIN_API_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '[
    {
      "id": "1",
      "title": "My First Blog Post",
      "slug": "my-first-blog-post",
      "excerpt": "This is a test post",
      "tags": ["test", "demo"]
    }
  ]'
```

---

## Step 7: Test Search

### Test in Dashboard

1. **Go to**: Indexes → `posts` → Search Preview
2. **Type**: `blog` or `test`
3. **You should see** your test document!

---

### Test with API

```bash
curl -X POST 'https://your-project-id.meilisearch.io/indexes/posts/search' \
  -H 'Authorization: Bearer YOUR_SEARCH_API_KEY' \
  -H 'Content-Type: application/json' \
  --data-binary '{
    "q": "blog"
  }'
```

---

## Step 8: Update .env.local

Add Meilisearch credentials:

```bash
VITE_MEILISEARCH_URL=https://your-project-id.meilisearch.io
VITE_MEILISEARCH_KEY=sk_your_search_api_key_here
```

**Important**: Use the **Search API Key**, not the Admin API Key!

---

## Step 9: Sync with Directus (Automated)

To keep Meilisearch in sync with Directus, you need automation.

### Option A: Manual Sync (Simple)

Every time you publish a post in Directus:

1. Copy the post data
2. Go to Meilisearch Dashboard → Posts → Add Documents
3. Paste JSON

**Pros**: Simple, no code  
**Cons**: Manual work

---

### Option B: Webhooks + Serverless Function (Recommended)

**Coming Soon**: Guide for auto-sync using Directus webhooks + Vercel serverless function.

For now, use manual sync for testing.

---

## Step 10: Test in Your App

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# Type in the search bar (navbar)
# You should see results from Meilisearch!
```

---

## Troubleshooting

### "Index not found"

- **Issue**: Index name doesn't match
- **Fix**: Check index names are exactly `posts` and `projects`

### "Invalid API key"

- **Issue**: Wrong API key or expired
- **Fix**: Use **Search API Key** (starts with `sk_`), not Admin key

### "No results found"

- **Issue**: No documents indexed
- **Fix**: Add test documents via dashboard or API

### "CORS Error"

- **Issue**: Meilisearch Cloud should allow CORS by default
- **Fix**: Check if you're using HTTPS (not HTTP)

### Rate Limiting

- **Free Tier**: 10,000 searches/month
- **Exceeded**: Upgrade or wait for monthly reset
- **Monitor**: Check dashboard for usage

---

## Meilisearch Cloud Free Tier Limits

**Documents**: 100,000  
**Searches**: 10,000/month  
**Storage**: 100MB  
**Indexes**: Unlimited  
**No Credit Card**: Required only after exceeding limits

**Usage Estimate for Portfolio**:
- Documents: ~50-100 (posts + projects)
- Searches: ~100-500/month (depends on traffic)
- ✅ Well within free tier

---

## Advanced: Auto-Sync with Directus

### Using Directus Flows (Webhook Alternative)

1. **In Directus**: Settings → Flows
2. **Create Flow**: "Sync to Meilisearch on Publish"
3. **Trigger**: When `posts.published` changes to `true`
4. **Action**: Webhook POST to custom endpoint
5. **Endpoint**: Vercel serverless function that calls Meilisearch API

**Guide for this coming in Phase 9** (after basic setup complete).

---

## Next Steps

✅ Meilisearch is now ready!

Continue to:
- **Umami Setup** → [setup-umami.md](./setup-umami.md)
- **Test Integration** → Run `npm run dev`

---

## Resources

- [Meilisearch Docs](https://www.meilisearch.com/docs)
- [Meilisearch Cloud](https://cloud.meilisearch.com)
- [Meilisearch JavaScript Client](https://github.com/meilisearch/meilisearch-js)
- [Search API Reference](https://www.meilisearch.com/docs/reference/api/search)
