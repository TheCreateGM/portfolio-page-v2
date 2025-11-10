# Umami Setup Guide - Vercel (100% Free)

## Overview

Umami is a privacy-focused analytics platform. We'll deploy it on Vercel (same platform as your frontend) with a free PostgreSQL database.

**Estimated Time**: 15-20 minutes  
**Difficulty**: Easy  
**Cost**: 100% FREE (Vercel + Supabase PostgreSQL)  
**Requirements**: GitHub account

---

## Why Vercel + Supabase for Umami?

✅ **100% free** (no credit card required)  
✅ **Same platform** as your frontend  
✅ **Use existing Supabase** PostgreSQL (you already have it!)  
✅ **Auto-deploys** from GitHub  
✅ **GDPR compliant** (no cookies, respects privacy)  
✅ **Lightweight** (~2KB script)

---

## Option 1: Umami on Vercel with Supabase DB (Recommended) ⭐

Since you already have Supabase, let's use its PostgreSQL database for Umami!

### Step 1: Fork Umami Repository

1. **Go to**: https://github.com/umami-software/umami
2. **Click**: "Fork" (top right)
3. **Create fork** in your GitHub account

---

### Step 2: Get Supabase Connection String

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `portfolio-prod` (or whatever you named it)
3. **Go to**: Settings → Database
4. **Copy "Connection string"** under "Connection pooling"
5. **It looks like**: `postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres`

**IMPORTANT**: Replace `[PASSWORD]` with your actual database password!

---

### Step 3: Deploy to Vercel

1. **Go to**: https://vercel.com/new
2. **Import** your forked `umami` repository
3. **Configure Project**:
   - **Project Name**: `portfolio-analytics` (or your preference)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)

4. **Environment Variables** - Add these:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `postgresql://postgres.[PROJECT]:[PASSWORD]@...` |
   | `APP_SECRET` | Generate random 32-char string ⭐ |

   **Generate APP_SECRET**:
   ```bash
   # Run this in your terminal
   openssl rand -base64 32
   ```

5. **Click**: "Deploy"
6. **Wait 2-3 minutes** for deployment

---

### Step 4: Run Database Migrations

Umami needs to create tables in your Supabase database.

1. **Once deployed**, go to your Vercel project
2. **Go to**: Settings → Environment Variables
3. **Verify** `DATABASE_URL` is set correctly
4. **Go to**: Deployments → Your latest deployment
5. **Click**: "..." → "Redeploy"

On first deploy, Umami automatically runs migrations.

**Verify**: Check Supabase → Table Editor - you should see new `umami_*` tables.

---

### Step 5: Access Umami Dashboard

1. **Get your Vercel URL**: `https://portfolio-analytics.vercel.app`
2. **Open in browser**
3. **Default Login**:
   - Username: `admin`
   - Password: `umami`

4. **IMPORTANT**: Change password immediately!
   - Click profile icon → Settings → Change Password

---

### Step 6: Create Website in Umami

1. **Click**: "+ Add Website"
2. **Fill in**:
   - **Name**: `Portfolio`
   - **Domain**: `axogm.vercel.app` (your production domain)
   - **Timezone**: Your timezone

3. **Click**: "Save"

4. **Copy Tracking Code**:
   - Click on website → "Edit"
   - Go to "Tracking Code" tab
   - **Copy Website ID** (UUID like `abc123...`)

---

### Step 7: Update .env.local

```bash
VITE_UMAMI_SCRIPT_URL=https://portfolio-analytics.vercel.app/script.js
VITE_UMAMI_WEBSITE_ID=abc123-your-website-id-here
```

**Replace** with your actual Vercel URL and Website ID.

---

## Option 2: Umami Cloud (Alternative)

If you prefer official hosting:

1. **Sign up**: https://cloud.umami.is
2. **14-day free trial** (then $9/month)
3. ❌ **Not permanently free**

Only use if you plan to pay later.

---

## Step 8: Update CSP Header

Add your Umami domain to CSP in `vercel.json`:

```json
"script-src": "'self' ... https://portfolio-analytics.vercel.app",
"connect-src": "'self' ... https://portfolio-analytics.vercel.app"
```

See `docs/csp-configuration.md` for detailed instructions.

---

## Step 9: Test Analytics

### Local Testing

```bash
# Start dev server
npm run dev

# Open http://localhost:5173
# Navigate around
# Check Umami dashboard for real-time visitors
```

### Verify Script Loaded

1. **Open browser** DevTools (F12)
2. **Network tab** → Filter by `script.js`
3. **You should see**: Request to `https://portfolio-analytics.vercel.app/script.js`
4. **Status**: 200 OK

---

### Check Umami Dashboard

1. **Open Umami**: `https://portfolio-analytics.vercel.app`
2. **Login**
3. **Select your website**
4. **You should see**:
   - Real-time visitors
   - Page views
   - Referrers
   - Devices/browsers

---

## Step 10: Deploy to Production (Vercel)

### Add Environment Variables to Vercel

1. **Go to**: Vercel Dashboard → Your portfolio project
2. **Settings** → **Environment Variables**
3. **Add** for Production, Preview, and Development:

   | Name | Value |
   |------|-------|
   | `VITE_UMAMI_SCRIPT_URL` | `https://portfolio-analytics.vercel.app/script.js` |
   | `VITE_UMAMI_WEBSITE_ID` | `your-website-id` |

4. **Redeploy**: Vercel will auto-redeploy with new env vars

---

## Troubleshooting

### "Database connection failed"

- **Issue**: Wrong `DATABASE_URL`
- **Fix**: Check Supabase connection string is correct
- **Verify**: Use "Connection pooling" URL (port 6543), not direct connection

### "umami_event table doesn't exist"

- **Issue**: Migrations didn't run
- **Fix**: Redeploy on Vercel, migrations run automatically

### Script Not Loading (404)

- **Issue**: Wrong `VITE_UMAMI_SCRIPT_URL`
- **Fix**: Ensure URL ends with `/script.js`

### No Data in Dashboard

- **Issue**: Wrong `VITE_UMAMI_WEBSITE_ID`
- **Fix**: Copy Website ID from Umami dashboard (UUID format)

### "Cannot read property 'insertBefore'"

- **Issue**: CSP blocking script
- **Fix**: Add Umami domain to CSP `script-src` and `connect-src`

### Localhost Not Tracked

- **Issue**: Umami ignores localhost by default (good for privacy!)
- **Fix**: This is expected. Test on production/preview deployments

---

## Privacy Features

✅ **No cookies** - Compliant with GDPR, CCPA  
✅ **No personal data** - Only aggregate stats  
✅ **Respects Do Not Track** (DNT)  
✅ **Hash-based tracking** - Visitor IP hashed, not stored  
✅ **Self-hosted** - You own your data  

---

## Free Tier Limits

### Vercel
- **Function Invocations**: 100GB-hours/month
- **Bandwidth**: 100GB/month
- ✅ Enough for small-medium traffic portfolio

### Supabase PostgreSQL
- **Database Size**: 500MB free
- **Umami Usage**: ~1-5MB/month (depends on traffic)
- ✅ Well within free tier

**Combined**: 100% free for portfolio analytics!

---

## Advanced: Custom Domain

If you want Umami on your own domain:

1. **In Vercel**: Umami project → Settings → Domains
2. **Add**: `analytics.yourdomain.com`
3. **Update DNS**: Add CNAME record
4. **Update** `.env.local` with new domain

---

## Next Steps

✅ Umami is now ready!

All services configured:
- ✅ Giscus (Comments)
- ✅ Supabase (Auth + DB)
- ✅ Directus (CMS)
- ✅ Meilisearch (Search)
- ✅ Umami (Analytics)

**What's next**:
1. **Test everything** with `npm run dev`
2. **Add content** to Directus
3. **Deploy to production**
4. **Monitor analytics** in Umami

---

## Resources

- [Umami Docs](https://umami.is/docs)
- [Umami GitHub](https://github.com/umami-software/umami)
- [Vercel Docs](https://vercel.com/docs)
- [Umami + Vercel Guide](https://umami.is/docs/running-on-vercel)
