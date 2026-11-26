import type { RequestHandler } from "lume/core/server.ts";
import healthRequestHandler from "./health.ts";

export default {
  "/_api/health": healthRequestHandler,
} satisfies Record<string, RequestHandler>;
