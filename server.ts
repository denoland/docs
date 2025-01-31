// process.env = Deno.env.toObject();
import "data:application/javascript;charset=utf-8;base64,cHJvY2Vzcy5lbnYgPSBEZW5vLmVudi50b09iamVjdCgpOw=="

import "@std/dotenv/load";

import Server from "lume/core/server.ts";
import NotFoundMiddleware from "lume/middlewares/not_found.ts";
import apiDocumentContentTypeMiddleware from "./middleware/apiDocContentType.ts";
import createGAMiddleware from "./middleware/googleAnalytics.ts";
import redirectsMiddleware from "./middleware/redirects.ts";
import createRoutingMiddleware from "./middleware/functionRoutes.ts";

export const server = new Server({ root: "." });

server.use(redirectsMiddleware);
server.use(NotFoundMiddleware({ root: ".", page404: "./404" }));
server.use(createRoutingMiddleware());
server.use(createGAMiddleware(server));
server.use(apiDocumentContentTypeMiddleware);

server.start();

console.log("Listening on http://localhost:8000");
