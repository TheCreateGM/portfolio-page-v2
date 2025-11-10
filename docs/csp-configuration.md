# Content Security Policy (CSP) Configuration

## Overview

The Content Security Policy (CSP) in `vercel.json` controls which external resources your site can load. This is a critical security feature that prevents XSS attacks and unauthorized resource loading.

## Current CSP Configuration

The current CSP in `vercel.json` includes:

```
default-src 'self';
script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com vitals.vercel-insights.com vercel.live *.vercel.app https://giscus.app;
style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com https://giscus.app;
img-src 'self' data: https: blob:;
font-src 'self' cdnjs.cloudflare.com data:;
connect-src 'self' vitals.vercel-insights.com vercel.live *.vercel.app https://*.supabase.co wss://*.supabase.co;
frame-src https://giscus.app;
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
upgrade-insecure-requests;
```

## Required Customizations

### ⚠️ IMPORTANT: You MUST update the CSP before deploying!

Once you've set up your backend services, update the `connect-src` directive in `vercel.json` to include your specific domains:

### 1. Directus CMS

Add your Directus URL to `connect-src`:

```json
"connect-src 'self' vitals.vercel-insights.com vercel.live *.vercel.app https://*.supabase.co wss://*.supabase.co https://your-directus-domain.com"
```

**Examples**:
- Self-hosted: `https://cms.yourdomain.com`
- Directus Cloud: `https://yourproject.directus.app`

Also add to `img-src` if serving images from Directus:

```json
"img-src 'self' data: https: blob: https://your-directus-domain.com"
```

### 2. Meilisearch

Add your Meilisearch URL to `connect-src`:

```json
"connect-src 'self' ... https://search.yourdomain.com"
```

**Examples**:
- Self-hosted: `https://search.yourdomain.com`
- Meilisearch Cloud: `https://ms-xxxxx.lon.meilisearch.io`

### 3. Umami Analytics

Add your Umami script URL to `script-src` and API endpoint to `connect-src`:

```json
"script-src 'self' 'unsafe-inline' ... https://analytics.yourdomain.com",
"connect-src 'self' ... https://analytics.yourdomain.com"
```

**Examples**:
- Self-hosted: `https://analytics.yourdomain.com`
- Umami Cloud: `https://analytics.umami.is`

### 4. Complete Example

Here's a complete CSP with all services configured:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com vitals.vercel-insights.com vercel.live *.vercel.app https://giscus.app https://analytics.yourdomain.com; style-src 'self' 'unsafe-inline' cdnjs.cloudflare.com https://giscus.app; img-src 'self' data: https: blob: https://cms.yourdomain.com; font-src 'self' cdnjs.cloudflare.com data:; connect-src 'self' vitals.vercel-insights.com vercel.live *.vercel.app https://*.supabase.co wss://*.supabase.co https://cms.yourdomain.com https://search.yourdomain.com https://analytics.yourdomain.com; frame-src https://giscus.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;"
}
```

## CSP Directives Explained

| Directive | Purpose | What We Allow |
|-----------|---------|---------------|
| `default-src 'self'` | Default policy for all resource types | Only from same origin |
| `script-src` | JavaScript sources | Self, inline scripts, CDNs, analytics services, Giscus |
| `style-src` | CSS sources | Self, inline styles, CDNs, Giscus |
| `img-src` | Image sources | Self, data URIs, all HTTPS (for flexibility) |
| `font-src` | Font sources | Self, CDNs, data URIs |
| `connect-src` | AJAX, WebSocket, EventSource | Self, Vercel Analytics, Supabase, Directus, Meilisearch, Umami |
| `frame-src` | iframe sources | Only Giscus (for comments) |
| `frame-ancestors` | Where this page can be embedded | Nowhere (prevents clickjacking) |
| `base-uri` | Valid base tag URIs | Only self |
| `form-action` | Valid form submission URLs | Only self |
| `upgrade-insecure-requests` | Auto-upgrade HTTP to HTTPS | All requests |

## Security Best Practices

### ✅ DO:
- Keep domains as specific as possible
- Use HTTPS for all external resources
- Test CSP changes in browser DevTools Console
- Update CSP when adding new services

### ❌ DON'T:
- Use `unsafe-eval` in `script-src` (we only use `unsafe-inline` for styled-components)
- Use wildcard `*` for `connect-src` or `script-src`
- Disable CSP entirely
- Allow `frame-ancestors` from arbitrary domains

## Testing Your CSP

### 1. Browser DevTools

Open Chrome/Firefox DevTools Console and look for CSP violations:

```
Refused to load the script 'https://example.com/script.js' because it violates 
the following Content Security Policy directive: "script-src 'self'..."
```

### 2. Report-Only Mode (Optional)

For testing, you can temporarily use `Content-Security-Policy-Report-Only` header instead:

```json
{
  "key": "Content-Security-Policy-Report-Only",
  "value": "your-csp-policy-here"
}
```

This will log violations without blocking resources.

### 3. CSP Evaluator

Use Google's CSP Evaluator to check for common issues:
https://csp-evaluator.withgoogle.com/

## Troubleshooting

### Issue: "Refused to connect to..."

**Cause**: The domain isn't in `connect-src`  
**Fix**: Add the domain to `connect-src` in vercel.json

### Issue: "Refused to load the script..."

**Cause**: The script URL isn't in `script-src`  
**Fix**: Add the domain to `script-src` in vercel.json

### Issue: "Refused to frame..."

**Cause**: The iframe URL isn't in `frame-src`  
**Fix**: Add the domain to `frame-src` in vercel.json

### Issue: Images not loading from Directus

**Cause**: Directus domain not in `img-src`  
**Fix**: Add your Directus domain to `img-src`

## Local Development

During local development (`npm run dev`), Vite doesn't enforce these headers. You'll only see CSP restrictions in:
- Production build (`npm run build && npm run preview`)
- Deployed Vercel environment

## When to Update

Update your CSP whenever you:
1. Add a new external service
2. Change domains for existing services
3. Add new CDNs or analytics tools
4. Integrate third-party widgets/embeds

## Additional Resources

- [MDN: Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
- [CSP Quick Reference](https://content-security-policy.com/)
- [OWASP CSP Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html)

---

**Last Updated**: January 2025  
**Next Review**: After service setup
