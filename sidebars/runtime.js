const spacer = {
  type: "html",
  value: '<div style="height: 30px;"></div>',
};

// Include main doc categories on most pages
const mainMenu = [
  // https://docusaurus.io/docs/sidebar/items
  /*
  {
    type: "doc",
    id: "index",
    label: "Quick Start",
    className: "icon-menu-option icon-menu-quick-start",
  },
  */
  {
    type: "link",
    href: "/runtime/manual",
    label: "Manual",
    className: "icon-menu-option icon-menu-user-guide",
  },
  {
    type: "link",
    label: "Tutorials & Examples",
    href: "/runtime/tutorials",
    className: "icon-menu-option icon-menu-tutorials",
  },
  {
    type: "link",
    label: "API Reference",
    href: "https://deno.land/api?unstable=true",
    className: "icon-menu-option icon-menu-api __no-external",
  },
];

const sidebars = {
  runtime: mainMenu,

  runtimeGuideHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>Deno Runtime Manual</div>",
      className: "section-header",
    },
    {
      type: "doc",
      label: "Quick Start",
      id: "manual/index",
    },
    {
      type: "doc",
      label: "Deno Basics ▶",
      id: "manual/getting_started/installation",
    },
    {
      type: "doc",
      label: "Runtime APIs ▶",
      id: "manual/runtime/builtin_apis",
    },
    {
      type: "doc",
      label: "Work with Node.js & npm ▶",
      id: "manual/node/index",
    },
    {
      type: "doc",
      label: "Developer Tools ▶",
      id: "manual/tools/index",
    },
    {
      type: "doc",
      label: "Advanced Topics ▶",
      id: "manual/advanced/continuous_integration",
    },
    {
      type: "doc",
      label: "References ▶",
      id: "manual/references/index",
    },
    "manual/help",
    spacer,
  ]),

  runtimeBasicsHome: mainMenu.concat([
    {
      type: "html",
      value: `<div><a href="/runtime/manual">Manual</a> > Deno Basics</div>`,
      className: "section-header",
    },
    "manual/getting_started/installation",
    "manual/getting_started/first_steps",
    "manual/getting_started/setup_your_environment",
    "manual/getting_started/command_line_interface",
    "manual/getting_started/configuration_file",
    "manual/getting_started/web_frameworks",
    {
      type: "html",
      value: `<div>Core Concepts & Common Tasks</div>`,
      className: "section-header",
    },
    "manual/basics/permissions",
    "manual/basics/standard_library",
    "manual/basics/import_maps",
    "manual/basics/env_variables",
    "manual/basics/debugging_your_code",
    "manual/basics/connecting_to_databases",
    "manual/basics/react",
    {
      type: "html",
      value: "<div>Modules</div>",
      className: "section-header",
    },
    "manual/basics/modules/index",
    "manual/basics/modules/reloading_modules",
    "manual/basics/modules/private",
    "manual/basics/modules/proxies",
    "manual/basics/modules/integrity_checking",
    {
      type: "html",
      value: "<div>Testing</div>",
      className: "section-header",
    },
    "manual/basics/testing/index",
    "manual/basics/testing/assertions",
    "manual/basics/testing/coverage",
    "manual/basics/testing/mocking",
    "manual/basics/testing/sanitizers",
    "manual/basics/testing/documentation",
    "manual/basics/testing/behavior_driven_development",
    "manual/basics/testing/snapshot_testing",
    spacer,
    {
      type: "doc",
      label: "◀ Back to all topics",
      id: "manual/index",
    },
    spacer,
  ]),

  runtimeRuntimeHome: mainMenu.concat([
    {
      type: "html",
      value: `<div><a href="/runtime/manual">Manual</a> > Runtime APIs</div>`,
      className: "section-header",
    },
    "manual/runtime/builtin_apis",
    "manual/runtime/http_server_apis",
    "manual/runtime/permission_apis",
    "manual/runtime/import_meta_api",
    "manual/runtime/ffi_api",
    "manual/runtime/program_lifecycle",
    "manual/runtime/stability",
    {
      type: "html",
      value: "<div>Deno KV</div>",
      className: "section-header",
    },
    "manual/runtime/kv/index",
    "manual/runtime/kv/key_space",
    "manual/runtime/kv/operations",
    "manual/runtime/kv/secondary_indexes",
    "manual/runtime/kv/transactions",
    {
      type: "html",
      value: `<div>Web Platform APIs</div>`,
      className: "section-header",
    },
    "manual/runtime/web_platform_apis",
    "manual/runtime/location_api",
    "manual/runtime/web_storage_api",
    "manual/runtime/workers",
    {
      type: "html",
      value: "<div>Web Assembly</div>",
      className: "section-header",
    },
    "manual/runtime/webassembly/index",
    "manual/runtime/webassembly/using_wasm",
    "manual/runtime/webassembly/using_streaming_wasm",
    "manual/runtime/webassembly/wasm_resources",
    spacer,
    {
      type: "doc",
      label: "◀ Back to all topics",
      id: "manual/index",
    },
    spacer,
  ]),

  runtimeNodeHome: mainMenu.concat([
    {
      type: "html",
      value:
        `<div><a href="/runtime/manual">Manual</a> > Work with Node.js & npm</div>`,
      className: "section-header",
    },
    "manual/node/index",
    "manual/node/npm_specifiers",
    "manual/node/node_specifiers",
    "manual/node/package_json",
    "manual/node/cdns",
    "manual/node/faqs",
    "manual/node/migrate",
    {
      type: "html",
      value: "<div>Node.js and npm how-tos</div>",
      className: "section-header",
    },
    "manual/node/how_to_with_npm/express",
    "manual/node/how_to_with_npm/apollo",
    "manual/node/how_to_with_npm/mongoose",
    "manual/node/how_to_with_npm/mysql2",
    "manual/node/how_to_with_npm/planetscale",
    "manual/node/how_to_with_npm/prisma",
    "manual/node/how_to_with_npm/redis",
    "manual/node/how_to_with_npm/react",
    "manual/node/how_to_with_npm/vue",
    spacer,
    {
      type: "doc",
      label: "◀ Back to all topics",
      id: "manual/index",
    },
    spacer,
  ]),

  runtimeToolsHome: mainMenu.concat([
    {
      type: "html",
      value:
        `<div><a href="/runtime/manual">Manual</a> > Developer Tools</div>`,
      className: "section-header",
    },
    "manual/tools/index",
    {
      type: "doc",
      label: "deno bench",
      id: "manual/tools/benchmarker",
    },
    {
      type: "doc",
      label: "deno compile",
      id: "manual/tools/compiler",
    },
    {
      type: "doc",
      label: "deno info",
      id: "manual/tools/dependency_inspector",
    },
    {
      type: "doc",
      label: "deno doc",
      id: "manual/tools/documentation_generator",
    },
    {
      type: "doc",
      label: "deno fmt",
      id: "manual/tools/formatter",
    },
    {
      type: "doc",
      label: "deno init",
      id: "manual/tools/init",
    },
    {
      type: "doc",
      label: "deno lint",
      id: "manual/tools/linter",
    },
    {
      type: "doc",
      label: "deno repl",
      id: "manual/tools/repl",
    },
    {
      type: "doc",
      label: "deno install",
      id: "manual/tools/script_installer",
    },
    {
      type: "doc",
      label: "deno task",
      id: "manual/tools/task_runner",
    },
    {
      type: "doc",
      label: "deno vendor",
      id: "manual/tools/vendor",
    },
    spacer,
    {
      type: "doc",
      label: "◀ Back to all topics",
      id: "manual/index",
    },
    spacer,
  ]),

  runtimeAdvancedHome: mainMenu.concat([
    {
      type: "html",
      value:
        `<div><a href="/runtime/manual">Manual</a> > Advanced Topics</div>`,
      className: "section-header",
    },
    "manual/advanced/continuous_integration",
    "manual/advanced/publishing/index",
    "manual/advanced/publishing/dnt",
    "manual/advanced/embedding_deno",
    {
      type: "html",
      value: "<div>Deploying Deno</div>",
      className: "section-header",
    },
    "manual/advanced/deploying_deno/index",
    "manual/advanced/deploying_deno/aws_lightsail",
    "manual/advanced/deploying_deno/cloudflare_workers",
    "manual/advanced/deploying_deno/digital_ocean",
    "manual/advanced/deploying_deno/google_cloud_run",
    "manual/advanced/deploying_deno/kinsta",
    {
      type: "html",
      value: "<div>TypeScript in Deno</div>",
      className: "section-header",
    },
    "manual/advanced/typescript/overview",
    "manual/advanced/typescript/types",
    "manual/advanced/typescript/configuration",
    "manual/advanced/typescript/migration",
    "manual/advanced/typescript/faqs",
    {
      type: "html",
      value: "<div>JSX and DOM APIs</div>",
      className: "section-header",
    },
    "manual/advanced/jsx_dom/overview",
    "manual/advanced/jsx_dom/jsx",
    "manual/advanced/jsx_dom/css",
    "manual/advanced/jsx_dom/twind",
    "manual/advanced/jsx_dom/jsdom",
    "manual/advanced/jsx_dom/deno_dom",
    "manual/advanced/jsx_dom/linkedom",
    {
      type: "html",
      value: "<div>Language Server</div>",
      className: "section-header",
    },
    "manual/advanced/language_server/overview",
    "manual/advanced/language_server/imports",
    "manual/advanced/language_server/testing_api",
    spacer,
    {
      type: "doc",
      label: "◀ Back to all topics",
      id: "manual/index",
    },
    spacer,
  ]),

  runtimeReferencesHome: mainMenu.concat([
    {
      type: "html",
      value: `<div><a href="/runtime/manual">Manual</a> > References</div>`,
      className: "section-header",
    },
    "manual/references/index",
    "manual/references/cheatsheet",
    {
      type: "html",
      value: "<div>Visual Studio Code</div>",
      className: "section-header",
    },
    "manual/references/vscode_deno/index",
    "manual/references/vscode_deno/testing_api",
    {
      type: "html",
      value: "<div>Contributing to Deno</div>",
      className: "section-header",
    },
    "manual/references/contributing/index",
    "manual/references/contributing/architecture",
    "manual/references/contributing/building_from_source",
    "manual/references/contributing/profiling",
    "manual/references/contributing/release_schedule",
    "manual/references/contributing/style_guide",
    "manual/references/contributing/web_platform_tests",
    spacer,
    {
      type: "doc",
      label: "◀ Back to all topics",
      id: "manual/index",
    },
    spacer,
  ]),

  runtimeTutorialsHome: mainMenu.concat([
    {
      type: "html",
      value: "<div>Tutorials &amp; Examples</div>",
      className: "section-header",
    },
    {
      type: "autogenerated",
      dirName: "tutorials",
    },
    {
      type: "link",
      label: "More on Deno by Example",
      href: "https://examples.deno.land",
    },
  ]),
};

module.exports = sidebars;
