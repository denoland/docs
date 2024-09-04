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
      "/runtime/fundamentals/linting_and_formatting/",
      {
        label: "HTTP Server",
        id: "/runtime/fundamentals/http_server/",
      },
      "/runtime/fundamentals/installation/",
      "/runtime/fundamentals/stability/",
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
            label: "deno cache",
            id: "/runtime/reference/cli/cache/",
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
      "/runtime/reference/deno_namespace_apis/",
      "/runtime/reference/web_platform_apis/",
      "/runtime/reference/node/",
      {
        label: "npm packages",
        id: "/runtime/reference/npm/",
      },
      "/runtime/reference/continuous_integration/",
      "/runtime/reference/deploying_and_embedding/",
      "/runtime/reference/wasm/",
      "/runtime/reference/tcp_udp_connections/",
    ],
  },
  {
    title: "Development Tools",
    items: [
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
        label: "TypeScript in Deno",
        items: [
          "/runtime/manual/advanced/typescript/configuration/",
          "/runtime/manual/advanced/typescript/migration/",
          "/runtime/manual/advanced/typescript/faqs/",
        ],
      },
      "/runtime/manual/advanced/migrate_deprecations/",
      "/runtime/manual/advanced/jsx/",
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
          "/runtime/tutorials/cjs_to_esm/",
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
