import { Hono } from "hono";
import { migrateDb } from "./db";
import { router } from "./routers";
import { RPCHandler } from "@orpc/server/fetch";
import { createORPCClient } from "@orpc/client";
import { RouterClient } from "@orpc/server";
import { cors } from "hono/cors";

// Ensure database is up to date the server
migrateDb();

const app = new Hono();

const handler = new RPCHandler(router, {});

app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/rpc/*", async (c, next) => {
  const { matched, response } = await handler.handle(c.req.raw, {
    prefix: "/rpc",
    context: {}, // Provide initial context if needed
  });

  if (matched) {
    return c.newResponse(response.body, response);
  }

  await next();
});

export default app;

export type Client = RouterClient<typeof router>;
