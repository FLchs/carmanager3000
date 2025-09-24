import { Hono } from "hono";
import { db, migrateDb } from "./db";
import { todosTable } from "./db/schemas/todo";

// Ensure database is up to date the server
migrateDb();

const app = new Hono();
app
  .get("/", async (c) => {
    const todos = await db.select().from(todosTable);
    return c.json(todos);
  })
  .get("/generate", async (c) => {
    await db.insert(todosTable).values({ name: "test", priority: 10 });
    return c.json({ ok: true });
  });

export default app;
