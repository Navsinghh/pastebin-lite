// Resilient KV wrapper:
// - In production on Vercel the `@vercel/kv` package will be used when bound.
// - If you provision Upstash Redis and set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`,
//   the wrapper will use Upstash so you can deploy even if Vercel KV isn't available.
// - Otherwise a simple in-memory Map is used for local development (not persistent).

/* eslint-disable @typescript-eslint/no-var-requires */
let kvImpl: any;

if (process.env.DATABASE_URL) {
  // Use Postgres as a simple key/value store. This allows using Vercel Postgres
  // from the Marketplace by setting DATABASE_URL in project env vars.
  const { Pool } = require("pg");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  // Ensure table exists. Use a simple table with key and jsonb value.
  async function ensureTable() {
    await pool.query(
      `CREATE TABLE IF NOT EXISTS kv_store (k TEXT PRIMARY KEY, v JSONB)`
    );
  }
  ensureTable().catch(() => {});

  kvImpl = {
    get: async (k: string) => {
      const res = await pool.query("SELECT v FROM kv_store WHERE k = $1", [k]);
      if (res.rowCount === 0) return null;
      return res.rows[0].v;
    },
    set: async (k: string, v: any) => {
      await pool.query(
        `INSERT INTO kv_store (k, v) VALUES ($1, $2) ON CONFLICT (k) DO UPDATE SET v = EXCLUDED.v`,
        [k, v]
      );
      return true;
    },
  };
} else if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  // Use Upstash Redis (REST) if configured
  const { Redis } = require("@upstash/redis");
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  kvImpl = {
    get: (k: string) => redis.get(k),
    set: (k: string, v: any) => redis.set(k, v),
  };
} else {
  try {
    // Try Vercel KV binding
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require("@vercel/kv");
    // the package may export `kv` or the default itself
    kvImpl = mod.kv ?? mod.default ?? mod;
  } catch (e) {
    // Fallback: in-memory Map (non-persistent; only for local/dev)
    const store = new Map<string, any>();
    kvImpl = {
      get: async (k: string) => {
        const v = store.get(k);
        return v === undefined ? null : v;
      },
      set: async (k: string, v: any) => {
        store.set(k, v);
        return true;
      },
    };
  }
}

export default kvImpl;
