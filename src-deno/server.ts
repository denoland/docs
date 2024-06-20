import { Hono } from "./deps.ts";
import { serveStatic } from "./deps.ts";
import configureRedirects from "./redirects.ts";
import { contentType } from "jsr:@std/media-types/content-type";
import { extname } from "jsr:@std/path";

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
Deno.serve(async (req, info) => {
  const url = new URL(req.url);

  if (url.pathname === "/api" || url.pathname === "/api/") {
    return new Response(null, {
      headers: {
        "location": "/api/deno",
      },
      status: 302,
    });
  } else if (url.pathname.startsWith("/api")) {
    const fsPath = url.pathname.slice(1);

    try {
      const stat = await Deno.lstat(fsPath);

      if (stat.isDirectory && !url.pathname.endsWith("/")) {
        return new Response(null, {
          headers: {
            "location": url.pathname + "/",
          },
          status: 302,
        });
      }
    } catch (_e) {
      //
    }

    try {
      if (fsPath.endsWith("/")) {
        const content = await Deno.open(fsPath + "index.html");
        return new Response(content.readable, {
          headers: {
            "content-type": "text/html",
          },
        });
      } else if (fsPath.endsWith(".html")) {
        return new Response(null, {
          headers: {
            "location": url.pathname.slice(
              0,
              fsPath.endsWith("index.html") ? -10 : -5,
            ),
          },
          status: 302,
        });
      } else if (fsPath.endsWith(".css") || fsPath.endsWith(".js")) {
        const content = await Deno.open(fsPath);
        return new Response(content.readable, {
          headers: {
            "content-type": contentType(extname(fsPath))!,
          },
        });
      } else {
        const content = await Deno.open(fsPath + ".html");
        return new Response(content.readable, {
          headers: {
            "content-type": "text/html",
          },
        });
      }
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return new Response(null, {
          status: 404,
        });
      } else {
        throw e;
      }
    }
  } else {
    return app.fetch(req, info);
  }
});
