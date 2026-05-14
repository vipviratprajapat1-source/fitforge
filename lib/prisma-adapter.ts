import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

import { resolveDatabaseUrl } from "./database-url";

export function createPrismaAdapter() {
  const databaseUrl = resolveDatabaseUrl();

  if (databaseUrl.startsWith("file:")) {
    return new PrismaBetterSqlite3({ url: databaseUrl });
  }

  return new PrismaPg({ connectionString: databaseUrl });
}
