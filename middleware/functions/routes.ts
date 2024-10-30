import type { RequestHandler } from "lume/core/server.ts";
import healthRequestHandler from "./health.ts";
import feedbackRequestHandler from "./feedback.ts";

export default {
    "/_api/health": healthRequestHandler,
    "/_api/send-feedback": feedbackRequestHandler
} satisfies Record<string, RequestHandler>;
