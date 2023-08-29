import { Hono } from "https://deno.land/x/hono@v3.5.5/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.5.5/middleware.ts";

const app = new Hono();

// Configure redirects
app.get("/manual", (c) => c.redirect("/runtime/manual"));
app.get("/runtime", (c) => c.redirect("/runtime/manual"));
app.get("/deploy", (c) => c.redirect("/deploy/manual"));
app.get("/deploy/docs", (c) => c.redirect("/deploy/manual"));

// Redirect all manual paths - most should work
app.all("/manual.*", (c) => {
  const unversionedPath = c.req.path.split("/").slice(2);
  return c.redirect("/runtime/manual/" + unversionedPath.join("/"));
});

// Redirect all deploy docs paths
[
  "discord-slash",
  "fresh",
  "simple-api",
  "tutorial-blog-fresh",
  "tutorial-dynamodb",
  "tutorial-faunadb",
  "tutorial-firebase",
  "tutorial-http-server",
  "tutorial-hugo-blog",
  "tutorial-postgres",
  "tutorial-wordpress-frontend",
  "vite",
].forEach((slug) => {
  app.get(
    `/deploy/docs/${slug}`,
    (c) => c.redirect(`/deploy/tutorials/${slug}`),
  );
});

[
  "compression",
  "runtime-broadcast-channel",
  "runtime-fetch",
  "runtime-fs",
  "runtime-headers",
  "runtime-node",
  "runtime-request",
  "runtime-response",
  "runtime-sockets",
].forEach((slug) => {
  app.get(
    `/deploy/docs/${slug}`,
    (c) => c.redirect(`/deploy/api/${slug}`),
  );
});

app.all("/deploy/docs.*", (c) => {
  const unversionedPath = c.req.path.split("/").slice(3);
  return c.redirect("/deploy/manual/" + unversionedPath.join("/"));
});

// Static site
app.use("*", serveStatic({ root: "./" }));

// 404s
app.use("*", serveStatic({ root: "./", path: "./404.html" }));

// Serve on port 8000
Deno.serve(app.fetch);
