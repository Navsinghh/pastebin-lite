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

Uses Supabase Postgres as the persistence layer. The app connects via `DATABASE_URL` environment variable, which should be set to the Supabase connection string.
