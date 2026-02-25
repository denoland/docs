import "@std/dotenv/load";

import Server from "lume/core/server.ts";
import NotFoundMiddleware from "lume/middlewares/not_found.ts";
import apiDocumentContentTypeMiddleware from "./middleware/apiDocContentType.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";
import redirectsMiddleware from "./middleware/redirects.ts";
import createRoutingMiddleware from "./middleware/functionRoutes.ts";
import expires from "lume/middlewares/expires.ts";
import createLlmsFilesMiddleware from "./middleware/llmsFiles.ts";

export const server = new Server({ root: "_site" });

server.use(redirectsMiddleware);
server.use(createLlmsFilesMiddleware({ root: "_site" }));
server.use(NotFoundMiddleware({ root: "_site", page404: "./404/" }));
server.use(createRoutingMiddleware());
server.use(createGAMiddleware(server));
server.use(apiDocumentContentTypeMiddleware);
server.use(expires({
  "defaultDuration": 60 * 60 * 1000,
  "durations": {
    "text/css": 24 * 60 * 60 * 1000,
  },
}));

server.start();

console.log("Listening on http://localhost:8000");
