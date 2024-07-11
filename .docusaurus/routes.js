import React from "react";
import ComponentCreator from "@docusaurus/ComponentCreator";

export default [
  {
    path: "/__docusaurus/debug",
    component: ComponentCreator("/__docusaurus/debug", "a79"),
    exact: true,
  },
  {
    path: "/__docusaurus/debug/config",
    component: ComponentCreator("/__docusaurus/debug/config", "56a"),
    exact: true,
  },
  {
    path: "/__docusaurus/debug/content",
    component: ComponentCreator("/__docusaurus/debug/content", "326"),
    exact: true,
  },
  {
    path: "/__docusaurus/debug/globalData",
    component: ComponentCreator("/__docusaurus/debug/globalData", "bb8"),
    exact: true,
  },
  {
    path: "/__docusaurus/debug/metadata",
    component: ComponentCreator("/__docusaurus/debug/metadata", "420"),
    exact: true,
  },
  {
    path: "/__docusaurus/debug/registry",
    component: ComponentCreator("/__docusaurus/debug/registry", "16a"),
    exact: true,
  },
  {
    path: "/__docusaurus/debug/routes",
    component: ComponentCreator("/__docusaurus/debug/routes", "bd6"),
    exact: true,
  },
  {
    path: "/deploy/api/rest/rapidoc",
    component: ComponentCreator("/deploy/api/rest/rapidoc", "154"),
    exact: true,
  },
  {
    path: "/search",
    component: ComponentCreator("/search", "c19"),
    exact: true,
  },
  {
    path: "/deploy",
    component: ComponentCreator("/deploy", "46d"),
    routes: [
      {
        path: "/deploy/",
        component: ComponentCreator("/deploy/", "068"),
        exact: true,
        sidebar: "deploy",
      },
      {
        path: "/deploy/api/",
        component: ComponentCreator("/deploy/api/", "3e3"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/compression",
        component: ComponentCreator("/deploy/api/compression", "2f7"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/rest/",
        component: ComponentCreator("/deploy/api/rest/", "fca"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/rest/deployments",
        component: ComponentCreator("/deploy/api/rest/deployments", "84a"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/rest/domains",
        component: ComponentCreator("/deploy/api/rest/domains", "579"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/rest/organizations",
        component: ComponentCreator("/deploy/api/rest/organizations", "c13"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/rest/projects",
        component: ComponentCreator("/deploy/api/rest/projects", "d8f"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-broadcast-channel",
        component: ComponentCreator(
          "/deploy/api/runtime-broadcast-channel",
          "d83",
        ),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-fetch",
        component: ComponentCreator("/deploy/api/runtime-fetch", "7af"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-fs",
        component: ComponentCreator("/deploy/api/runtime-fs", "952"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-headers",
        component: ComponentCreator("/deploy/api/runtime-headers", "eff"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-node",
        component: ComponentCreator("/deploy/api/runtime-node", "b33"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-request",
        component: ComponentCreator("/deploy/api/runtime-request", "218"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-response",
        component: ComponentCreator("/deploy/api/runtime-response", "dd2"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/api/runtime-sockets",
        component: ComponentCreator("/deploy/api/runtime-sockets", "ea3"),
        exact: true,
        sidebar: "deployAPIHome",
      },
      {
        path: "/deploy/manual/",
        component: ComponentCreator("/deploy/manual/", "df4"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/ci_github",
        component: ComponentCreator("/deploy/manual/ci_github", "35b"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/custom-domains",
        component: ComponentCreator("/deploy/manual/custom-domains", "1a2"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/deployctl",
        component: ComponentCreator("/deploy/manual/deployctl", "b06"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/deployments",
        component: ComponentCreator("/deploy/manual/deployments", "1a3"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/dynamodb",
        component: ComponentCreator("/deploy/manual/dynamodb", "287"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/environment-variables",
        component: ComponentCreator(
          "/deploy/manual/environment-variables",
          "2e6",
        ),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/fair-use-policy",
        component: ComponentCreator("/deploy/manual/fair-use-policy", "415"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/faunadb",
        component: ComponentCreator("/deploy/manual/faunadb", "5d9"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/firebase",
        component: ComponentCreator("/deploy/manual/firebase", "543"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/how-to-deploy",
        component: ComponentCreator("/deploy/manual/how-to-deploy", "96e"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/logs",
        component: ComponentCreator("/deploy/manual/logs", "8dd"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/middleware",
        component: ComponentCreator("/deploy/manual/middleware", "66e"),
        exact: true,
      },
      {
        path: "/deploy/manual/organizations",
        component: ComponentCreator("/deploy/manual/organizations", "6db"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/playgrounds",
        component: ComponentCreator("/deploy/manual/playgrounds", "2a4"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/postgres",
        component: ComponentCreator("/deploy/manual/postgres", "24d"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/pricing-and-limits",
        component: ComponentCreator("/deploy/manual/pricing-and-limits", "6e6"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/privacy-policy",
        component: ComponentCreator("/deploy/manual/privacy-policy", "a3c"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/regions",
        component: ComponentCreator("/deploy/manual/regions", "300"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/running-scripts-locally",
        component: ComponentCreator(
          "/deploy/manual/running-scripts-locally",
          "cc9",
        ),
        exact: true,
      },
      {
        path: "/deploy/manual/security",
        component: ComponentCreator("/deploy/manual/security", "c58"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/subhosting/",
        component: ComponentCreator("/deploy/manual/subhosting/", "83a"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/subhosting/domains",
        component: ComponentCreator("/deploy/manual/subhosting/domains", "7d2"),
        exact: true,
      },
      {
        path: "/deploy/manual/subhosting/getting_started",
        component: ComponentCreator(
          "/deploy/manual/subhosting/getting_started",
          "d97",
        ),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/subhosting/projects_and_deployments",
        component: ComponentCreator(
          "/deploy/manual/subhosting/projects_and_deployments",
          "01e",
        ),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/manual/use-cases",
        component: ComponentCreator("/deploy/manual/use-cases", "e5a"),
        exact: true,
        sidebar: "deployGuideHome",
      },
      {
        path: "/deploy/tutorials/",
        component: ComponentCreator("/deploy/tutorials/", "62b"),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/discord-slash",
        component: ComponentCreator("/deploy/tutorials/discord-slash", "585"),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/fresh",
        component: ComponentCreator("/deploy/tutorials/fresh", "79f"),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/simple-api",
        component: ComponentCreator("/deploy/tutorials/simple-api", "135"),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/static-site",
        component: ComponentCreator("/deploy/tutorials/static-site", "5ad"),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-blog-fresh",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-blog-fresh",
          "67b",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-dynamodb",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-dynamodb",
          "709",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-faunadb",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-faunadb",
          "e8c",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-firebase",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-firebase",
          "0ad",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-http-server",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-http-server",
          "96a",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-hugo-blog",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-hugo-blog",
          "ce0",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-postgres",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-postgres",
          "215",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/tutorial-wordpress-frontend",
        component: ComponentCreator(
          "/deploy/tutorials/tutorial-wordpress-frontend",
          "804",
        ),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
      {
        path: "/deploy/tutorials/vite",
        component: ComponentCreator("/deploy/tutorials/vite", "9f1"),
        exact: true,
        sidebar: "deployTutorialsHome",
      },
    ],
  },
  {
    path: "/kv",
    component: ComponentCreator("/kv", "826"),
    routes: [
      {
        path: "/kv/",
        component: ComponentCreator("/kv/", "a10"),
        exact: true,
      },
      {
        path: "/kv/manual/",
        component: ComponentCreator("/kv/manual/", "ca5"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/backup",
        component: ComponentCreator("/kv/manual/backup", "518"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/cron",
        component: ComponentCreator("/kv/manual/cron", "0f4"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/data_modeling_typescript",
        component: ComponentCreator(
          "/kv/manual/data_modeling_typescript",
          "dbd",
        ),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/key_expiration",
        component: ComponentCreator("/kv/manual/key_expiration", "d17"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/key_space",
        component: ComponentCreator("/kv/manual/key_space", "f0c"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/on_deploy",
        component: ComponentCreator("/kv/manual/on_deploy", "bea"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/operations",
        component: ComponentCreator("/kv/manual/operations", "dbc"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/queue_overview",
        component: ComponentCreator("/kv/manual/queue_overview", "adb"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/secondary_indexes",
        component: ComponentCreator("/kv/manual/secondary_indexes", "90a"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/manual/transactions",
        component: ComponentCreator("/kv/manual/transactions", "c06"),
        exact: true,
        sidebar: "kvGuideHome",
      },
      {
        path: "/kv/tutorials/",
        component: ComponentCreator("/kv/tutorials/", "bf8"),
        exact: true,
        sidebar: "kvTutorialsHome",
      },
      {
        path: "/kv/tutorials/schedule_notification",
        component: ComponentCreator(
          "/kv/tutorials/schedule_notification",
          "0ca",
        ),
        exact: true,
        sidebar: "kvTutorialsHome",
      },
      {
        path: "/kv/tutorials/webhook_processor",
        component: ComponentCreator("/kv/tutorials/webhook_processor", "203"),
        exact: true,
        sidebar: "kvTutorialsHome",
      },
    ],
  },
  {
    path: "/runtime",
    component: ComponentCreator("/runtime", "4f9"),
    routes: [
      {
        path: "/runtime/",
        component: ComponentCreator("/runtime/", "9ad"),
        exact: true,
        sidebar: "runtime",
      },
      {
        path: "/runtime/manual/",
        component: ComponentCreator("/runtime/manual/", "144"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/",
        component: ComponentCreator("/runtime/manual/advanced/", "a35"),
        exact: true,
      },
      {
        path: "/runtime/manual/advanced/continuous_integration",
        component: ComponentCreator(
          "/runtime/manual/advanced/continuous_integration",
          "dc4",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/deploying_deno/",
        component: ComponentCreator(
          "/runtime/manual/advanced/deploying_deno/",
          "e87",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/deploying_deno/aws_lightsail",
        component: ComponentCreator(
          "/runtime/manual/advanced/deploying_deno/aws_lightsail",
          "88c",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/deploying_deno/cloudflare_workers",
        component: ComponentCreator(
          "/runtime/manual/advanced/deploying_deno/cloudflare_workers",
          "3fd",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/deploying_deno/digital_ocean",
        component: ComponentCreator(
          "/runtime/manual/advanced/deploying_deno/digital_ocean",
          "03f",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/deploying_deno/google_cloud_run",
        component: ComponentCreator(
          "/runtime/manual/advanced/deploying_deno/google_cloud_run",
          "cdf",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/deploying_deno/kinsta",
        component: ComponentCreator(
          "/runtime/manual/advanced/deploying_deno/kinsta",
          "655",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/embedding_deno",
        component: ComponentCreator(
          "/runtime/manual/advanced/embedding_deno",
          "015",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/",
        component: ComponentCreator("/runtime/manual/advanced/jsx_dom/", "178"),
        exact: true,
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/css",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/css",
          "1b1",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/deno_dom",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/deno_dom",
          "d78",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/jsdom",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/jsdom",
          "e23",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/jsx",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/jsx",
          "587",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/linkedom",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/linkedom",
          "bbc",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/overview",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/overview",
          "da2",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/jsx_dom/twind",
        component: ComponentCreator(
          "/runtime/manual/advanced/jsx_dom/twind",
          "08b",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/language_server/",
        component: ComponentCreator(
          "/runtime/manual/advanced/language_server/",
          "f70",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/advanced/language_server/imports",
        component: ComponentCreator(
          "/runtime/manual/advanced/language_server/imports",
          "6e8",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/language_server/overview",
        component: ComponentCreator(
          "/runtime/manual/advanced/language_server/overview",
          "1a7",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/language_server/testing_api",
        component: ComponentCreator(
          "/runtime/manual/advanced/language_server/testing_api",
          "ed9",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/publishing/",
        component: ComponentCreator(
          "/runtime/manual/advanced/publishing/",
          "bda",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/publishing/dnt",
        component: ComponentCreator(
          "/runtime/manual/advanced/publishing/dnt",
          "faa",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/typescript/configuration",
        component: ComponentCreator(
          "/runtime/manual/advanced/typescript/configuration",
          "2e8",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/typescript/faqs",
        component: ComponentCreator(
          "/runtime/manual/advanced/typescript/faqs",
          "2f0",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/typescript/migration",
        component: ComponentCreator(
          "/runtime/manual/advanced/typescript/migration",
          "5ec",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/typescript/overview",
        component: ComponentCreator(
          "/runtime/manual/advanced/typescript/overview",
          "21a",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/advanced/typescript/types",
        component: ComponentCreator(
          "/runtime/manual/advanced/typescript/types",
          "dc1",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/",
        component: ComponentCreator("/runtime/manual/basics/", "fcb"),
        exact: true,
      },
      {
        path: "/runtime/manual/basics/connecting_to_databases",
        component: ComponentCreator(
          "/runtime/manual/basics/connecting_to_databases",
          "1ad",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/debugging_your_code",
        component: ComponentCreator(
          "/runtime/manual/basics/debugging_your_code",
          "103",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/env_variables",
        component: ComponentCreator(
          "/runtime/manual/basics/env_variables",
          "b36",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/import_maps",
        component: ComponentCreator(
          "/runtime/manual/basics/import_maps",
          "e23",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/modules/",
        component: ComponentCreator("/runtime/manual/basics/modules/", "b31"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/modules/integrity_checking",
        component: ComponentCreator(
          "/runtime/manual/basics/modules/integrity_checking",
          "ed6",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/modules/private",
        component: ComponentCreator(
          "/runtime/manual/basics/modules/private",
          "bfa",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/modules/proxies",
        component: ComponentCreator(
          "/runtime/manual/basics/modules/proxies",
          "b50",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/modules/reloading_modules",
        component: ComponentCreator(
          "/runtime/manual/basics/modules/reloading_modules",
          "bd4",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/permissions",
        component: ComponentCreator(
          "/runtime/manual/basics/permissions",
          "c7e",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/react",
        component: ComponentCreator("/runtime/manual/basics/react", "189"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/standard_library",
        component: ComponentCreator(
          "/runtime/manual/basics/standard_library",
          "914",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/",
        component: ComponentCreator("/runtime/manual/basics/testing/", "24c"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/assertions",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/assertions",
          "d4b",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/behavior_driven_development",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/behavior_driven_development",
          "6cc",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/coverage",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/coverage",
          "300",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/documentation",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/documentation",
          "45c",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/mocking",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/mocking",
          "8eb",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/sanitizers",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/sanitizers",
          "929",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/basics/testing/snapshot_testing",
        component: ComponentCreator(
          "/runtime/manual/basics/testing/snapshot_testing",
          "33f",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/getting_started/",
        component: ComponentCreator("/runtime/manual/getting_started/", "9ee"),
        exact: true,
      },
      {
        path: "/runtime/manual/getting_started/command_line_interface",
        component: ComponentCreator(
          "/runtime/manual/getting_started/command_line_interface",
          "366",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/getting_started/configuration_file",
        component: ComponentCreator(
          "/runtime/manual/getting_started/configuration_file",
          "571",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/getting_started/first_steps",
        component: ComponentCreator(
          "/runtime/manual/getting_started/first_steps",
          "890",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/getting_started/installation",
        component: ComponentCreator(
          "/runtime/manual/getting_started/installation",
          "ac6",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/getting_started/setup_your_environment",
        component: ComponentCreator(
          "/runtime/manual/getting_started/setup_your_environment",
          "667",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/getting_started/web_frameworks",
        component: ComponentCreator(
          "/runtime/manual/getting_started/web_frameworks",
          "ee9",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/help",
        component: ComponentCreator("/runtime/manual/help", "101"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/",
        component: ComponentCreator("/runtime/manual/node/", "fc2"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/cdns",
        component: ComponentCreator("/runtime/manual/node/cdns", "7cd"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/compatibility",
        component: ComponentCreator(
          "/runtime/manual/node/compatibility",
          "592",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/faqs",
        component: ComponentCreator("/runtime/manual/node/faqs", "433"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/",
          "4c6",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/apollo",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/apollo",
          "e4e",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/express",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/express",
          "c83",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/mongoose",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/mongoose",
          "8a2",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/mysql2",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/mysql2",
          "bc1",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/planetscale",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/planetscale",
          "236",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/prisma",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/prisma",
          "8e9",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/react",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/react",
          "680",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/redis",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/redis",
          "43d",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/how_to_with_npm/vue",
        component: ComponentCreator(
          "/runtime/manual/node/how_to_with_npm/vue",
          "cf5",
        ),
        exact: true,
      },
      {
        path: "/runtime/manual/node/migrate",
        component: ComponentCreator("/runtime/manual/node/migrate", "1f4"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/node_specifiers",
        component: ComponentCreator(
          "/runtime/manual/node/node_specifiers",
          "375",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/npm_specifiers",
        component: ComponentCreator(
          "/runtime/manual/node/npm_specifiers",
          "f47",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/node/package_json",
        component: ComponentCreator("/runtime/manual/node/package_json", "aa5"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/",
        component: ComponentCreator("/runtime/manual/references/", "2f8"),
        exact: true,
      },
      {
        path: "/runtime/manual/references/cheatsheet",
        component: ComponentCreator(
          "/runtime/manual/references/cheatsheet",
          "9d9",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/",
          "3c3",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/architecture",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/architecture",
          "a5d",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/building_from_source",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/building_from_source",
          "7b5",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/profiling",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/profiling",
          "431",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/release_schedule",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/release_schedule",
          "7b7",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/style_guide",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/style_guide",
          "40f",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/contributing/web_platform_tests",
        component: ComponentCreator(
          "/runtime/manual/references/contributing/web_platform_tests",
          "8f5",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/vscode_deno/",
        component: ComponentCreator(
          "/runtime/manual/references/vscode_deno/",
          "666",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/references/vscode_deno/testing_api",
        component: ComponentCreator(
          "/runtime/manual/references/vscode_deno/testing_api",
          "a96",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/",
        component: ComponentCreator("/runtime/manual/runtime/", "ef1"),
        exact: true,
      },
      {
        path: "/runtime/manual/runtime/builtin_apis",
        component: ComponentCreator(
          "/runtime/manual/runtime/builtin_apis",
          "381",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/ffi_api",
        component: ComponentCreator("/runtime/manual/runtime/ffi_api", "aa2"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/http_server_apis",
        component: ComponentCreator(
          "/runtime/manual/runtime/http_server_apis",
          "f20",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/import_meta_api",
        component: ComponentCreator(
          "/runtime/manual/runtime/import_meta_api",
          "e93",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/location_api",
        component: ComponentCreator(
          "/runtime/manual/runtime/location_api",
          "ea3",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/permission_apis",
        component: ComponentCreator(
          "/runtime/manual/runtime/permission_apis",
          "a91",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/program_lifecycle",
        component: ComponentCreator(
          "/runtime/manual/runtime/program_lifecycle",
          "646",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/stability",
        component: ComponentCreator("/runtime/manual/runtime/stability", "e5d"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/web_platform_apis",
        component: ComponentCreator(
          "/runtime/manual/runtime/web_platform_apis",
          "a66",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/web_storage_api",
        component: ComponentCreator(
          "/runtime/manual/runtime/web_storage_api",
          "0a2",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/webassembly/",
        component: ComponentCreator(
          "/runtime/manual/runtime/webassembly/",
          "085",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/webassembly/using_streaming_wasm",
        component: ComponentCreator(
          "/runtime/manual/runtime/webassembly/using_streaming_wasm",
          "d20",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/webassembly/using_wasm",
        component: ComponentCreator(
          "/runtime/manual/runtime/webassembly/using_wasm",
          "cfb",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/webassembly/wasm_resources",
        component: ComponentCreator(
          "/runtime/manual/runtime/webassembly/wasm_resources",
          "060",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/runtime/workers",
        component: ComponentCreator("/runtime/manual/runtime/workers", "218"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/",
        component: ComponentCreator("/runtime/manual/tools/", "4c8"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/benchmarker",
        component: ComponentCreator("/runtime/manual/tools/benchmarker", "9e5"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/bundler",
        component: ComponentCreator("/runtime/manual/tools/bundler", "3f0"),
        exact: true,
      },
      {
        path: "/runtime/manual/tools/compiler",
        component: ComponentCreator("/runtime/manual/tools/compiler", "781"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/dependency_inspector",
        component: ComponentCreator(
          "/runtime/manual/tools/dependency_inspector",
          "f50",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/documentation_generator",
        component: ComponentCreator(
          "/runtime/manual/tools/documentation_generator",
          "6d6",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/formatter",
        component: ComponentCreator("/runtime/manual/tools/formatter", "b96"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/init",
        component: ComponentCreator("/runtime/manual/tools/init", "cbc"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/jupyter",
        component: ComponentCreator("/runtime/manual/tools/jupyter", "e6d"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/linter",
        component: ComponentCreator("/runtime/manual/tools/linter", "2dc"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/repl",
        component: ComponentCreator("/runtime/manual/tools/repl", "8bc"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/script_installer",
        component: ComponentCreator(
          "/runtime/manual/tools/script_installer",
          "adc",
        ),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/task_runner",
        component: ComponentCreator("/runtime/manual/tools/task_runner", "d8a"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/manual/tools/vendor",
        component: ComponentCreator("/runtime/manual/tools/vendor", "2f4"),
        exact: true,
        sidebar: "runtimeGuideHome",
      },
      {
        path: "/runtime/tutorials/",
        component: ComponentCreator("/runtime/tutorials/", "163"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/chat_app",
        component: ComponentCreator("/runtime/tutorials/chat_app", "e0a"),
        exact: true,
      },
      {
        path: "/runtime/tutorials/fetch_data",
        component: ComponentCreator("/runtime/tutorials/fetch_data", "163"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/file_server",
        component: ComponentCreator("/runtime/tutorials/file_server", "fd5"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/file_system_events",
        component: ComponentCreator(
          "/runtime/tutorials/file_system_events",
          "8e4",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/hashbang",
        component: ComponentCreator("/runtime/tutorials/hashbang", "f09"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/hello_world",
        component: ComponentCreator("/runtime/tutorials/hello_world", "5e2"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/apollo",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/apollo",
          "722",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/express",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/express",
          "9ab",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/mongoose",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/mongoose",
          "d93",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/mysql2",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/mysql2",
          "f0f",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/planetscale",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/planetscale",
          "f89",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/prisma",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/prisma",
          "c5b",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/react",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/react",
          "179",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/redis",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/redis",
          "1e1",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/how_to_with_npm/vue",
        component: ComponentCreator(
          "/runtime/tutorials/how_to_with_npm/vue",
          "875",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/http_server",
        component: ComponentCreator("/runtime/tutorials/http_server", "e16"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/manage_dependencies",
        component: ComponentCreator(
          "/runtime/tutorials/manage_dependencies",
          "4b3",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/module_metadata",
        component: ComponentCreator(
          "/runtime/tutorials/module_metadata",
          "af0",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/os_signals",
        component: ComponentCreator("/runtime/tutorials/os_signals", "46f"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/read_write_files",
        component: ComponentCreator(
          "/runtime/tutorials/read_write_files",
          "eac",
        ),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/subprocess",
        component: ComponentCreator("/runtime/tutorials/subprocess", "b67"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/tcp_echo",
        component: ComponentCreator("/runtime/tutorials/tcp_echo", "5d3"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/tcp_server",
        component: ComponentCreator("/runtime/tutorials/tcp_server", "7b5"),
        exact: true,
      },
      {
        path: "/runtime/tutorials/unix_cat",
        component: ComponentCreator("/runtime/tutorials/unix_cat", "549"),
        exact: true,
        sidebar: "runtimeTutorialsHome",
      },
      {
        path: "/runtime/tutorials/word_finder",
        component: ComponentCreator("/runtime/tutorials/word_finder", "61d"),
        exact: true,
      },
    ],
  },
  {
    path: "/",
    component: ComponentCreator("/", "614"),
    exact: true,
  },
  {
    path: "*",
    component: ComponentCreator("*"),
  },
];
