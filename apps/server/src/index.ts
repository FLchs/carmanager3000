import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { type RouterClient } from "@orpc/server";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { migrateDb } from "./db";
import { router } from "./routers";

// Ensure database is up to date the server
migrateDb();

const app = new Hono();

export const apiHandler = new OpenAPIHandler(router, {
  plugins: [
    new OpenAPIReferencePlugin({
      schemaConverters: [
        new ZodToJsonSchemaConverter(),
        // new experimental_ArkTypeToJsonSchemaConverter(),
        // new experimental_ArkTypeToJsonSchemaConverter({
        //   fallback: (ctx) => ctx.base,
        // }),
      ],
    }),
  ],
});

app.use(logger());
app.use(
  "/*",
  cors({
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "OPTIONS"],
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
