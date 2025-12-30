# Pastebin-Lite Backend

Backend for a Pastebin-like application built with Next.js API Routes.

## Features
- Create text pastes
- Optional TTL and max view limits
- Deterministic time testing support
- Persistent storage using Vercel KV (Redis)

## Running locally
```bash
npm install
npm run dev
```

## Persistence
Uses Vercel KV to ensure data survives serverless requests.

If you cannot use Vercel KV from the Vercel dashboard, you have two other recommended options:

- Vercel Postgres (Marketplace):
	- Provision Vercel Postgres via the Vercel Marketplace and bind it to your project.
	- Set `DATABASE_URL` in Project → Settings → Environment Variables (Vercel provides this automatically when binding).
	- The app will automatically use Postgres as a JSON key/value store when `DATABASE_URL` is present.

- Upstash Redis (external):
	- Create an Upstash Redis instance (https://upstash.com) and copy the REST URL and token.
	- In Vercel, set the environment variables `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
	- The app will automatically use Upstash when those env vars are present.

For local development the project falls back to an in-memory store (not persisted). To run locally
with Postgres or Upstash, create a `.env.local` with the appropriate variables and run `npm run dev`.