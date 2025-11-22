import { rootDir } from "#utils/paths";
import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";

import * as operations from "./schemas/operations";
import * as relations from "./schemas/relations";
import * as vehicle from "./schemas/vehicle";

const sqlite = new Database(`${rootDir}/cm3k.db`);

export const db = drizzle({
  client: sqlite,
  schema: { ...vehicle, ...operations, ...relations },
});

export const migrateDb = () => {
  try {
    migrate(db, { migrationsFolder: `${rootDir}/migrations` });
  } catch (error) {
    console.error(error);
  }
};
