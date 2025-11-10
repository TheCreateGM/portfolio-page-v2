# System Architecture

## Overview

This portfolio application uses a **serverless, static-first architecture** with external API services for dynamic functionality. The frontend is a Vite + React + TypeScript SPA hosted on Vercel, communicating with various backend services via REST/GraphQL APIs.

## Architecture Diagram

```
                   ┌────────────────────────────────┐
                   │          GitHub Repo            │
                   │   (Source Control + CI/CD)      │
                   └────────────────────────────────┘
                                  │
                       (Automatic deployment)
                                  ▼
                  ┌────────────────────────────────┐
                  │         Vercel Edge            │
                  │    (Static Hosting + CDN)      │
                  │      - Vite Build Output        │
                  │      - Security Headers         │
                  │      - Client-side Routing      │
                  └──────────────┬─────────────────┘
                                 │
                    Client-side API Calls
                    (REST / GraphQL / Fetch)
                                 │
        ┌────────────────────────┴─────────────────────────┐
        │                                                  │
┌────────────────────┐                         ┌─────────────────────┐
│     Supabase       │                         │      Directus       │
│  ┌──────────────┐  │                         │  ┌──────────────┐   │
│  │ PostgreSQL   │  │                         │  │ PostgreSQL   │   │
│  │   Database   │  │                         │  │   Database   │   │
│  └──────────────┘  │                         │  └──────────────┘   │
│  ┌──────────────┐  │                         │  ┌──────────────┐   │
│  │     Auth     │  │                         │  │  REST API    │   │
│  │   (Email)    │  │                         │  │  (Public)    │   │
│  └──────────────┘  │                         │  └──────────────┘   │
│  ┌──────────────┐  │                         │  ┌──────────────┐   │
│  │   Storage    │  │                         │  │ File Manager │   │
│  │  (Optional)  │  │                         │  │    (CDN)     │   │
│  └──────────────┘  │                         │  └──────────────┘   │
└────────────────────┘                         └─────────────────────┘
        │                                                  │
        ▼                                                  ▼
┌────────────────────┐                         ┌─────────────────────┐
│   Meilisearch      │                         │       Umami         │
│  ┌──────────────┐  │                         │  ┌──────────────┐   │
│  │    Indexes   │  │                         │  │ PostgreSQL   │   │
│  │  - posts     │  │                         │  │   Database   │   │
│  │  - projects  │  │                         │  └──────────────┘   │
│  └──────────────┘  │                         │  ┌──────────────┐   │
│  Search-Only Key   │                         │  │Analytics API │   │
└────────────────────┘                         └─────────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Giscus/Repo   │
          │ (GitHub API)    │
          │  - Discussions  │
          │  - Comments     │
          └─────────────────┘
```

---

## Data Flow Patterns

### 1. Authentication Flow (Supabase)

```
User Action → Frontend (AuthContext)
    ↓
Supabase Auth API (signIn/signUp/signOut)
    ↓
JWT Token stored in localStorage
    ↓
Auto-refresh on expiry
    ↓
Protected routes check user state
```

**Security:**
- Anon key exposed (safe for client-side)
- Row-Level Security (RLS) on database tables
- JWT tokens auto-refresh
- No secrets in client code

---

### 2. Content Delivery Flow (Directus)

```
Page Load → React Component (useEffect)
    ↓
Directus SDK (readItems)
    ↓
Filter: { published: { _eq: true } }
    ↓
Public role permission (read-only)
    ↓
Render content
```

**Collections:**
- **posts** - Blog articles with slug-based routing
- **projects** - Portfolio projects with metadata

**Security:**
- Public role: read-only, published items only
- Admin role: full CRUD access via Directus UI
- No admin tokens in client code

---

### 3. Search Flow (Meilisearch)

```
User types → SearchBar (debounced)
    ↓
Meilisearch API (multi-index search)
    ↓
Indexes: posts, projects
    ↓
Return ranked results
    ↓
Render links to content
```

**Indexing Strategy:**
- Directus webhooks → Meilisearch updates
- Or scheduled batch sync script
- Search-only API key in client

---

### 4. Comments Flow (Giscus)

```
Blog post loaded → Giscus component mounts
    ↓
GitHub Discussions API
    ↓
Load comments via iframe
    ↓
User comments via GitHub login
```

**Security:**
- No server required
- GitHub OAuth handles auth
- Comments stored in GitHub Discussions

---

### 5. Analytics Flow (Umami)

```
Page view → Umami script loads
    ↓
Beacon API sends event
    ↓
Umami server records visit
    ↓
Dashboard shows stats
```

**Privacy:**
- No cookies
- IP anonymization
- Respects Do Not Track
- GDPR compliant

---

## Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS
- **State:** React Context API
- **Routing:** Custom client-side router
- **Security:** DOMPurify, validator, crypto-js

### Backend Services
- **Auth + DB:** Supabase (PostgreSQL + Auth)
- **CMS:** Directus (Headless CMS)
- **Search:** Meilisearch (Full-text search)
- **Comments:** Giscus (GitHub Discussions)
- **Analytics:** Umami (Privacy-first analytics)

### Deployment
- **Hosting:** Vercel (Static + Edge)
- **CI/CD:** GitHub Actions → Vercel
- **DNS:** Vercel domains
- **SSL:** Automatic (Let's Encrypt)

---

## Design Principles

### 1. **Static-First**
- No server-side rendering (SSR)
- All dynamic data fetched client-side
- Fast initial load with progressive enhancement

### 2. **API-Only Backend**
- No custom backend code on Vercel
- All services via external APIs
- Vercel only serves static files

### 3. **Security by Default**
- Content Security Policy (CSP) enforced
- Row-Level Security (RLS) on databases
- Public read-only access patterns
- Secrets never in client code

### 4. **Performance Optimized**
- Lazy loading components
- Image optimization
- Code splitting
- CDN delivery

### 5. **Open Source**
- All services can be self-hosted
- No vendor lock-in
- Docker Compose for local dev

---

## Request Flow Examples

### Example 1: Blog Post Page Load

```
User visits /blog/my-first-post
    ↓
Vercel serves index.html
    ↓
React Router resolves slug
    ↓
BlogPost component fetches from Directus
    ↓
getPostBySlug('my-first-post')
    ↓
Render markdown content
    ↓
Giscus component loads comments
    ↓
Umami tracks page view
```

### Example 2: User Search

```
User types "react" in SearchBar
    ↓
Debounced search (250ms)
    ↓
Parallel queries:
  - postsIndex().search('react')
  - projectsIndex().search('react')
    ↓
Merge results
    ↓
Display links to content
```

### Example 3: User Login

```
User submits email + password
    ↓
AuthContext.signIn()
    ↓
supabase.auth.signInWithPassword()
    ↓
JWT token received
    ↓
Stored in localStorage
    ↓
User state updated
    ↓
Protected routes accessible
```

---

## Scaling Considerations

### Current Setup (Small Scale)
- Vercel free tier: 100GB bandwidth/month
- Supabase free tier: 500MB database, 50MB file storage
- Directus self-hosted or managed
- Meilisearch free cloud or self-hosted

### Future Scaling Options
1. **CDN caching** - Add cache headers for static content
2. **ISR/SSG** - Migrate to Next.js for build-time generation
3. **Database optimization** - Indexes on slug, published fields
4. **Search indexing** - Batch updates vs. real-time webhooks
5. **File storage** - Move images to Cloudinary/Cloudflare R2

---

## Development Workflow

```
1. Local Development
   npm run dev → Vite dev server
   ↓
2. Feature Branch
   git checkout -b feat/new-feature
   ↓
3. Commit Changes
   git commit -m "feat: description"
   ↓
4. Push to GitHub
   git push origin feat/new-feature
   ↓
5. Vercel Preview Deploy
   Automatic preview URL generated
   ↓
6. Merge to Main
   Pull request → main branch
   ↓
7. Production Deploy
   Vercel automatic deployment
```

---

## Monitoring & Observability

- **Frontend Errors:** Vercel Analytics
- **Performance:** Vercel Speed Insights
- **User Analytics:** Umami dashboard
- **API Errors:** Browser console + Sentry (optional)
- **Build Logs:** Vercel deployment logs

---

## Backup & Recovery

### Data Backup
- **Supabase:** Automated daily backups (free tier: 7 days)
- **Directus:** PostgreSQL dumps + file backups
- **Meilisearch:** Index snapshots

### Recovery Process
1. Restore database from backup
2. Re-index Meilisearch from restored data
3. Verify data integrity
4. Redeploy frontend if needed

---

## Future Enhancements

See [Roadmap](./roadmap.md) for planned features:
- Server-Side Generation (SSG)
- Image optimization pipeline
- Advanced caching strategies
- Multi-language support
- Role-based content access
