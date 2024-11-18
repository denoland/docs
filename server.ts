import "@std/dotenv/load";

import Server from "lume/core/server.ts";
import apiDocumentContentTypeMiddleware from "./middleware/apiDocContentType.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";
import redirectsMiddleware from "./middleware/redirects.ts";
import createRoutingMiddleware from "./middleware/functionRoutes.ts";

export const server = new Server({ root: "." });

server.use(redirectsMiddleware);
server.use(createRoutingMiddleware());
server.use(createGAMiddleware(server));
server.use(apiDocumentContentTypeMiddleware);

server.start();

console.log("Listening on http://localhost:8000");
