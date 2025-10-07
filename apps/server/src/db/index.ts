import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import { rootDir } from "@/utils/paths";

const sqlite = new Database(`${rootDir}/cm3k.db`);
export const db = drizzle(sqlite);
export const migrateDb = () => {
  try {
    migrate(db, { migrationsFolder: `${rootDir}/migrations` });
  } catch (error) {
    console.error(error);
  }
};
