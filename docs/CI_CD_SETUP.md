# CI/CD Setup Guide

## 📋 Overview

Your portfolio now has automated build and deployment health checks for both GitHub Actions and GitLab CI/CD.

## 🔧 What's Included

### 1. GitHub Actions Workflow (`.github/workflows/build.yml`)

Automatically runs on:
- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main`
- ✅ Manual trigger

**Jobs:**
1. **Validate Configuration** - Checks required files and Giscus setup
2. **Security Audit** - Scans for vulnerabilities and outdated packages
3. **Build Test** - Compiles TypeScript, runs linter, builds project
4. **GitHub Integration** - Verifies Discussions are enabled
5. **Vercel Check** - Validates deployment configuration
6. **Summary** - Generates comprehensive report

### 2. GitLab CI/CD Pipeline (`.gitlab-ci.yml`)

**Stages:**
1. **Validate** - Configuration, Giscus, and Vercel settings
2. **Security** - Audit and dependency scanning
3. **Build** - TypeScript, linting, and production build
4. **Deploy** - Integration checks and deployment summary

### 3. Diagnostic Scripts

**`scripts/check-giscus.sh`** - Local Giscus configuration checker
```bash
npm run check:giscus
```

Validates:
- Environment variables are set
- Repository is accessible
- GitHub Discussions are enabled
- Configuration format is correct

## 🚀 Quick Start

### For GitHub Actions

1. **Enable Actions** (if not already enabled):
   - Go to: https://github.com/TheCreateGM/portfolio-page-v2/settings/actions
   - Enable "Allow all actions and reusable workflows"

2. **Run Workflow Manually**:
   - Go to: https://github.com/TheCreateGM/portfolio-page-v2/actions
   - Select "Build & Deployment Health Check"
   - Click "Run workflow"

3. **View Results**:
   - Check the workflow run for detailed logs
   - Review the summary for issues and recommendations

### For GitLab CI/CD

1. **Push to GitLab**:
   ```bash
   git remote add gitlab https://gitlab.com/your-username/portfolio-page-v2.git
   git push gitlab main
   ```

2. **View Pipeline**:
   - Go to: https://gitlab.com/your-username/portfolio-page-v2/-/pipelines
   - Click on the latest pipeline
   - Review each stage

3. **Manual Deployment**:
   - Click "Play" button on `deploy:vercel` job

### Local Checks

Run all checks locally before pushing:
```bash
# Check Giscus configuration
npm run check:giscus

# Run all checks (Giscus + Lint + Build)
npm run check:all

# Individual checks
npm run lint
npm run build
npm audit
```

## 📊 Understanding the Results

### ✅ Success Indicators

- All jobs pass with green checkmarks
- No security vulnerabilities found
- Build completes without errors
- Bundle size is reasonable (<500KB per chunk)

### ⚠️ Warnings

**Large Bundle Size:**
- Chunks over 500KB detected
- Consider code splitting (see `docs/TROUBLESHOOTING.md`)

**Security Vulnerabilities:**
- Run `npm audit fix` to resolve
- Review `npm audit` for details

**Missing Giscus Configuration:**
- Follow `docs/GISCUS_SETUP.md`
- Update environment variables in Vercel

### ❌ Failures

**Build Failure:**
- Check TypeScript errors: `npx tsc -b --noEmit`
- Check linting errors: `npm run lint`
- Review error logs in workflow

**Configuration Issues:**
- Verify all required files exist
- Check `vercel.json` for correct settings
- Ensure `.env.example` has all variables

## 🔍 Monitoring

### GitHub Actions

**View Workflow Runs:**
```
https://github.com/TheCreateGM/portfolio-page-v2/actions
```

**Check Specific Job:**
1. Click on workflow run
2. Select job from sidebar
3. Expand steps to see detailed logs

**Download Artifacts:**
- Build output is saved for 7 days
- Download from workflow run page

### GitLab CI/CD

**View Pipelines:**
```
https://gitlab.com/your-username/portfolio-page-v2/-/pipelines
```

**Check Job Logs:**
1. Click on pipeline
2. Select job
3. View logs and artifacts

**Download Artifacts:**
- Build output and reports available for 1 week
- Download from job page

## 🐛 Troubleshooting

### Workflow Not Running

**GitHub Actions:**
- Check if Actions are enabled in repository settings
- Verify workflow file is in `.github/workflows/`
- Check branch name matches trigger conditions

**GitLab CI/CD:**
- Verify `.gitlab-ci.yml` is in repository root
- Check if CI/CD is enabled in project settings
- Review pipeline configuration

### Build Failures

1. **Run locally first:**
   ```bash
   npm run check:all
   ```

2. **Check specific issues:**
   ```bash
   npx tsc -b --noEmit  # TypeScript errors
   npm run lint          # Linting errors
   npm run build         # Build errors
   ```

3. **Review logs:**
   - GitHub: Check workflow run logs
   - GitLab: Check pipeline job logs

### Giscus Issues

1. **Run diagnostic:**
   ```bash
   npm run check:giscus
   ```

2. **Follow setup guide:**
   - See `docs/GISCUS_SETUP.md`

3. **Verify in workflow:**
   - Check "GitHub Integration" job logs
   - Look for Discussions status

## 📝 Customization

### Modify GitHub Actions

Edit `.github/workflows/build.yml`:

```yaml
# Change Node version
env:
  NODE_VERSION: '20'  # Change to '18' or '22'

# Add new job
new-job:
  name: My Custom Job
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - run: echo "Custom step"
```

### Modify GitLab CI/CD

Edit `.gitlab-ci.yml`:

```yaml
# Add new stage
stages:
  - validate
  - security
  - build
  - test      # New stage
  - deploy

# Add new job
test:unit:
  stage: test
  script:
    - npm run test
```

### Add Custom Checks

Create new script in `scripts/`:

```bash
#!/bin/bash
# scripts/custom-check.sh

echo "Running custom check..."
# Your custom logic here
```

Add to `package.json`:
```json
{
  "scripts": {
    "check:custom": "bash scripts/custom-check.sh"
  }
}
```

## 🔗 Integration with Vercel

### Automatic Deployment

Vercel automatically deploys when:
- Push to `main` branch (production)
- Push to other branches (preview)
- Pull request opened (preview)

### Environment Variables

Ensure these are set in Vercel:
- All `VITE_*` variables from `.env.example`
- Especially Giscus configuration variables

### Deployment Logs

View in Vercel dashboard:
```
https://vercel.com/your-username/portfolio-page-v2/deployments
```

## 📚 Additional Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **GitLab CI/CD Docs:** https://docs.gitlab.com/ee/ci/
- **Vercel Docs:** https://vercel.com/docs
- **Troubleshooting Guide:** `docs/TROUBLESHOOTING.md`
- **Giscus Setup:** `docs/GISCUS_SETUP.md`

## 🆘 Getting Help

1. **Check workflow logs** for specific error messages
2. **Run diagnostic scripts** locally
3. **Review documentation** in `docs/` folder
4. **Check GitHub Issues** for similar problems
5. **Verify environment variables** in Vercel dashboard
