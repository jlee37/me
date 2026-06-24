import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// DATABASE_URL is only required at runtime, not at build time.
// Using a getter avoids throwing during Next.js static page collection.
function createDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return drizzle(sql, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    if (!_db) _db = createDb();
    return (_db as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export default db;
