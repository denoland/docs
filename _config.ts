import lume from "lume/mod.ts";
import jsx from "lume/plugins/jsx_preact.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import postcss from "lume/plugins/postcss.ts";
import prism from "lume/plugins/prism.ts";
import search from "lume/plugins/search.ts";
import esbuild from "lume/plugins/esbuild.ts";
import redirects from "lume/plugins/redirects.ts";

import tailwindConfig from "./tailwind.config.js";

import "npm:prismjs@1.29.0/components/prism-typescript.js";
import { full as emoji } from "npm:markdown-it-emoji@3";
import anchor from "npm:markdown-it-anchor@9";
import relativeLinksPlugin from "./markdown-it-relative-path.ts";
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts";
import title from "https://deno.land/x/lume_markdown_plugins@v0.7.0/title.ts";

import { CSS as GFM_CSS } from "https://jsr.io/@deno/gfm/0.8.2/style.ts";

const site = lume({}, {
  markdown: {
    plugins: [
      emoji,
      [
        anchor,
        {
          permalink: anchor.permalink.linkInsideHeader({
            symbol:
              `<span class="sr-only">Jump to heading</span><span aria-hidden="true" class="anchor-end">#</span>`,
            placement: "after",
          }),
        },
      ],
      relativeLinksPlugin,
    ],
    options: {
      linkify: true,
      langPrefix: "highlight notranslate language-",
    },
  },
});

site.ignore("./old");
site.copy("static", ".");
site.copy("subhosting/api/images");
site.copy("deploy/docs-images");
site.copy("runtime/manual/images");

site.use(redirects({
  redirects: {
    "/api/": "/api/deno/",

    // Landing page redirects
    "/manual": "/runtime/manual",
    "/runtime/manual/introduction": "/runtime/manual",
    "/runtime": "/runtime/manual",
    "/deploy": "/deploy/manual",
    "/deploy/docs": "/deploy/manual",

    // KV redirects
    "/kv": "/deploy/kv/manual",
    "/kv/manual": "/deploy/kv/manual",
    "/kv/manual/": "/deploy/kv/manual",
    "/runtime/manual/runtime/kv": "/deploy/kv/manual",
    "/runtime/manual/runtime/kv/key_space": "/deploy/kv/manual/key_space",
    "/runtime/manual/runtime/kv/operations": "/deploy/kv/manual/operations",
    "/runtime/manual/runtime/kv/secondary_indexes": "/deploy/kv/manual/secondary_indexes",
    "/runtime/manual/runtime/kv/transactions": "/deploy/kv/manual/transactions",
    "/deploy/manual/kv": "/deploy/kv/manual/on_deploy",


    // Redirects from previous top level KV category
    "/kv/manual/key_space": "/deploy/kv/manual/key_space",
    "/kv/manual/operations": "/deploy/kv/manual/operations",
    "/kv/manual/key_expiration": "/deploy/kv/manual/key_expiration",
    "/kv/manual/secondary_indexes": "/deploy/kv/manual/secondary_indexes",
    "/kv/manual/transactions": "/deploy/kv/manual/transactions",
    "/kv/manual/node": "/deploy/kv/manual/node",
    "/kv/manual/queue_overview": "/deploy/kv/manual/queue_overview",
    "/kv/manual/cron": "/deploy/kv/manual/cron",
    "/kv/manual/data_modeling_typescript": "/deploy/kv/manual/data_modeling_typescript",
    "/kv/manual/on_deploy": "/deploy/kv/manual/on_deploy",
    "/kv/manual/backup": "/deploy/kv/manual/backup",
    "/kv/tutorials": "/deploy/kv/tutorials",
    "/kv/tutorials/schedule_notification":"/deploy/kv/tutorials/schedule_notification",
    "/kv/tutorials/webhook_processor":"/deploy/kv/tutorials/webhook_processor",

    // Manual redirects
    "/runtime/manual/examples": "/runtime/tutorials",
    "/runtime/manual/language_server/overview":"/runtime/manual/advanced/language_server/overview",
    "/runtime/manual/runtime/": "/runtime/manual/runtime/builtin_apis",
    "/runtime/manual/testing": "/runtime/manual/basics/testing",
    "/runtime/manual/advanced/typescript":"/runtime/manual/advanced/typescript/overview",
    "/runtime/manual/node/dnt":"/runtime/manual/advanced/publishing/dnt",
    "/runtime/manual/typescript":"/runtime/manual/advanced/typescript/overview",

    "/runtime/manual/typescript/overview": "/runtime/manual/advanced/typescript/overview",
    "/runtime/manual/getting_started/typescript": "/runtime/manual/advanced/typescript/overview",
    "/runtime/manual/typescript/typescript/faqs": "/runtime/manual/advanced/typescript/faqs",
    "/runtime/manual/vscode_deno": "/runtime/manual/references/vscode_deno",
    "/runtime/manual/advanced/publishing/0": "/runtime/manual/advanced/publishing",
    "/runtime/manual/getting_started/webassembly": "/runtime/manual/runtime/webassembly",
    "/runtime/manual/basics/permissionsDeno": "/runtime/manual/basics/permissions",
    "/runtime/manual/contributing/style_guide": "/runtime/manual/references/contributing/style_guide",
    "/runtime/manual/jsx_dom/linkedom": "/runtime/manual/advanced/jsx_dom/linkedom",
    "/runtime/manual/npm_nodejs/compatibility_mode": "/runtime/manual/node/compatibility",
    "/runtime/manual/runtime/navigator_api": "/runtime/manual/runtime/web_platform_apis",
    "/runtime/manual/jsx_dom/twind": "/runtime/manual/advanced/jsx_dom/twind",
    "/runtime/manual/using_deno_with_other_technologies/jsx_dom": "/runtime/manual/advanced/jsx_dom/overview",
    "/runtime/manual/linking_to_external_code/reloading_modules": "/runtime/manual/basics/modules/reloading_modules",
    "/runtime/manual/linkingtoexternal_code": "/runtime/manual/basics/modules",
    "/runtime/manual/getting_started/debugging_your_code":"/runtime/manual/basics/debugging_your_code",
    "/runtime/manual/npm_nodejs/cdns": "/runtime/manual/node/cdns",
    "/runtime/manual/using_deno_with_other_technologies/node/cdns":"/runtime/manual/node/cdns",
    "/runtime/manual/testing/documentation":"/runtime/manual/basics/testing/documentation",
    "/runtime/manual/typescript/types":"/runtime/manual/advanced/typescript/types",
    "/runtime/manual/basics/modules/import_maps":"/runtime/manual/basics/import_maps",
    "/runtime/manual/npm_nodejs/std_node":"/runtime/manual/node",

    // Redirect manual examples
    ...Object.fromEntries([
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
    ].map((slug) => [`/runtime/manual/examples/${slug}`, `/runtime/tutorials/${slug}`])),

    // Redirect npm how-tos
    ...Object.fromEntries([
      "apollo",
      "express",
      "mongoose",
      "mysql2",
      "planetscale",
      "prisma",
      "react",
      "redis",
      "vue",
    ].map((slug) => [`/runtime/manual/node/how_to_with_npm/${slug}`, `/runtime/tutorials/how_to_with_npm/${slug}`])),

    "/runtime/manual/node/how_to_with_npm": "/runtime/tutorials",

    // Redirect all deploy docs paths
    ...Object.fromEntries([
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
    ].map((slug) => [`/deploy/docs/${slug}`, `/deploy/tutorials/${slug}`])),

    "/deploy/manual/using-jsx": "/runtime/manual/advanced/jsx_dom/jsx",
    "/deploy/docs/runtime-api": "/deploy/api",

    // Redirect all deploy docs paths
    ...Object.fromEntries([
      "compression",
      "runtime-broadcast-channel",
      "runtime-fetch",
      "runtime-fs",
      "runtime-headers",
      "runtime-node",
      "runtime-request",
      "runtime-response",
      "runtime-sockets",
    ].map((slug) => [`/deploy/docs/${slug}`, `/deploy/api/${slug}`])),

    "/runtime/manual/contributing": "/runtime/manual/references/contributing",

    // Redirect Subhosting docs from nested location under Deploy to a top-level
    "/subhosting": "/subhosting/manual",
    "/deploy/manual/subhosting": "/subhosting/manual",
    "/deploy/manual/subhosting/domains": "/subhosting/manual/domains",
    "/deploy/manual/subhosting/getting_started": "/subhosting/manual/getting_started",
    "/deploy/manual/subhosting/projects_and_deployments": "/subhosting/manual/projects_and_deployments",
    "/deploy/api/rest": "/subhosting/api",
    "/deploy/api/rest/*": "https://apidocs.deno.com",
  },
}));
site.use(search());
site.use(jsx());
site.use(tailwindcss({
  options: tailwindConfig,
  extensions: [".tsx", ".md", ".ts"],
}));
site.use(postcss());
site.use(esbuild({
  extensions: [".client.ts"],
}));
site.use(prism());
site.use(toc({ anchor: false }));
site.use(title());

site.addEventListener("afterBuild", () => {
  Deno.writeTextFileSync(site.dest("gfm.css"), GFM_CSS);
});

site.copy("reference_gen/gen/deno/page.css", "/api/deno/page.css");
site.copy("reference_gen/gen/deno/styles.css", "/api/deno/styles.css");
site.copy("reference_gen/gen/deno/script.js", "/api/deno/script.js");

site.copy("reference_gen/gen/web/page.css", "/api/web/page.css");
site.copy("reference_gen/gen/web/styles.css", "/api/web/styles.css");
site.copy("reference_gen/gen/web/script.js", "/api/web/script.js");

site.copy("reference_gen/gen/node/page.css", "/api/node/page.css");
site.copy("reference_gen/gen/node/styles.css", "/api/node/styles.css");
site.copy("reference_gen/gen/node/script.js", "/api/node/script.js");

export default site;
