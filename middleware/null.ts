import type { RequestHandler } from "lume/core/server.ts";

export default function nullMiddleware(
  req: Request,
  next: RequestHandler,
): Promise<Response> {
  return next(req);
}
