import { Sidebar } from "../types.ts";

const sidebar = [
  {
    title: "Getting Started",
    items: [
      {
        label: "Quick Start",
        id: "/runtime/manual/",
      },
      {
        label: "Deno Basics",
        items: [
          "/runtime/manual/getting_started/first_steps/",
          "/runtime/manual/getting_started/setup_your_environment/",
          "/runtime/manual/getting_started/command_line_interface/",
          "/runtime/manual/getting_started/configuration_file/",
          "/runtime/manual/getting_started/web_frameworks/",
          "/runtime/manual/basics/permissions/",
          "/runtime/manual/basics/standard_library/",
          "/runtime/manual/basics/import_maps/",
          "/runtime/manual/basics/env_variables/",
          "/runtime/manual/basics/debugging_your_code/",
          "/runtime/manual/basics/connecting_to_databases/",
          "/runtime/manual/node/",
          "/runtime/manual/basics/react/",
          "/runtime/manual/getting_started/installation/",
        ],
      },
    ],
  },
  {
    title: "Modules and APIs",
    items: [
      {
        label: "Using & Publishing Modules",
        items: [
          "/runtime/manual/basics/modules/",
          "/runtime/manual/basics/modules/reloading_modules/",
          "/runtime/manual/basics/modules/private/",
          "/runtime/manual/basics/modules/proxies/",
          "/runtime/manual/basics/modules/integrity_checking/",
          "/runtime/manual/advanced/publishing/",
          "/runtime/manual/advanced/publishing/dnt/",
        ],
      },
      {
        label: "Deno Runtime APIs",
        items: [
          "/runtime/manual/runtime/builtin_apis/",
          "/runtime/manual/runtime/http_server_apis/",
          "/runtime/manual/runtime/permission_apis/",
          "/runtime/manual/runtime/import_meta_api/",
          "/runtime/manual/runtime/ffi_api/",
          "/runtime/manual/runtime/program_lifecycle/",
          "/runtime/manual/runtime/stability/",
        ],
      },
      {
        label: "Web Platform APIs",
        items: [
          "/runtime/manual/runtime/web_platform_apis/",
          "/runtime/manual/runtime/location_api/",
          "/runtime/manual/runtime/web_storage_api/",
          "/runtime/manual/runtime/workers/",
        ],
      },
      {
        label: "Interop with Node & npm",
        items: [
          "/runtime/manual/node/npm_specifiers/",
          "/runtime/manual/node/node_specifiers/",
          "/runtime/manual/node/package_json/",
          "/runtime/manual/node/cdns/",
          "/runtime/manual/node/faqs/",
          "/runtime/manual/node/migrate/",
          "/runtime/manual/references/cheatsheet/",
          {
            label: "Supported Node APIs and globals",
            id: "/runtime/manual/node/compatibility/",
          },
        ],
      },
      {
        label: "JSX and DOM APIs",
        items: [
          "/runtime/manual/advanced/jsx_dom/overview/",
          "/runtime/manual/advanced/jsx_dom/jsx/",
          "/runtime/manual/advanced/jsx_dom/css/",
          "/runtime/manual/advanced/jsx_dom/twind/",
          "/runtime/manual/advanced/jsx_dom/jsdom/",
          "/runtime/manual/advanced/jsx_dom/deno_dom/",
          "/runtime/manual/advanced/jsx_dom/linkedom/",
        ],
      },
    ],
  },
  {
    title: "Development Tools",
    items: [
      {
        label: "CLI Command Reference",
        items: [
          "/runtime/manual/tools/",
          "/runtime/manual/tools/unstable_flags/",
          "/runtime/manual/tools/benchmarker/",
          "/runtime/manual/tools/completions/",
          "/runtime/manual/tools/cache/",
          "/runtime/manual/tools/check/",
          "/runtime/manual/tools/compiler/",
          "/runtime/manual/tools/coverage/",
          "/runtime/manual/tools/documentation_generator/",
          "/runtime/manual/tools/eval/",
          "/runtime/manual/tools/formatter/",
          "/runtime/manual/tools/dependency_inspector/",
          "/runtime/manual/tools/init/",
          "/runtime/manual/tools/script_installer/",
          "/runtime/manual/tools/jupyter/",
          "/runtime/manual/tools/linter/",
          "/runtime/manual/tools/publish/",
          "/runtime/manual/tools/lsp/",
          "/runtime/manual/tools/repl/",
          "/runtime/manual/tools/run/",
          "/runtime/manual/tools/serve/",
          "/runtime/manual/tools/task_runner/",
          "/runtime/manual/tools/test/",
          "/runtime/manual/tools/types/",
          "/runtime/manual/tools/uninstall/",
          "/runtime/manual/tools/upgrade/",
          "/runtime/manual/tools/vendor/",
        ],
      },
      {
        label: "Testing",
        items: [
          "/runtime/manual/basics/testing/",
          "/runtime/manual/basics/testing/assertions/",
          "/runtime/manual/basics/testing/coverage/",
          "/runtime/manual/basics/testing/mocking/",
          "/runtime/manual/basics/testing/sanitizers/",
          "/runtime/manual/basics/testing/documentation/",
          "/runtime/manual/basics/testing/behavior_driven_development/",
          "/runtime/manual/basics/testing/snapshot_testing/",
        ],
      },
      {
        label: "Visual Studio Code",
        items: [
          "/runtime/manual/references/vscode_deno/",
          "/runtime/manual/references/vscode_deno/testing_api/",
        ],
      },
      {
        label: "Language Server",
        items: [
          "/runtime/manual/advanced/language_server/overview/",
          "/runtime/manual/advanced/language_server/imports/",
          "/runtime/manual/advanced/language_server/testing_api/",
        ],
      },
    ],
  },
  {
    title: "Advanced Topics",
    items: [
      {
        label: "Deploying & Embedding Deno",
        items: [
          "/runtime/manual/advanced/deploying_deno/",
          "/runtime/manual/advanced/deploying_deno/aws_lightsail/",
          "/runtime/manual/advanced/deploying_deno/cloudflare_workers/",
          "/runtime/manual/advanced/deploying_deno/digital_ocean/",
          "/runtime/manual/advanced/deploying_deno/google_cloud_run/",
          "/runtime/manual/advanced/deploying_deno/kinsta/",
          "/runtime/manual/advanced/continuous_integration/",
          "/runtime/manual/advanced/embedding_deno/",
        ],
      },
      {
        label: "TypeScript in Deno",
        items: [
          "/runtime/manual/advanced/typescript/overview/",
          "/runtime/manual/advanced/typescript/types/",
          "/runtime/manual/advanced/typescript/configuration/",
          "/runtime/manual/advanced/typescript/migration/",
          "/runtime/manual/advanced/typescript/faqs/",
        ],
      },
      {
        label: "WebAssembly",
        items: [
          "/runtime/manual/runtime/webassembly/",
          "/runtime/manual/runtime/webassembly/using_wasm/",
          "/runtime/manual/runtime/webassembly/using_streaming_wasm/",
          "/runtime/manual/runtime/webassembly/wasm_resources/",
        ],
      },
      "/runtime/manual/advanced/migrate_deprecations/",
    ],
  },
  {
    title: "Contributing and Support",
    items: [
      {
        label: "Contributing to Deno",
        items: [
          "/runtime/manual/references/contributing/",
          "/runtime/manual/references/contributing/architecture/",
          "/runtime/manual/references/contributing/building_from_source/",
          "/runtime/manual/references/contributing/profiling/",
          "/runtime/manual/references/contributing/release_schedule/",
          "/runtime/manual/references/contributing/style_guide/",
          "/runtime/manual/references/contributing/web_platform_tests/",
        ],
      },
      "/runtime/manual/help/",
    ],
  },
  {
    title: "Tutorials and Examples",
    items: [
      {
        label: "Basic Examples",
        items: [
          "/runtime/tutorials/hello_world/",
          "/runtime/tutorials/manage_dependencies/",
          "/runtime/tutorials/fetch_data/",
          "/runtime/tutorials/read_write_files/",
          "/runtime/tutorials/hashbang/",
        ],
      },
      {
        label: "Advanced Examples",
        items: [
          "/runtime/tutorials/unix_cat/",
          "/runtime/tutorials/http_server/",
          "/runtime/tutorials/file_server/",
          "/runtime/tutorials/tcp_echo/",
          "/runtime/tutorials/subprocess/",
          "/runtime/tutorials/os_signals/",
          "/runtime/tutorials/file_system_events/",
          "/runtime/tutorials/module_metadata/",
        ],
      },
      {
        label: "npm Module Examples",
        items: [
          "/runtime/tutorials/how_to_with_npm/apollo/",
          "/runtime/tutorials/how_to_with_npm/express/",
          "/runtime/tutorials/how_to_with_npm/mongoose/",
          "/runtime/tutorials/how_to_with_npm/mysql2/",
          "/runtime/tutorials/how_to_with_npm/planetscale/",
          "/runtime/tutorials/how_to_with_npm/prisma/",
          "/runtime/tutorials/how_to_with_npm/react/",
          "/runtime/tutorials/how_to_with_npm/redis/",
          "/runtime/tutorials/how_to_with_npm/vue/",
        ],
      },
      {
        label: "More on Deno by Example",
        href: "https://examples.deno.land",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        label: "Full API Reference",
        href: "https://deno.land/api?unstable=true",
      },
      {
        label: "Std. Library",
        href: "https://www.deno.land/std",
      },
    ],
  },
] satisfies Sidebar;

export default { sidebar };
