# Portfolio Full-Stack Documentation

Welcome to the full-stack portfolio documentation! This project transforms a static Vite + React + TypeScript portfolio into a complete full-stack application with authentication, CMS, comments, search, and analytics.

## 📚 Table of Contents

### Getting Started
- **[🚀 QUICK START - Start Here!](./QUICK_START.md)** - 15-minute setup guide
- [Architecture Overview](./architecture.md) - System design and data flow
- [Environment Variables](./env.md) - Required configuration
- [Progress Summary](./progress-summary.md) - Current project status

### Service Setup Guides (100% Free)
- ✅ [Giscus Setup](./setup-giscus.md) - GitHub-based comments (15 min, easiest)
- ✅ [Supabase Setup](./setup-supabase.md) - Authentication and Database (30 min)
- ✅ [Directus Setup](./setup-directus.md) - CMS via Railway (20 min)
- ✅ [Meilisearch Setup](./setup-meilisearch.md) - Search via Meilisearch Cloud (15 min)
- ✅ [Umami Setup](./setup-umami.md) - Analytics via Vercel (15 min)

### Development
- [CSP Configuration](./csp-configuration.md) - Content Security Policy guide
- [Phase 7 Completion Report](./PHASE_7_COMPLETE.md) - Frontend completion details
- ⏳ [Testing Checklist](./testing.md) - Validation steps (coming soon)
- ⏳ [Self-Hosting with Docker](./docker-compose-selfhosted.md) - Run services locally (coming soon)

### Deployment
- ⏳ [Vercel Deployment Guide](./deployment-vercel.md) - Deploy to production (coming soon)

---

## 🚀 Quick Start

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/TheCreateGM/portfolio-page-v2.git
   cd portfolio-page-v2
   npm install
   ```

2. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in credentials from each service (see [Environment Variables](./env.md))

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm run preview
   ```

---

## 🏗️ Architecture at a Glance

```
                   ┌────────────────────────────────┐
                   │          GitHub Repo            │
                   └────────────────────────────────┘
                                  │
                       (Auto deploy by Vercel)
                                  ▼
                  ┌────────────────────────────────┐
                  │           Vercel Host          │
                  │        (Vite Frontend)         │
                  └──────────────┬─────────────────┘
                                 │ REST / GraphQL / Fetch
        ┌────────────────────────┴─────────────────────────┐
        │                                                  │
┌────────────────────┐                         ┌─────────────────────┐
│     Supabase       │                         │      Directus       │
│  (DB + Auth + API) │                         │  (CMS for Blog etc) │
└────────────────────┘                         └─────────────────────┘
        │                                                  │
        ▼                                                  ▼
┌────────────────────┐                         ┌─────────────────────┐
│   Meilisearch      │                         │       Umami         │
│   (Search API)     │                         │   (Analytics)       │
└────────────────────┘                         └─────────────────────┘
                   │
                   ▼
          ┌─────────────────┐
          │   Giscus/Repo   │
          │ (Comments via   │
          │  GitHub Issues) │
          └─────────────────┘
```

---

## 🛡️ Security First

- **No secrets in code** - All credentials in environment variables
- **Content Security Policy (CSP)** - Configured in `vercel.json`
- **Row-Level Security (RLS)** - Supabase table protection
- **Public read-only** - Directus and Meilisearch limited access
- **Client-side only** - No backend servers on Vercel

---

## 📝 Contributing

When making changes:

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Follow existing code patterns and TypeScript types
3. Test locally before pushing
4. Update relevant documentation
5. Commit with clear messages (e.g., `feat(cms): add blog pagination`)

---

## 🆘 Support

- Check [Testing Guide](./testing.md) for troubleshooting
- Review service-specific docs for configuration issues
- Ensure environment variables are set correctly
- Verify CSP allows required domains

---

**Version:** 2.0.0-fullstack  
**Last Updated:** 2025-11-10  
**Maintainer:** AxoGM
