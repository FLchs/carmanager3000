import { RouterClient } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { migrateDb } from "./db";
import { router } from "./routers";

// Ensure database is up to date the server
migrateDb();

const app = new Hono();

const handler = new RPCHandler(router, {});

app.use(
  "/*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    origin: process.env.CORS_ORIGIN || "",
  }),
);

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    context: {}, // Provide initial context if needed
    prefix: "/rpc",
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

export default app;

export type Client = RouterClient<typeof router>;
