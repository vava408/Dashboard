# Vue.js + Tailscale

## 1. Build the Vue application

This setup expects a standard Vue/Vite project containing:
- package.json
- package-lock.json
- src/
- and a `build` script producing `dist/`

## 2. Configure Tailscale

Copy `.env.example` to `.env` and set `TS_AUTHKEY` to a Tailscale auth key.

## 3. Start

```bash
docker compose up -d --build
```

To display the temporary Cloudflare link after startup:

```bash
docker compose logs -f cloudflared
```

Look for a URL like `https://xxxxx.trycloudflare.com`.

The container joins your Tailscale network as `TS_HOSTNAME`.

Because nginx serves the Vue SPA on port 80, you can expose it through Tailscale using your preferred Tailscale access method.

## Important

Do not commit `.env` to Git. The auth key is a secret.
