# eta-gh-auth — GitHub Device Flow proxy

Tiny Cloudflare Worker that the Atlas admin panel uses to sign editors in via GitHub Device Flow. GitHub's OAuth endpoints don't send CORS headers, so a same-origin proxy is required; this Worker does exactly that and nothing else.

## One-time setup

1. **Register a GitHub App** on the RGI org:
   - Settings → Developer settings → GitHub Apps → New GitHub App
   - Homepage URL: `https://renewablesgridinitiative.github.io/energy-transition-atlas/`
   - Check **Enable Device Flow**
   - Repository permissions → **Contents: Read & write** (nothing else)
   - Uncheck "Active" under Webhook (no webhook needed)
   - Create, then note the `Client ID`
   - Install the App on `RenewablesGridInitiative/energy-transition-atlas`

2. **Deploy the Worker**:
   ```bash
   cd worker
   npx wrangler login
   npx wrangler secret put CLIENT_ID       # paste the Client ID from step 1
   npx wrangler deploy
   ```

3. **Wire into the admin panel**: copy the deployed URL (e.g. `https://eta-gh-auth.<acct>.workers.dev`) and set it as `DEVICE_AUTH_WORKER` in `admin.html`. Also add it to the `connect-src` of the CSP meta tag in `admin.html` and `index.html`.

## What it does

- `POST /device/code` → proxies to `https://github.com/login/device/code`, injects `client_id` server-side
- `POST /device/token` → proxies to `https://github.com/login/oauth/access_token`, injects `client_id`
- Rejects any request whose `Origin` is not `https://renewablesgridinitiative.github.io`
- Returns JSON with CORS headers
- Holds no user secrets and is stateless

## Cost

Free tier covers 100,000 requests/day. Realistically this Worker handles ~10 calls per admin sign-in; the free tier is far more than needed.
