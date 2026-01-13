# Cloudflare Workers Deployment Guide

This guide explains how to manually deploy Martin's Flying Machines as a Cloudflare Worker.

## Prerequisites

1. **Node.js** (v16.13.0 or higher) - [Download here](https://nodejs.org/)
2. **Cloudflare Account** - [Sign up here](https://dash.cloudflare.com/sign-up)
3. **npm** or **yarn** package manager

## Installation Steps

### 1. Install Dependencies

First, install Wrangler (Cloudflare's CLI tool) and project dependencies:

```bash
npm install
```

### 2. Authenticate with Cloudflare

Login to your Cloudflare account via Wrangler:

```bash
npx wrangler login
```

This will open a browser window asking you to authorize Wrangler. Click "Allow" to proceed.

### 3. Test Locally (Optional but Recommended)

Before deploying, test the worker locally:

```bash
npm run dev
```

Visit `http://localhost:8787` in your browser to preview the site.

Press `Ctrl+C` to stop the local server when done.

## Deployment

### Deploy to Cloudflare Workers

Deploy the worker to Cloudflare:

```bash
npm run deploy
```

This will:
- Upload all static assets (HTML, CSS, images, etc.)
- Deploy the worker script
- Provide you with a `*.workers.dev` URL where your site is live

Example output:
```
✨ Success! Uploaded 47 files (2.34 sec)
✨ Deployment complete! Take a flight at:
   https://martin-flying-machines.YOUR-SUBDOMAIN.workers.dev
```

## Custom Domain Setup (Optional)

To use a custom domain:

1. **Add your domain to Cloudflare:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Click "Add a Site"
   - Follow the instructions to point your nameservers to Cloudflare

2. **Update `wrangler.toml`:**

   Uncomment and modify the routes section:
   ```toml
   [[routes]]
   pattern = "flyingmachines.com/*"
   zone_name = "flyingmachines.com"
   ```

3. **Redeploy:**
   ```bash
   npm run deploy
   ```

## Project Structure

```
martin-flying-machines-v2/
├── src/
│   └── index.js          # Cloudflare Worker script
├── css/                  # Stylesheets
├── planes/               # Aircraft pages
├── Pictures/             # Image assets
├── Images/               # Additional images
├── Videos/               # Video files
├── Plans/                # Technical plans
├── index.html            # Main landing page
├── package.json          # Node.js dependencies
├── wrangler.toml         # Cloudflare Worker configuration
└── DEPLOYMENT.md         # This file
```

## Worker Features

The deployed worker includes:

✅ **Static Asset Serving** - All HTML, CSS, JS, images are served from Cloudflare's global CDN
✅ **Intelligent Routing** - Automatic `.html` extension handling
✅ **Cache Optimization** - Long-term caching for static assets, shorter cache for HTML
✅ **Security Headers** - X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
✅ **Global CDN** - Content delivered from 275+ cities worldwide

## Useful Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run worker locally for testing |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run tail` | Stream live worker logs |
| `npx wrangler whoami` | Check authenticated account |
| `npx wrangler delete` | Remove deployed worker |

## Monitoring & Logs

View real-time logs from your deployed worker:

```bash
npm run tail
```

View analytics in the [Cloudflare Dashboard](https://dash.cloudflare.com/) under "Workers & Pages".

## Cost

Cloudflare Workers offers a generous free tier:
- **100,000 requests per day** (free)
- **10ms CPU time per request** (free tier limit)

This site easily fits within the free tier. For higher traffic, Workers paid plans start at $5/month for 10 million requests.

## Troubleshooting

### Issue: "Error: No account found"
**Solution:** Run `npx wrangler login` to authenticate

### Issue: Assets not loading
**Solution:** Check that file paths in HTML are relative (no leading `/` in paths)

### Issue: 404 errors for HTML pages
**Solution:** The worker automatically handles `.html` extensions. Make sure links work locally first.

### Issue: Deployment times out
**Solution:** Large files (videos) may slow deployment. Consider hosting videos externally (YouTube, Vimeo) or using R2 storage.

## Advanced: Using Cloudflare R2 for Large Files

If you have large video files (WMV), consider moving them to Cloudflare R2:

1. Create an R2 bucket:
   ```bash
   npx wrangler r2 bucket create flying-machines-media
   ```

2. Upload videos:
   ```bash
   npx wrangler r2 object put flying-machines-media/video.wmv --file=Videos/video.wmv
   ```

3. Update your HTML to reference R2 URLs

## Support

- **Wrangler Docs:** https://developers.cloudflare.com/workers/wrangler/
- **Workers Docs:** https://developers.cloudflare.com/workers/
- **Community:** https://community.cloudflare.com/

---

**Happy Flying! ✈️**

*Prepared by Antigravity AI*
