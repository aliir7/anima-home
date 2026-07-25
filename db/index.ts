import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Maximum concurrent connections
  max: 5,

  // Maximum time to wait for a new connection
  connectionTimeoutMillis: 5_000,

  // Close idle connections after 30 seconds
  idleTimeoutMillis: 30_000,

  // Allow Node.js process to exit when idle
  allowExitOnIdle: true,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

export const db = drizzle({
  client: pool,
  schema,
});

export { pool };
