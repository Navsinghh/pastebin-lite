# Pastebin-Lite

A small Pastebin-like application built with Next.js that allows users to create and share text pastes with optional time-to-live (TTL) and view count limits.

## Features

- Create text pastes via a modern web UI
- Optional TTL (time-to-live) for automatic expiration
- Optional maximum view count limits
- Shareable URLs for viewing pastes
- Safe HTML rendering to prevent script execution
- Deterministic time support for testing
- Persistent storage across deployments

## Running Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Set up environment variables (see Persistence section below)
4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Open http://localhost:3000 to create pastes

## Persistence Layer

This application uses a flexible persistence layer that supports multiple backends:

- **Primary**: PostgreSQL (via `DATABASE_URL` environment variable) - recommended for production deployments
- **Alternative**: Upstash Redis (via `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`)
- **Fallback**: In-memory storage (for local development only, not persistent)

For serverless deployments (like Vercel), you must configure either PostgreSQL or Upstash Redis. In-memory storage is insufficient for serverless environments.

### Setting up PostgreSQL (Recommended)

You can use any PostgreSQL database. For Vercel deployments, use Vercel Postgres:

1. Install Vercel Postgres in your project
2. Set the `DATABASE_URL` environment variable to your connection string

### Setting up Upstash Redis

1. Create an Upstash Redis database
2. Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` environment variables

## API Endpoints

- `GET /api/healthz` - Health check
- `POST /api/pastes` - Create a new paste
- `GET /api/pastes/:id` - Fetch paste data (JSON)
- `GET /p/:id` - View paste (HTML)

## Testing

The application supports deterministic time testing:

- Set `TEST_MODE=1` environment variable
- Use `x-test-now-ms` header with milliseconds since epoch to simulate current time

## Important Design Decisions

- **Serverless-first**: Designed for serverless platforms like Vercel with no global mutable state
- **Flexible persistence**: Supports multiple storage backends for different deployment scenarios
- **Safe rendering**: HTML content is escaped to prevent XSS attacks
- **Atomic operations**: View counting and expiry checks are handled atomically
- **Relative URLs**: No hardcoded localhost URLs in the codebase
