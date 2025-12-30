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