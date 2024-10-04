import { Sidebar } from "../types.ts";
import { walk } from "jsr:@std/fs";
import { parse as yamlParse } from "jsr:@std/yaml";

export const sidebar = [
  {
    title: "Getting Started",
    items: [
      {
        label: "Hello World",
        id: "/runtime/",
      },
      "/runtime/getting_started/installation/",
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
      "/runtime/fundamentals/stability_and_releases/",
    ],
  },
  {
    title: "Reference Guides",
    items: [
      {
        label: "Deno CLI",
        items: [
          {
            label: "deno add",
            id: "/runtime/reference/cli/add/",
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
            id: "/runtime/reference/cli/install/",
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
            label: "deno remove",
            id: "/runtime/reference/cli/remove/",
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
          "/runtime/reference/cli/unstable_flags/",
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
        label: "Node APIs",
        id: "/runtime/reference/node_apis/",
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
      "/runtime/reference/migration_guide/",
      {
        label: "LSP integration",
        id: "/runtime/reference/lsp_integration/",
      },
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
      "/runtime/tutorials/fetch_data/",
      "/runtime/tutorials/hashbang/",
      "/runtime/tutorials/cjs_to_esm/",
      "/runtime/tutorials/how_to_with_npm/react/",
      "/runtime/tutorials/how_to_with_npm/next/",
      "/runtime/tutorials/how_to_with_npm/vue/",
      "/runtime/tutorials/connecting_to_databases/",
      {
        label: "More tutorials",
        items: [
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
          "/runtime/tutorials/how_to_with_npm/apollo/",
          "/runtime/tutorials/how_to_with_npm/express/",
          "/runtime/tutorials/how_to_with_npm/mongoose/",
          "/runtime/tutorials/how_to_with_npm/mysql2/",
          "/runtime/tutorials/how_to_with_npm/planetscale/",
          "/runtime/tutorials/how_to_with_npm/prisma/",
          "/runtime/tutorials/how_to_with_npm/redis/",
        ],
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Runtime";
export const sectionHref = "/runtime/";

export interface Description {
  kind: "NOTE" | "TIP" | "IMPORTANT" | "WARNING" | "CAUTION";
  description: string;
}
function handleDescription(description: Description | string): Description {
  if (typeof description === "string") {
    return {
      kind: "WARNING",
      description,
    };
  } else {
    return description;
  }
}

export type Descriptions = Record<
  string,
  {
    status: "good" | "partial" | "stubs" | "unsupported";
    description?: Description;
    symbols?: Record<string, Description>;
  }
>;

export async function generateDescriptions(): Promise<Descriptions> {
  const descriptions: Descriptions = {};
  for await (
    const dirEntry of walk(
      new URL(import.meta.resolve("../reference_gen/node_descriptions")),
      { exts: ["yaml"] },
    )
  ) {
    const file = await Deno.readTextFile(dirEntry.path);
    const parsed = yamlParse(file);
    if (!parsed) {
      throw `Invalid or empty file: ${dirEntry.path}`;
    }
    if (parsed.description) {
      parsed.description = handleDescription(parsed.description);
    }

    if (parsed.symbols) {
      parsed.symbols = Object.fromEntries(
        Object.entries(parsed.symbols).map((
          [key, value],
        ) => [key, handleDescription(value)]),
      );
    }

    if (
      !(parsed.status === "good" || parsed.status === "partial" ||
        parsed.status === "stubs" || parsed.status === "unsupported")
    ) {
      throw `Invalid status provided in '${dirEntry.name}': ${parsed.status}`;
    }

    descriptions[dirEntry.name.slice(0, -5)] = parsed;
  }

  return descriptions;
}

/*
generates the node compat list for the Node Support page.
This the data is read from the files in the reference_gen/node_description directory.
This function is called in node.md through the templating engine Vento,
after which the normal markdown rendered is called.
 */
export async function generateNodeCompatability() {
  const descriptions = await generateDescriptions();

  return Object.entries(descriptions).sort(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  ).map(([key, content]) => {
    let out =
      `<div class="module-info compat-status-${content.status}"><div class="compat-title"><a href="/api/node/${key}">node:${key}</a></div>\n\n`;

    if (content) {
      if (content.description) {
        out += `${content.description.description}\n\n`;
      }
      if (content.symbols) {
        for (const [symbol, description] of Object.entries(content.symbols)) {
          out += `**${
            symbol === "*" ? "All symbols" : symbol
          }**: ${description.description}<br />`;
        }
      }
    }

    return out + "</div>";
  }).join("\n\n");
}
