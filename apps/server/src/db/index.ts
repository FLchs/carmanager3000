import { rootDir } from "#utils/paths";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import { relations } from "./schemas/relations";

export const db = drizzle({
  connection: { url: `file://${rootDir}/cm3k.db` },
  relations: relations,
});

export const migrateDb = async () => {
  try {
    console.log(rootDir);
    await migrate(db, { migrationsFolder: `${rootDir}/migrations` });
  } catch (error) {
    console.error(error);
  }
};
