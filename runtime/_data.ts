import { Sidebar } from "../types.ts";
import { walk } from "jsr:@std/fs";
import { basename } from "jsr:@std/path";
import { parse as yamlParse } from "jsr:@std/yaml";

export const sidebar = [
  {
    title: "Getting started",
    href: "/runtime/",
    items: [
      "/runtime/getting_started/installation/",
      "/runtime/getting_started/first_project/",
      "/runtime/getting_started/setup_your_environment/",
      "/runtime/getting_started/command_line_interface/",
    ],
  },
  {
    title: "Fundamentals",
    href: "/runtime/fundamentals/",
    items: [
      "/runtime/fundamentals/typescript/",
      "/runtime/fundamentals/node/",
      "/runtime/fundamentals/security/",
      {
        label: "Modules and dependencies",
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
      {
        label: "OpenTelemetry",
        id: "/runtime/fundamentals/open_telemetry/",
      },
      "/runtime/fundamentals/stability_and_releases/",
    ],
  },
  {
    title: "Reference guides",
    href: "/runtime/reference/",
    items: [
      {
        label: "CLI",
        href: "/runtime/reference/cli/",
        items: [
          {
            label: "deno add",
            id: "/runtime/reference/cli/add/",
          },
          {
            label: "deno bench",
            id: "/runtime/reference/cli/bench/",
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
            id: "/runtime/reference/cli/compile/",
          },
          {
            label: "deno coverage",
            id: "/runtime/reference/cli/coverage/",
          },
          {
            label: "deno doc",
            id: "/runtime/reference/cli/doc/",
          },
          {
            label: "deno eval",
            id: "/runtime/reference/cli/eval/",
          },
          {
            label: "deno fmt",
            id: "/runtime/reference/cli/fmt/",
          },
          {
            label: "deno info",
            id: "/runtime/reference/cli/info/",
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
            id: "/runtime/reference/cli/lint/",
          },
          {
            label: "deno outdated",
            id: "/runtime/reference/cli/outdated/",
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
            id: "/runtime/reference/cli/task/",
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
    title: "Contributing and support",
    href: "/runtime/contributing/",
    items: [
      {
        label: "Contributing to Deno",
        items: [
          "/runtime/contributing/architecture/",
          "/runtime/contributing/building_from_source/",
          "/runtime/contributing/profiling/",
          "/runtime/contributing/release_schedule/",
          "/runtime/contributing/style_guide/",
          "/runtime/contributing/web_platform_tests/",
          "/runtime/contributing/docs/",
          "/runtime/contributing/examples/",
        ],
      },
      "/runtime/help/",
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Runtime";
export const sectionHref = "/runtime/";

export interface Description {
  kind: "note" | "tip" | "info" | "caution";
  description: string;
}
function handleDescription(description: Description | string): Description {
  if (typeof description === "string") {
    return {
      kind: "caution",
      description,
    };
  } else {
    return description;
  }
}

export type Descriptions = Record<string, DescriptionItem>;

type DescriptionItem = {
  status: "good" | "partial" | "stubs" | "unsupported";
  description?: Description;
  symbols?: Record<string, Description>;
};

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
  const sorted = Object.entries(descriptions).toSorted(([keyA], [keyB]) =>
    keyA.localeCompare(keyB)
  );
  const grouped: Record<
    string,
    { title: string; icon: string; items: Array<[string, DescriptionItem]> }
  > = {
    good: {
      title: "Fully supported modules",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#22c55e"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      items: [],
    },
    partial: {
      title: "Partially supported modules",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#6366f1"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
      items: [],
    },
    unsupported: {
      title: "Unsupported modules",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#ef4444"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      items: [],
    },
  };
  for (const item of sorted) {
    grouped[item[1].status].items.push(item);
  }

  return Object.entries(grouped).map(([_status, entries]) => {
    let content =
      `<div class="module-info">\n\n## ${entries.icon} ${entries.title} (${entries.items.length}/${
        Object.keys(descriptions).length
      })\n\n`;

    content += entries.items.map(([key, content]) => {
      let out = `\n\n### <a href="/api/node/${key}">node:${
        key.replaceAll("--", "/")
      }</a>\n\n<div class="item-content">\n\n`;

      if (content) {
        if (content.description) {
          out += `${content.description.description}\n\n`;
        }
        if (content.symbols) {
          for (const [symbol, description] of Object.entries(content.symbols)) {
            out += `**${
              symbol === "*" ? "All symbols" : symbol
            }**: ${description.description}\n\n`;
          }
        }
      }

      return out + "</div>";
    }).join("\n\n");

    return content;
  }).join("\n\n");
}
