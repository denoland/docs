import { Hono } from "./deps.ts";

export default function configureRedirects(app: Hono) {
  // helper to establish redirects
  function r(from: string, to: string, status = 301) {
    app.get(from, (c) => c.redirect(to, status));
  }

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

  r(
    "/runtime/manual/advanced/typescript",
    "/runtime/manual/advanced/typescript/overview",
  );

  r(
    "/runtime/manual/node/dnt",
    "/runtime/manual/advanced/publishing/dnt",
  );

  r(
    "/runtime/manual/typescript",
    "/runtime/manual/advanced/typescript/overview",
  );

  r(
    "/runtime/manual/typescript/overview",
    "/runtime/manual/advanced/typescript/overview",
  );

  r(
    "/runtime/manual/getting_started/typescript",
    "/runtime/manual/advanced/typescript/overview",
  );

  r(
    "/runtime/manual/typescript/typescript/faqs",
    "/runtime/manual/advanced/typescript/faqs",
  );

  r(
    "/runtime/manual/vscode_deno",
    "/runtime/manual/references/vscode_deno",
  );

  r(
    "/runtime/manual/advanced/publishing/0",
    "/runtime/manual/advanced/publishing",
  );

  r(
    "/runtime/manual/getting_started/webassembly",
    "/runtime/manual/runtime/webassembly",
  );

  r(
    "/runtime/manual/basics/permissionsDeno",
    "/runtime/manual/basics/permissions",
  );

  r(
    "/runtime/manual/contributing/style_guide",
    "/runtime/manual/references/contributing/style_guide",
  );

  r(
    "/runtime/manual/jsx_dom/linkedom",
    "/runtime/manual/advanced/jsx_dom/linkedom",
  );

  r(
    "/runtime/manual/npm_nodejs/compatibility_mode",
    "/runtime/manual/node/compatibility",
  );

  r(
    "/runtime/manual/runtime/navigator_api",
    "/runtime/manual/runtime/web_platform_apis",
  );

  r("/runtime/manual/jsx_dom/twind", "/runtime/manual/advanced/jsx_dom/twind");

  r(
    "/runtime/manual/using_deno_with_other_technologies/jsx_dom",
    "/runtime/manual/advanced/jsx_dom/overview",
  );

  r(
    "/runtime/manual/linking_to_external_code/reloading_modules",
    "/runtime/manual/basics/modules/reloading_modules",
  );

  r("/runtime/manual/linkingtoexternal_code", "/runtime/manual/basics/modules");

  r(
    "/runtime/manual/getting_started/debugging_your_code",
    "/runtime/manual/basics/debugging_your_code",
  );

  r(
    "/runtime/manual/using_deno_with_other_technologies/node/cdns",
    "/runtime/manual/node/cdns",
  );

  r(
    "/runtime/manual/testing/documentation",
    "/runtime/manual/basics/testing/documentation",
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
    "static-site",
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
