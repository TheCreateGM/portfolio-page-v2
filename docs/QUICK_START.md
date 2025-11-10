# Quick Start: Backend Service Setup

## 🎯 Where You Are Now

✅ **Frontend is 100% complete** - All UI components built and tested  
⏳ **Backend services need configuration** - Services are coded but not connected  

---

## 🚀 Recommended Setup Order

We'll set up services from **easiest to hardest**, giving you quick wins:

### 1. Giscus (15 min) - EASIEST ✅

**Why first?**: No hosting required, uses GitHub Discussions

**Steps**:
1. Enable GitHub Discussions on your repo
2. Install Giscus app
3. Get config from giscus.app
4. Update `.env.local`

📖 **Full Guide**: [docs/setup-giscus.md](./setup-giscus.md)

**Result**: Comments work on blog posts

---

### 2. Supabase (30 min) - EASY ✅

**Why second?**: Free tier, simple setup, authentication

**Steps**:
1. Create Supabase project
2. Copy URL and anon key
3. Enable email authentication
4. Update `.env.local`

📖 **Full Guide**: [docs/setup-supabase.md](./setup-supabase.md)

**Result**: Login/Register works

---

### 3. Directus (1-2 hours) - MODERATE 🟡

**Why third?**: Core content management, requires more setup

**Options**:
- **Cloud**: Directus Cloud (free trial)
- **Self-host**: Docker on your machine
- **Platform**: Railway, Render, Fly.io

📖 **Full Guide**: [docs/setup-directus.md](./setup-directus.md) *(coming next)*

**Result**: Blog and Projects load dynamically

---

### 4. Meilisearch (30 min) - MODERATE 🟡

**Why fourth?**: Depends on Directus content

**Options**:
- **Cloud**: Meilisearch Cloud (free tier)
- **Self-host**: Docker on your machine

📖 **Full Guide**: [docs/setup-meilisearch.md](./setup-meilisearch.md) *(coming next)*

**Result**: Search works

---

### 5. Umami (30 min) - EASY ✅

**Why last?**: Optional, doesn't block other features

**Options**:
- **Cloud**: Umami Cloud
- **Self-host**: Docker on your machine

📖 **Full Guide**: [docs/setup-umami.md](./setup-umami.md) *(coming next)*

**Result**: Analytics tracking works

---

## 📝 Step-by-Step: Your First 30 Minutes

Let's get **Giscus** running right now:

### Step 1: Enable GitHub Discussions (5 min)

```bash
# Open your repo in browser
open https://github.com/TheCreateGM/portfolio-page-v2/settings
```

1. Scroll to **Features** section
2. Check ✅ **Discussions**
3. Click **Set up discussions**

### Step 2: Install Giscus App (5 min)

```bash
# Open Giscus app
open https://github.com/apps/giscus
```

1. Click **Install**
2. Select `TheCreateGM/portfolio-page-v2`
3. Click **Authorize**

### Step 3: Configure Giscus (10 min)

```bash
# Open Giscus config
open https://giscus.app
```

1. Enter repo: `TheCreateGM/portfolio-page-v2`
2. Choose **pathname** mapping
3. Create **Comments** category
4. Copy `data-repo-id` and `data-category-id`

### Step 4: Update Environment Variables (5 min)

```bash
# Create .env.local from template
cp .env.local.template .env.local

# Edit with your favorite editor
nano .env.local  # or vim, code, etc.
```

Add your Giscus config:

```bash
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOxxxxxxx  # From giscus.app
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_CATEGORY_ID=DIC_kwDOxxxxxxx  # From giscus.app
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=light
```

### Step 5: Test It! (5 min)

```bash
# Start dev server
npm run dev
```

1. Visit any page on `http://localhost:5173`
2. Open browser DevTools (F12)
3. Look for Giscus widget at bottom of page
4. Try posting a comment
5. Check GitHub Discussions to see it appear

---

## 🎯 Today's Goal: Get 3 Services Running

If you have **2-3 hours today**, aim to complete:

✅ **Giscus** (15 min)  
✅ **Supabase** (30 min)  
⏳ **Directus** (1-2 hours) - *Can wait for tomorrow if needed*

**This gives you**:
- ✅ Working comments
- ✅ Working authentication
- ⏳ Blog/Projects (pending Directus)

---

## 📂 Environment Variables Checklist

Create `.env.local` and fill these in as you complete each service:

```bash
# ✅ Giscus (15 min)
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=
VITE_GISCUS_CATEGORY=Comments
VITE_GISCUS_CATEGORY_ID=
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=light

# ⏳ Supabase (30 min)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

# ⏳ Directus (1-2 hours)
VITE_DIRECTUS_URL=

# ⏳ Meilisearch (30 min)
VITE_MEILISEARCH_URL=
VITE_MEILISEARCH_KEY=

# ⏳ Umami (30 min)
VITE_UMAMI_SCRIPT_URL=
VITE_UMAMI_WEBSITE_ID=
```

---

## 🧪 Testing Strategy

After each service setup:

### 1. Check Browser Console (F12)

```javascript
// Should see successful API calls
Network → Filter by domain → Check responses
```

### 2. Check .env.local

```bash
# Verify no typos in keys
cat .env.local | grep VITE_
```

### 3. Test Build

```bash
npm run build
# Should build without errors
```

### 4. Test in Production Mode

```bash
npm run build && npm run preview
# Visit http://localhost:4173
```

---

## 🚨 Common Issues & Quick Fixes

### "Cannot find module .env.local"

- **Fix**: Create `.env.local` in project root
- **Location**: `/home/axogm/Documents/portfolio/updatev2/portfolio-page-v2/.env.local`

### CSP Errors in Browser Console

- **Symptom**: `Content Security Policy: The page's settings blocked...`
- **Fix**: See [docs/csp-configuration.md](./csp-configuration.md)
- **Quick test**: Temporarily disable CSP by removing `vercel.json` headers

### "Invalid API key"

- **Issue**: Wrong environment variable name or value
- **Fix**: Check `.env.local` spelling (must start with `VITE_`)
- **Debug**: Add `console.log(import.meta.env.VITE_SUPABASE_URL)` in code

### Services Work Locally but Not on Vercel

- **Issue**: Forgot to add env vars to Vercel
- **Fix**: Vercel Dashboard → Settings → Environment Variables
- **Important**: Add for Production, Preview, AND Development

---

## 🎓 Learning Resources

As you set up each service:

### Giscus
- [Giscus Docs](https://github.com/giscus/giscus)
- [GitHub Discussions Guide](https://docs.github.com/en/discussions)

### Supabase
- [Supabase Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)

### Directus
- [Directus Docs](https://docs.directus.io/)
- [Directus Quickstart](https://docs.directus.io/getting-started/quickstart.html)

---

## 🚀 Ready to Start?

Pick one:

### Option A: I'll do Giscus right now (15 min)
```bash
# Open the guide
cat docs/setup-giscus.md
# Or open in browser
open docs/setup-giscus.md
```

### Option B: I want to see all setup guides first
- ✅ [Giscus Setup](./setup-giscus.md)
- ✅ [Supabase Setup](./setup-supabase.md)
- ⏳ Directus Setup *(creating next)*
- ⏳ Meilisearch Setup *(creating next)*
- ⏳ Umami Setup *(creating next)*

### Option C: I need help with something else
Ask me any questions! I'm here to help 🤝

---

## 🎯 Success Criteria

You'll know you're done when:

✅ `npm run build` passes with 0 errors  
✅ Login/Register works  
✅ Blog posts load from Directus  
✅ Comments appear on blog posts  
✅ Search returns results  
✅ Analytics track page views  
✅ Vercel deployment succeeds  

---

**Current Status**: Ready for backend service configuration! 🚀

Let's start with Giscus - it's the quickest win! Say **"continue"** and I'll walk you through it step-by-step.
