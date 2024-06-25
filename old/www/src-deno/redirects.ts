import { Hono } from "./deps.ts";

export default function configureRedirects(app: Hono) {
  // Redirect all manual paths - most should work
  app.all("/manual.*", (c) => {
    const unversionedPath = c.req.path.split("/").slice(2);
    return c.redirect("/runtime/manual/" + unversionedPath.join("/"));
  });

  app.all("/deploy/docs.*", (c) => {
    const unversionedPath = c.req.path.split("/").slice(3);
    return c.redirect("/deploy/manual/" + unversionedPath.join("/"));
  });
}
