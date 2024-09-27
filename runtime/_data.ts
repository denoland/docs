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
      "/runtime/fundamentals/node/",
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
      "/runtime/fundamentals/linting_and_formatting/",
      {
        label: "HTTP Server",
        id: "/runtime/fundamentals/http_server/",
      },
      "/runtime/fundamentals/installation/",
      "/runtime/fundamentals/stability_and_releases/",
    ],
  },
  {
    title: "Reference Guides",
    items: [
      {
        label: "Deno CLI",
        items: [
          "/runtime/reference/cli/unstable_flags/",
          {
            label: "Environment Variables",
            id: "/runtime/reference/cli/env_variables/",
          },
          {
            label: "deno bench",
            id: "/runtime/reference/cli/benchmarker/",
          },
          {
            label: "deno completions",
            id: "/runtime/reference/cli/completions/",
          },
          {
            label: "deno check",
            id: "/runtime/reference/cli/check/",
          },
          {
            label: "deno compile",
            id: "/runtime/reference/cli/compiler/",
          },
          {
            label: "deno coverage",
            id: "/runtime/reference/cli/coverage/",
          },
          {
            label: "deno doc",
            id: "/runtime/reference/cli/documentation_generator/",
          },
          {
            label: "deno eval",
            id: "/runtime/reference/cli/eval/",
          },
          {
            label: "deno fmt",
            id: "/runtime/reference/cli/formatter/",
          },
          {
            label: "deno info",
            id: "/runtime/reference/cli/dependency_inspector/",
          },
          {
            label: "deno init",
            id: "/runtime/reference/cli/init/",
          },
          {
            label: "deno install",
            id: "/runtime/reference/cli/script_installer/",
          },
          {
            label: "deno jupyter",
            id: "/runtime/reference/cli/jupyter/",
          },
          {
            label: "deno lint",
            id: "/runtime/reference/cli/linter/",
          },
          {
            label: "deno publish",
            id: "/runtime/reference/cli/publish/",
          },
          {
            label: "deno lsp",
            id: "/runtime/reference/cli/lsp/",
          },
          {
            label: "LSP integration",
            id: "/runtime/reference/cli/lsp_integration/",
          },
          {
            label: "deno repl",
            id: "/runtime/reference/cli/repl/",
          },
          {
            label: "deno run",
            id: "/runtime/reference/cli/run/",
          },
          {
            label: "deno serve",
            id: "/runtime/reference/cli/serve/",
          },
          {
            label: "deno task",
            id: "/runtime/reference/cli/task_runner/",
          },
          {
            label: "deno test",
            id: "/runtime/reference/cli/test/",
          },
          {
            label: "deno types",
            id: "/runtime/reference/cli/types/",
          },
          {
            label: "deno uninstall",
            id: "/runtime/reference/cli/uninstall/",
          },
          {
            label: "deno upgrade",
            id: "/runtime/reference/cli/upgrade/",
          },
        ],
      },
      {
        label: "Deno APIs",
        id: "/runtime/reference/deno_namespace_apis/",
      },
      {
        label: "Web APIs",
        id: "/runtime/reference/web_platform_apis/",
      },
      {
        label: "npm packages",
        id: "/runtime/reference/npm/",
      },
      "/runtime/reference/ts_config_migration/",
      "/runtime/reference/continuous_integration/",
      {
        label: "Environment variables",
        id: "/runtime/reference/env_variables/",
      },
      {
        label: "Deno & VS Code",
        id: "/runtime/reference/vscode/",
      },
      "/runtime/reference/private_repositories/",
      {
        label: "Using JSX and React",
        id: "/runtime/reference/jsx/",
      },
      {
        label: "Testing code in docs",
        id: "/runtime/reference/documentation/",
      },
      "/runtime/reference/wasm/",
      "/runtime/reference/migrate_deprecations/",
    ],
  },
  {
    title: "Contributing and Support",
    items: [
      {
        label: "Contributing to Deno",
        items: [
          "/runtime/contributing/contribute/",
          "/runtime/contributing/architecture/",
          "/runtime/contributing/building_from_source/",
          "/runtime/contributing/profiling/",
          "/runtime/contributing/release_schedule/",
          "/runtime/contributing/style_guide/",
          "/runtime/contributing/web_platform_tests/",
        ],
      },
      "/runtime/help/",
    ],
  },
  {
    title: "Tutorials and Examples",
    items: [
      "/runtime/tutorials/hello_world/",
      "/runtime/tutorials/init_project/",
      "/runtime/tutorials/fetch_data/",
      "/runtime/tutorials/http_server/",
      "/runtime/tutorials/hashbang/",
      "/runtime/tutorials/cjs_to_esm/",
      "/runtime/tutorials/how_to_with_npm/react/",
      "/runtime/tutorials/how_to_with_npm/next/",
      "/runtime/tutorials/how_to_with_npm/vue/",
      "/runtime/tutorials/connecting_to_databases/",
      {
        label: "Advanced Examples",
        items: [
          "/runtime/tutorials/file_server/",
          {
            label: "Unix cat",
            id: "/examples/unix-cat/",
          },
          "/runtime/tutorials/file_server/",
          "/runtime/tutorials/subprocess/",
          "/runtime/tutorials/os_signals/",
          "/runtime/tutorials/file_system_events/",
          "/runtime/tutorials/module_metadata/",
          "/runtime/tutorials/aws_lambda/",
          "/runtime/tutorials/aws_lightsail/",
          "/runtime/tutorials/cloudflare_workers/",
          "/runtime/tutorials/digital_ocean/",
          "/runtime/tutorials/google_cloud_run/",
          "/runtime/tutorials/kinsta/",
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
          "/runtime/tutorials/how_to_with_npm/redis/",
        ],
      },
      {
        label: "More on Deno by Example",
        href: "/examples",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Runtime";
export const sectionHref = "/runtime/";
