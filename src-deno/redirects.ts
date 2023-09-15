import { Hono } from "./deps.ts";

export default function configureRedirects(app: Hono) {
  app.get("/", (c) => c.redirect("/runtime/manual"));
  app.get("/manual", (c) => c.redirect("/runtime/manual"));
  app.get("/runtime/manual/introduction", (c) => c.redirect("/runtime/manual"));
  app.get("/runtime", (c) => c.redirect("/runtime/manual"));
  app.get("/deploy", (c) => c.redirect("/deploy/manual"));
  app.get("/deploy/docs", (c) => c.redirect("/deploy/manual"));

  // KV redirects
  app.get("/kv", (c) => c.redirect("/kv/manual"));
  app.get("/runtime/manual/runtime/kv", (c) => c.redirect("/kv/manual"));
  app.get(
    "/runtime/manual/runtime/kv/key_space",
    (c) => c.redirect("/kv/manual/key_space"),
  );
  app.get(
    "/runtime/manual/runtime/kv/operations",
    (c) => c.redirect("/kv/manual/operations"),
  );
  app.get(
    "/runtime/manual/runtime/kv/secondary_indexes",
    (c) => c.redirect("/kv/manual/secondary_indexes"),
  );
  app.get(
    "/runtime/manual/runtime/kv/transactions",
    (c) => c.redirect("/kv/manual/transactions"),
  );
  app.get(
    "/deploy/manual/kv",
    (c) => c.redirect("/kv/manual/on_deploy"),
  );

  app.get(
    "/runtime/manual/examples",
    (c) => c.redirect("/runtime/tutorials"),
  );

  [
    "chat_app",
    "fetch_data",
    "file_server",
    "file_system_events",
    "hashbang",
    "hello_world",
    "http_server",
    "manage_dependencies",
    "module_metadata",
    "os_signals",
    "read_write_files",
    "subprocess",
    "tcp_echo",
    "tcp_server",
    "unix_cat",
    "word_finder",
  ].forEach((slug) => {
    app.get(
      `/runtime/manual/examples/${slug}`,
      (c) => c.redirect(`/runtime/tutorials/${slug}`),
    );
  });

  [
    "apollo",
    "express",
    "mongoose",
    "mysql2",
    "planetscale",
    "prisma",
    "react",
    "redis",
    "vue",
  ].forEach((slug) => {
    app.get(
      `/runtime/manual/node/how_to_with_npm/${slug}`,
      (c) => c.redirect(`/runtime/tutorials/how_to_with_npm/${slug}`),
    );
  });

  //https://docs.deno.com/runtime/manual/advanced/typescript/
  app.get(
    "/runtime/manual/advanced/typescript",
    (c) => c.redirect("/runtime/manual/advanced/typescript/overview"),
  );

  app.get(
    "/runtime/manual/node/how_to_with_npm",
    (c) => c.redirect("/runtime/tutorials"),
  );

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

  app.get(
    "/deploy/docs/runtime-api",
    (c) => c.redirect("/deploy/api"),
  );

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
}
