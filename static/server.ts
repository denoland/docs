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

// Static site
app.use("*", serveStatic({ root: "./" }));

// 404s
app.use("*", serveStatic({ root: "./", path: "./404.html" }));

Deno.serve(app.fetch);
