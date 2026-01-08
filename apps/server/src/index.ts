import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { type RouterClient } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { pinoLogger } from "hono-pino";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { requestId } from "hono/request-id";
import pino from "pino";

import { migrateDb } from "./db";
import { router } from "./routers";

// Ensure database is up to date the server
migrateDb();

const app = new Hono();

app.use(requestId());

export const apiHandler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),
  ],
});

app.use(
  process.env.NODE_ENV === "PROD"
    ? pinoLogger({
      pino: {
        level: "debug",
        transport: { target: "hono-pino/debug-log", options: { colorEnabled: true } },
        timestamp: pino.stdTimeFunctions.unixTime,
      },
    })
    : logger(),
);

app.use(
  "/*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true,
    origin: process.env.CORS_ORIGIN || "",
  }),
);

app.use("/*", async (c, next) => {
  const apiResult = await apiHandler.handle(c.req.raw, {
    prefix: "/api",
  });

  if (apiResult.matched) {
    return c.newResponse(apiResult.response.body, apiResult.response);
  }

  await next();
});

export default app;

export type Client = RouterClient<typeof router>;
