import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "Getting Started",
    items: [
      {
        label: "Hello World",
        id: "/runtime/",
      },
      "/runtime/getting_started/first_project/",
      "/runtime/getting_started/setup_your_environment/",
      "/runtime/getting_started/command_line_interface/",
    ],
  },
  {
    title: "Fundamentals",
    items: [
      "/runtime/fundamentals/typescript/",
      "/runtime/fundamentals/security/",
      {
        label: "Modules",
        id: "/runtime/fundamentals/modules/",
      },
      "/runtime/fundamentals/configuration/",
      "/runtime/fundamentals/standard_library/",
      "/runtime/fundamentals/web_dev/",
      "/runtime/fundamentals/testing/",
      "/runtime/fundamentals/debugging/",
      "/runtime/fundamentals/workspaces/",
      "/runtime/fundamentals/installation/",
      "/runtime/fundamentals/linting_and_formatting/",
      "/runtime/fundamentals/stability/",
    ],
  },
  {
    title: "Modules and APIs",
    items: [
      {
        label: "Deno Runtime APIs",
        items: [
          "/runtime/manual/runtime/builtin_apis/",
          "/runtime/manual/runtime/http_server_apis/",
          "/runtime/manual/runtime/permission_apis/",
          "/runtime/manual/runtime/import_meta_api/",
          "/runtime/manual/runtime/ffi_api/",
          "/runtime/manual/runtime/program_lifecycle/",
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
          "/runtime/manual/node/",
          "/runtime/manual/node/migrate/",
          "/runtime/manual/node/npm_specifiers/",
          "/runtime/manual/node/private_registries/",
          "/runtime/manual/node/cjs_to_esm/",
          "/runtime/manual/node/cheatsheet/",
          {
            label: "Supported Node APIs and globals",
            id: "/runtime/manual/node/compatibility/",
          },
        ],
      },
      "/runtime/manual/advanced/jsx/",
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
          {
            label: "deno bench",
            id: "/runtime/manual/tools/benchmarker/",
          },
          {
            label: "deno completions",
            id: "/runtime/manual/tools/completions/",
          },
          {
            label: "deno cache",
            id: "/runtime/manual/tools/cache/",
          },
          {
            label: "deno check",
            id: "/runtime/manual/tools/check/",
          },
          {
            label: "deno compile",
            id: "/runtime/manual/tools/compiler/",
          },
          {
            label: "deno coverage",
            id: "/runtime/manual/tools/coverage/",
          },
          {
            label: "deno doc",
            id: "/runtime/manual/tools/documentation_generator/",
          },
          {
            label: "deno eval",
            id: "/runtime/manual/tools/eval/",
          },
          {
            label: "deno fmt",
            id: "/runtime/manual/tools/formatter/",
          },
          {
            label: "deno info",
            id: "/runtime/manual/tools/dependency_inspector/",
          },
          {
            label: "deno init",
            id: "/runtime/manual/tools/init/",
          },
          {
            label: "deno install",
            id: "/runtime/manual/tools/script_installer/",
          },
          {
            label: "deno jupyter",
            id: "/runtime/manual/tools/jupyter/",
          },
          {
            label: "deno lint",
            id: "/runtime/manual/tools/linter/",
          },
          {
            label: "deno publish",
            id: "/runtime/manual/tools/publish/",
          },
          {
            label: "deno lsp",
            id: "/runtime/manual/tools/lsp/",
          },
          {
            label: "deno repl",
            id: "/runtime/manual/tools/repl/",
          },
          {
            label: "deno run",
            id: "/runtime/manual/tools/run/",
          },
          {
            label: "deno serve",
            id: "/runtime/manual/tools/serve/",
          },
          {
            label: "deno task",
            id: "/runtime/manual/tools/task_runner/",
          },
          {
            label: "deno test",
            id: "/runtime/manual/tools/test/",
          },
          {
            label: "deno types",
            id: "/runtime/manual/tools/types/",
          },
          {
            label: "deno uninstall",
            id: "/runtime/manual/tools/uninstall/",
          },
          {
            label: "deno upgrade",
            id: "/runtime/manual/tools/upgrade/",
          },
        ],
      },
      {
        label: "Vendoring",
        id: "/runtime/manual/basics/vendoring/",
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
      "/runtime/manual/advanced/private_repositories/",
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
        href: "/examples",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        label: "Full API Reference",
        href: "/api/deno",
      },
      {
        label: "Std. Library",
        href: "https://jsr.io/@std",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Runtime";
export const sectionHref = "/runtime/";
