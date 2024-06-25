import { Hono } from "./deps.ts";
import { serveStatic } from "./deps.ts";
import configureRedirects from "./redirects.ts";

const kv = await Deno.openKv();
const app = new Hono();

// Configure redirects
configureRedirects(app);

// Static site
app.use("*", serveStatic({ root: "./" }));

// 404s
app.notFound(async (c) => {
  try {
    await kv.set(["404s", c.req.path], c.req.path);
  } catch (e) {
    console.error(e);
  } finally {
    console.error("404 error returned for path: ", c.req.path);
  }

  const f = await Deno.readTextFile("./404.html");
  c.status(404);
  return c.html(f);
});

// Serve on port 8000
Deno.serve(app.fetch);
