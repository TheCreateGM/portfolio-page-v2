# Troubleshooting Guide

## 🔍 Common Issues and Solutions

### 1. Giscus 404 Error

**Symptom:** Getting `404: NOT_FOUND Code: NOT_FOUND` when trying to use comments

**Root Causes:**
- GitHub Discussions not enabled
- Giscus app not installed
- Incorrect repository ID or category ID
- Environment variables not set in Vercel

**Solutions:**

#### Step 1: Enable GitHub Discussions
1. Go to your repository settings: `https://github.com/TheCreateGM/portfolio-page-v2/settings`
2. Scroll to "Features" section
3. Check the "Discussions" checkbox
4. Click "Set up discussions"

#### Step 2: Install Giscus App
1. Visit: https://github.com/apps/giscus
2. Click "Install"
3. Select your repository: `TheCreateGM/portfolio-page-v2`
4. Grant necessary permissions

#### Step 3: Get Correct Configuration
1. Go to: https://giscus.app
2. Enter your repository: `TheCreateGM/portfolio-page-v2`
3. Select "Announcements" category (or create one)
4. Copy the generated configuration values:
   - `data-repo-id` → `VITE_GISCUS_REPO_ID`
   - `data-category-id` → `VITE_GISCUS_CATEGORY_ID`

#### Step 4: Update Environment Variables

**Local (.env.local):**
```bash
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=your-actual-repo-id
VITE_GISCUS_CATEGORY=Announcements
VITE_GISCUS_CATEGORY_ID=your-actual-category-id
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
```

**Vercel Dashboard:**
1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add all `VITE_GISCUS_*` variables
3. Set for "Production", "Preview", and "Development"
4. Redeploy your application

#### Step 5: Verify Configuration
Run the diagnostic script:
```bash
./scripts/check-giscus.sh
```

---

### 2. Large Bundle Size Warning

**Symptom:** Build warning about chunks larger than 500 KB

**Current Issue:**
```
dist/assets/index-DMqUaqSU.js  801.18 kB │ gzip: 246.70 kB
```

**Solutions:**

#### Option 1: Code Splitting with Dynamic Imports
Update your route components to use lazy loading:

```typescript
// Before
import BlogPost from './pages/BlogPost';

// After
import { lazy } from 'react';
const BlogPost = lazy(() => import('./pages/BlogPost'));
```

#### Option 2: Manual Chunk Configuration
Update `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'markdown': ['react-markdown', 'remark-gfm'],
          'supabase': ['@supabase/supabase-js'],
          'directus': ['@directus/sdk'],
          'analytics': ['@vercel/analytics', '@vercel/speed-insights'],
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
});
```

#### Option 3: Analyze Bundle
```bash
npm install --save-dev rollup-plugin-visualizer
```

Add to `vite.config.ts`:
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

---

### 3. Security Vulnerabilities

**Symptom:** 9 moderate severity vulnerabilities

**Solutions:**

#### Quick Fix (Non-breaking)
```bash
npm audit fix
```

#### Force Fix (May include breaking changes)
```bash
npm audit fix --force
```

#### Manual Review
```bash
npm audit
```

Review each vulnerability and update packages individually:
```bash
npm update package-name
```

---

### 4. Vercel Deployment Issues

**Symptom:** Deployment succeeds but app doesn't work correctly

**Checklist:**

#### Environment Variables
Ensure all required variables are set in Vercel:
- ✅ VITE_SUPABASE_URL
- ✅ VITE_SUPABASE_ANON_KEY
- ✅ VITE_DIRECTUS_URL
- ✅ VITE_MEILISEARCH_URL
- ✅ VITE_MEILISEARCH_KEY
- ✅ VITE_GISCUS_REPO
- ✅ VITE_GISCUS_REPO_ID
- ✅ VITE_GISCUS_CATEGORY
- ✅ VITE_GISCUS_CATEGORY_ID

#### Build Settings
Verify in Vercel dashboard:
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

#### CSP Headers
If you get CSP errors, check `vercel.json` includes:
```json
"script-src 'self' 'unsafe-inline' https://giscus.app"
"frame-src https://giscus.app"
```

---

### 5. GitHub Actions Workflow

**Running the Build Check:**

The workflow runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual trigger

**Manual Trigger:**
1. Go to: https://github.com/TheCreateGM/portfolio-page-v2/actions
2. Select "Build & Deployment Health Check"
3. Click "Run workflow"

**What it checks:**
- ✅ Configuration files exist
- ✅ Giscus variables are defined
- ✅ Security vulnerabilities
- ✅ Build succeeds
- ✅ Bundle size
- ✅ GitHub Discussions enabled
- ✅ TypeScript compilation
- ✅ Linting

---

## 🔧 Diagnostic Commands

### Check Giscus Configuration
```bash
./scripts/check-giscus.sh
```

### Test Build Locally
```bash
npm run build
```

### Check for Security Issues
```bash
npm audit
npm outdated
```

### Analyze Bundle Size
```bash
npm run build
ls -lh dist/assets/
```

### Test TypeScript
```bash
npx tsc -b --noEmit
```

### Run Linter
```bash
npm run lint
```

---

## 📚 Additional Resources

- **Giscus Documentation:** https://giscus.app
- **Vercel Documentation:** https://vercel.com/docs
- **Vite Build Optimization:** https://vitejs.dev/guide/build.html
- **GitHub Discussions:** https://docs.github.com/en/discussions

---

## 🆘 Still Having Issues?

1. Check GitHub Actions logs for detailed error messages
2. Review Vercel deployment logs
3. Run `./scripts/check-giscus.sh` for Giscus-specific issues
4. Check browser console for client-side errors
5. Verify all environment variables are set correctly in Vercel
