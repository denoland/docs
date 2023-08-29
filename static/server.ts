import { Hono } from "https://deno.land/x/hono@v3.5.5/mod.ts";
import { serveStatic } from "https://deno.land/x/hono@v3.5.5/middleware.ts";

const app = new Hono();
app.use("*", serveStatic({ root: "./" }));
app.use("*", serveStatic({ root: "./", path: "./404.html" }));

app.get("/", (c) => c.text("Hello Deno!"));

Deno.serve(app.fetch);
