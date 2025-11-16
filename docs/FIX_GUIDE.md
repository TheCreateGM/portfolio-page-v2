# 🚨 Critical Fixes Applied

## Issues Fixed

### 1. ✅ Node.js Version Compatibility (CRITICAL)

**Problem:** `@directus/sdk@20.1.1` requires Node.js >= 22, but CI/CD was using Node 20

**Fixed:**
- Updated `.github/workflows/build.yml` to use Node 22
- Updated `.gitlab-ci.yml` to use Node 22
- Added `engines` field to `package.json` to enforce Node 22+

**Action Required:**
```bash
# Check your local Node version
node --version

# If you have Node < 22, upgrade using nvm:
nvm install 22
nvm use 22
nvm alias default 22

# Or download from: https://nodejs.org/
```

### 2. ⚠️ Giscus 404 Error (NEEDS YOUR ACTION)

**Problem:** Getting `404: NOT_FOUND` when loading comments

**Root Cause:** Incorrect or missing Giscus configuration IDs

**Fix Steps (5 minutes):**

#### Step 1: Enable GitHub Discussions
```bash
# Visit your repo settings:
https://github.com/TheCreateGM/portfolio-page-v2/settings

# Enable Discussions:
1. Scroll to "Features"
2. Check ✅ "Discussions"
3. Click "Set up discussions"
```

#### Step 2: Install Giscus App
```bash
# Visit:
https://github.com/apps/giscus

# Install:
1. Click "Install" or "Configure"
2. Select: TheCreateGM/portfolio-page-v2
3. Grant permissions
```

#### Step 3: Get Correct Configuration
```bash
# Visit:
https://giscus.app

# Configure:
1. Repository: TheCreateGM/portfolio-page-v2
2. Page ↔️ Discussions Mapping: pathname
3. Discussion Category: Select "Announcements" (or create "Comments")
4. Features: Enable reactions, metadata, etc.

# IMPORTANT: Copy these values from the generated script:
# - data-repo-id (e.g., R_kgDOPeMVXQ)
# - data-category-id (e.g., DIC_kwDOPeMVXc4Cx2cW)
```

#### Step 4: Update Local Environment
Edit `.env.local` with the CORRECT IDs from Step 3:

```bash
# Replace these with YOUR actual values from giscus.app:
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=R_kgDOPeMVXQ  # ← REPLACE with your actual ID
VITE_GISCUS_CATEGORY=Announcements  # or "Comments"
VITE_GISCUS_CATEGORY_ID=DIC_kwDOPeMVXc4Cx2cW  # ← REPLACE with your actual ID
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_STRICT=1
VITE_GISCUS_REACTIONS_ENABLED=1
VITE_GISCUS_EMIT_METADATA=1
VITE_GISCUS_INPUT_POSITION=top
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
VITE_GISCUS_LOADING=lazy
```

#### Step 5: Update Vercel Environment Variables
```bash
# Go to Vercel dashboard:
https://vercel.com/your-username/portfolio-page-v2/settings/environment-variables

# Add/Update these variables (use values from Step 3):
VITE_GISCUS_REPO=TheCreateGM/portfolio-page-v2
VITE_GISCUS_REPO_ID=<your-actual-repo-id>
VITE_GISCUS_CATEGORY=Announcements
VITE_GISCUS_CATEGORY_ID=<your-actual-category-id>
VITE_GISCUS_MAPPING=pathname
VITE_GISCUS_STRICT=1
VITE_GISCUS_REACTIONS_ENABLED=1
VITE_GISCUS_EMIT_METADATA=1
VITE_GISCUS_INPUT_POSITION=top
VITE_GISCUS_LANG=en
VITE_GISCUS_THEME=preferred_color_scheme
VITE_GISCUS_LOADING=lazy

# IMPORTANT: Set for ALL environments:
# ✅ Production
# ✅ Preview
# ✅ Development
```

#### Step 6: Redeploy
```bash
# Option A: Push a commit
git add .
git commit -m "fix: Update Node.js to v22 and Giscus configuration"
git push

# Option B: Manual redeploy in Vercel
# Go to Deployments → Click "..." → Redeploy
```

#### Step 7: Verify
```bash
# Run diagnostic locally:
npm run check:giscus

# Visit your blog post:
https://axogm.vercel.app/blog/welcome-to-my-portfolio

# You should see the comment section at the bottom!
```

## 🔍 Verification Checklist

After applying fixes:

- [ ] Local Node.js version is 22+
- [ ] GitHub Discussions enabled in repo settings
- [ ] Giscus app installed for your repository
- [ ] Correct repo ID and category ID obtained from giscus.app
- [ ] `.env.local` updated with correct IDs
- [ ] Vercel environment variables updated with correct IDs
- [ ] Application redeployed
- [ ] Comments section loads without 404 error
- [ ] CI/CD builds pass successfully

## 🐛 Troubleshooting

### Still getting 404 error?

1. **Check browser console:**
   - Press F12 on your blog post
   - Look for Giscus errors
   - Verify the repo ID and category ID being used

2. **Verify GitHub Discussions:**
   ```bash
   # Visit:
   https://github.com/TheCreateGM/portfolio-page-v2/discussions
   
   # Should show discussions page, not 404
   ```

3. **Check Giscus app permissions:**
   ```bash
   # Visit:
   https://github.com/settings/installations
   
   # Find "giscus" and verify it has access to your repo
   ```

4. **Run diagnostic:**
   ```bash
   npm run check:giscus
   ```

### CI/CD still failing?

1. **Check GitHub Actions:**
   ```bash
   # Visit:
   https://github.com/TheCreateGM/portfolio-page-v2/actions
   
   # Look for the latest workflow run
   # Verify it's using Node 22
   ```

2. **Check GitLab CI:**
   ```bash
   # Visit your GitLab project
   # Go to CI/CD → Pipelines
   # Verify Node 22 is being used
   ```

3. **Local test:**
   ```bash
   # Ensure you're using Node 22
   node --version  # Should show v22.x.x
   
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 📚 Additional Resources

- **Node.js 22 Download:** https://nodejs.org/
- **Giscus Configuration:** https://giscus.app
- **GitHub Discussions Docs:** https://docs.github.com/en/discussions
- **Vercel Environment Variables:** https://vercel.com/docs/environment-variables

## 🆘 Need More Help?

If issues persist:

1. Check the detailed guides:
   - `docs/GISCUS_SETUP.md` - Complete Giscus setup
   - `docs/TROUBLESHOOTING.md` - Common issues
   - `docs/CI_CD_SETUP.md` - CI/CD configuration

2. Run diagnostics:
   ```bash
   npm run check:giscus
   npm run check:all
   ```

3. Verify environment:
   ```bash
   node --version
   npm --version
   cat .env.local | grep GISCUS
   ```
