import "jsr:@std/dotenv/load";

import Server from "https://deno.land/x/lume@v2.4.1/core/server.ts";
import NotFoundMiddleware from "https://deno.land/x/lume@v2.4.1/middlewares/not_found.ts";
import apiDocumentContentTypeMiddleware from "./middleware/apiDocContentType.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";
import redirectsMiddleware from "./middleware/redirects.ts";
import createRoutingMiddleware from "./middleware/functionRoutes.ts";

export const server = new Server({ root: "." });

server.use(redirectsMiddleware);
server.use(NotFoundMiddleware({ root: ".", page404: "./404/" }));
server.use(createRoutingMiddleware());
server.use(createGAMiddleware(server));
server.use(apiDocumentContentTypeMiddleware);

server.start();

console.log("Listening on http://localhost:8000");
