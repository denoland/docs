import Server from "lume/core/server.ts";
import REDIRECTS from "./_redirects.json" with { type: "json" };

const server = new Server({
  port: 8000,
  root: ".",
});

REDIRECTS["/api/"] = "/api/deno/";

server.use(async (req, next) => {
  const url = new URL(req.url, "http://localhost:8000");
  const redirect = REDIRECTS[url.pathname] || REDIRECTS[url.pathname + "/"];
  if (redirect) {
    return new Response(null, {
      status: 301,
      headers: {
        "Location": redirect,
      },
    });
  } else {
    return await next(req);
  }
});

server.start();

console.log("Listening on http://localhost:8000");
