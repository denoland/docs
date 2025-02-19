import type { RequestHandler } from "lume/core/server.ts";
import defaultRoutes from "./functions/routes.ts";

export default function createRoutingMiddleware(
  routeObject: Record<string, RequestHandler> = defaultRoutes,
) {
  return function functionRoutesMiddleware(
    req: Request,
    next: RequestHandler,
  ): Promise<Response> {
    const url = new URL(req.url);
    const route = routeObject[url.pathname];
    return route ? route(req) : next(req);
  };
}
