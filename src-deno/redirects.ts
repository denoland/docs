import { Hono } from "./deps.ts";

export default function configureRedirects(app: Hono) {
  // helper to establish redirects
  function r(from: string, to: string, status = 301) {
    app.get(from, (c) => c.redirect(to, status));
  }

  // Landing page redirects
  r("/manual", "/runtime/manual");
  r("/runtime/manual/introduction", "/runtime/manual");
  r("/runtime", "/runtime/manual");
  r("/deploy", "/deploy/manual");
  r("/deploy/docs", "/deploy/manual");

  // KV redirects
  r("/kv", "/deploy/kv/manual");
  r("/kv/manual", "/deploy/kv/manual");
  r("/kv/manual/", "/deploy/kv/manual");
  r("/runtime/manual/runtime/kv", "/deploy/kv/manual");
  r("/runtime/manual/runtime/kv/key_space", "/deploy/kv/manual/key_space");
  r("/runtime/manual/runtime/kv/operations", "/deploy/kv/manual/operations");
  r(
    "/runtime/manual/runtime/kv/secondary_indexes",
    "/deploy/kv/manual/secondary_indexes",
  );
  r(
    "/runtime/manual/runtime/kv/transactions",
    "/deploy/kv/manual/transactions",
  );
  r("/deploy/manual/kv", "/deploy/kv/manual/on_deploy");

  // Redirects from previous top level KV category
  r("/kv/manual/key_space", "/deploy/kv/manual/key_space");
  r("/kv/manual/operations", "/deploy/kv/manual/operations");
  r("/kv/manual/key_expiration", "/deploy/kv/manual/key_expiration");
  r("/kv/manual/secondary_indexes", "/deploy/kv/manual/secondary_indexes");
  r("/kv/manual/transactions", "/deploy/kv/manual/transactions");
  r("/kv/manual/node", "/deploy/kv/manual/node");
  r("/kv/manual/queue_overview", "/deploy/kv/manual/queue_overview");
  r("/kv/manual/cron", "/deploy/kv/manual/cron");
  r(
    "/kv/manual/data_modeling_typescript",
    "/deploy/kv/manual/data_modeling_typescript",
  );
  r("/kv/manual/on_deploy", "/deploy/kv/manual/on_deploy");
  r("/kv/manual/backup", "/deploy/kv/manual/backup");
  r("/kv/tutorials", "/deploy/kv/tutorials");
  r(
    "/kv/tutorials/schedule_notification",
    "/deploy/kv/tutorials/schedule_notification",
  );
  r(
    "/kv/tutorials/webhook_processor",
    "/deploy/kv/tutorials/webhook_processor",
  );

  // Manual redirects
  r("/runtime/manual/examples", "/runtime/tutorials");
  r(
    "/runtime/manual/language_server/overview",
    "/runtime/manual/advanced/language_server/overview",
  );
  r("/runtime/manual/runtime/", "/runtime/manual/runtime/builtin_apis");
  r("/runtime/manual/testing", "/runtime/manual/basics/testing");
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

  r("/runtime/manual/npm_nodejs/cdns", "/runtime/manual/node/cdns");

  r(
    "/runtime/manual/using_deno_with_other_technologies/node/cdns",
    "/runtime/manual/node/cdns",
  );

  r(
    "/runtime/manual/testing/documentation",
    "/runtime/manual/basics/testing/documentation",
  );

  r(
    "/runtime/manual/typescript/types",
    "/runtime/manual/advanced/typescript/types",
  );

  r(
    "/runtime/manual/basics/modules/import_maps",
    "/runtime/manual/basics/import_maps",
  );

  r(
    "/runtime/manual/npm_nodejs/std_node",
    "/runtime/manual/node",
  );

  // Redirect manual examples
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
    r(`/runtime/manual/examples/${slug}`, `/runtime/tutorials/${slug}`);
  });

  // Redirect npm how-tos
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
    r(
      `/runtime/manual/node/how_to_with_npm/${slug}`,
      `/runtime/tutorials/how_to_with_npm/${slug}`,
    );
  });

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

  r("/deploy/manual/using-jsx", "/runtime/manual/advanced/jsx_dom/jsx");

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

  r(
    "/runtime/manual/contributing",
    "/runtime/manual/references/contributing",
  );

  // Subhosting
  r("/deploy/manual/subhosting/domains", "/deploy/api/rest/domains");

  // Redirect Subhosting docs from nested location under Deploy to a top-level
  r("/subhosting", "/subhosting/manual");
  r("/deploy/manual/subhosting", "/subhosting/manual");
  r("/deploy/manual/subhosting/domains", "/subhosting/manual/domains");
  r(
    "/deploy/manual/subhosting/getting_started",
    "/subhosting/manual/getting_started",
  );
  r(
    "/deploy/manual/subhosting/projects_and_deployments",
    "/subhosting/manual/projects_and_deployments",
  );
  r(
    "/deploy/api/rest",
    "/subhosting/api",
  );
  r(
    "/deploy/api/rest/*",
    "https://apidocs.deno.com",
  );
}
