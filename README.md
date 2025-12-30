# Pastebin-Lite

A small Pastebin-like application built with Next.js.

## Features

- Create text pastes via UI
- Optional TTL and max view limits
- Deterministic time testing support
- Persistent storage using Vercel KV or Supabase Postgres

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 to create pastes.

## Persistence

Uses Supabase Postgres as the persistence layer. The app connects via `DATABASE_URL` environment variable, which should be set to the Supabase connection string.
