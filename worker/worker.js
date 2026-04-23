/**
 * Cloudflare Worker — GitHub Device Flow OAuth proxy for the Energy Transition Atlas admin.
 *
 * Why this exists: the admin panel (admin.html) signs editors in via GitHub Device Flow,
 * but GitHub's OAuth endpoints (github.com/login/*) do not send CORS headers, so browsers
 * cannot call them directly from renewablesgridinitiative.github.io. This Worker forwards
 * exactly two requests, injects the App's client_id, and returns the response with CORS.
 *
 * Setup:
 *   1. Register a GitHub App on the RGI org. Enable "Request user authorization (OAuth)
 *      during installation" AND "Enable Device Flow". Permissions: Contents: Read & write.
 *   2. Install the App on RenewablesGridInitiative/energy-transition-atlas.
 *   3. Set CLIENT_ID below (or as a wrangler secret: `wrangler secret put CLIENT_ID`).
 *   4. Deploy: `wrangler deploy`.
 *   5. Plug the deployed URL into admin.html `DEVICE_AUTH_WORKER`.
 *
 * The Worker holds no user secrets — client_id is public. It is stateless.
 */

const ALLOWED_ORIGIN = "https://renewablesgridinitiative.github.io";

// Can be overridden by a Worker secret of the same name (preferred for deploys).
// Default is the GitHub App "Energy Transition Atlas Admin" client_id (public — safe to commit).
const DEFAULT_CLIENT_ID = "Iv23liXXoCy8jlNDwakM";

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

async function forward(upstream, body) {
  const r = await fetch(upstream, {
    method: "POST",
    headers: { "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const headers = corsHeaders(ALLOWED_ORIGIN);

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }
    if (origin !== ALLOWED_ORIGIN) {
      return new Response("forbidden origin", { status: 403, headers });
    }
    if (req.method !== "POST") {
      return new Response("method not allowed", { status: 405, headers });
    }

    const url = new URL(req.url);
    const clientId = (env && env.CLIENT_ID) || DEFAULT_CLIENT_ID;

    let incoming;
    try { incoming = await req.json(); } catch { incoming = {}; }

    let upstream;
    let body;
    if (url.pathname === "/device/code") {
      upstream = "https://github.com/login/device/code";
      body = { client_id: clientId };
      if (incoming.scope) body.scope = incoming.scope;
    } else if (url.pathname === "/device/token") {
      upstream = "https://github.com/login/oauth/access_token";
      if (!incoming.device_code) {
        return new Response(JSON.stringify({ error: "missing_device_code" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
      body = {
        client_id: clientId,
        device_code: incoming.device_code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
      };
    } else {
      return new Response("not found", { status: 404, headers });
    }

    const res = await forward(upstream, body);
    return new Response(res.body, {
      status: res.status,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  },
};
