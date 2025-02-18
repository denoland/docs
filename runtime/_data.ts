import { Sidebar } from "../types.ts";
import { walk } from "jsr:@std/fs";
import { parse as yamlParse } from "jsr:@std/yaml";

export const sidebar = [
  {
    title: "Getting started",
    href: "/runtime/",
    items: [
      {
        title: "Installation",
        href: "/runtime/getting_started/installation/",
      },
      {
        title: "First project",
        href: "/runtime/getting_started/first_project/",
      },
      {
        title: "Setup your environment",
        href: "/runtime/getting_started/setup_your_environment/",
      },
      {
        title: "Command line interface",
        href: "/runtime/getting_started/command_line_interface/",
      },
    ],
  },
  {
    title: "Fundamentals",
    href: "/runtime/fundamentals/",
    items: [
      {
        title: "TypeScript",
        href: "/runtime/fundamentals/typescript/",
      },
      {
        title: "Node",
        href: "/runtime/fundamentals/node/",
      },
      {
        title: "Security",
        href: "/runtime/fundamentals/security/",
      },
      {
        title: "Modules and dependencies",
        href: "/runtime/fundamentals/modules/",
      },
      {
        title: "Configuration",
        href: "/runtime/fundamentals/configuration/",
      },
      {
        title: "Standard library",
        href: "/runtime/fundamentals/standard_library/",
      },
      {
        title: "Web development",
        href: "/runtime/fundamentals/web_dev/",
      },
      {
        title: "Testing",
        href: "/runtime/fundamentals/testing/",
      },
      {
        title: "Debugging",
        href: "/runtime/fundamentals/debugging/",
      },
      {
        title: "Workspaces",
        href: "/runtime/fundamentals/workspaces/",
      },
      {
        title: "Linting and formatting",
        href: "/runtime/fundamentals/linting_and_formatting/",
      },
      {
        title: "HTTP Server",
        href: "/runtime/fundamentals/http_server/",
      },
      {
        title: "OpenTelemetry",
        href: "/runtime/fundamentals/open_telemetry/",
      },
      {
        title: "Stability and releases",
        href: "/runtime/fundamentals/stability_and_releases/",
      },
    ],
  },
  {
    title: "Reference guides",
    href: "/runtime/reference/",
    items: [
      {
        title: "CLI",
        href: "/runtime/reference/cli/",
        items: [
          {
            title: "deno add",
            href: "/runtime/reference/cli/add/",
          },
          {
            title: "deno bench",
            href: "/runtime/reference/cli/bench/",
          },
          {
            title: "deno check",
            href: "/runtime/reference/cli/check/",
          },
          {
            title: "deno clean",
            href: "/runtime/reference/cli/clean/",
          },
          {
            title: "deno compile",
            href: "/runtime/reference/cli/compile/",
          },
          {
            title: "deno completions",
            href: "/runtime/reference/cli/completions/",
          },
          {
            title: "deno coverage",
            href: "/runtime/reference/cli/coverage/",
          },
          {
            title: "deno doc",
            href: "/runtime/reference/cli/doc/",
          },
          {
            title: "deno eval",
            href: "/runtime/reference/cli/eval/",
          },
          {
            title: "deno fmt",
            href: "/runtime/reference/cli/fmt/",
          },
          {
            title: "deno info",
            href: "/runtime/reference/cli/info/",
          },
          {
            title: "deno init",
            href: "/runtime/reference/cli/init/",
          },
          {
            title: "deno install",
            href: "/runtime/reference/cli/install/",
          },
          {
            title: "deno jupyter",
            href: "/runtime/reference/cli/jupyter/",
          },
          {
            title: "deno lint",
            href: "/runtime/reference/cli/lint/",
          },
          {
            title: "deno outdated",
            href: "/runtime/reference/cli/outdated/",
          },
          {
            title: "deno publish",
            href: "/runtime/reference/cli/publish/",
          },
          {
            title: "deno lsp",
            href: "/runtime/reference/cli/lsp/",
          },
          {
            title: "deno remove",
            href: "/runtime/reference/cli/remove/",
          },
          {
            title: "deno repl",
            href: "/runtime/reference/cli/repl/",
          },
          {
            title: "deno run",
            href: "/runtime/reference/cli/run/",
          },
          {
            title: "deno serve",
            href: "/runtime/reference/cli/serve/",
          },
          {
            title: "deno task",
            href: "/runtime/reference/cli/task/",
          },
          {
            title: "deno test",
            href: "/runtime/reference/cli/test/",
          },
          {
            title: "deno types",
            href: "/runtime/reference/cli/types/",
          },
          {
            title: "deno uninstall",
            href: "/runtime/reference/cli/uninstall/",
          },
          {
            title: "deno upgrade",
            href: "/runtime/reference/cli/upgrade/",
          },
          {
            title: "deno unstable flags",
            href: "/runtime/reference/cli/unstable_flags/",
          },
        ],
      },
      {
        title: "Deno APIs",
        href: "/runtime/reference/deno_namespace_apis/",
      },
      {
        title: "Web APIs",
        href: "/runtime/reference/web_platform_apis/",
      },
      {
        title: "Node APIs",
        href: "/runtime/reference/node_apis/",
      },
      {
        title: "TS Config Migration",
        href: "/runtime/reference/ts_config_migration/",
      },
      {
        title: "Continuous Integration",
        href: "/runtime/reference/continuous_integration/",
      },
      {
        title: "Environment variables",
        href: "/runtime/reference/env_variables/",
      },
      {
        title: "Deno & VS Code",
        href: "/runtime/reference/vscode/",
      },
      {
        title: "Using JSX and React",
        href: "/runtime/reference/jsx/",
      },
      {
        title: "Testing code in docs",
        href: "/runtime/reference/documentation/",
      },
      {
        title: "WebAssembly",
        href: "/runtime/reference/wasm/",
      },
      {
        title: "Migration Guide",
        href: "/runtime/reference/migration_guide/",
      },
      {
        title: "LSP integration",
        href: "/runtime/reference/lsp_integration/",
      },
    ],
  },
  {
    title: "Contributing and support",
    href: "/runtime/contributing/",
    items: [
      {
        title: "Contributing to Deno",
        items: [
          {
            title: "Architecture",
            href: "/runtime/contributing/architecture/",
          },
          {
            title: "Building from source",
            href: "/runtime/contributing/building_from_source/",
          },
          {
            title: "Profiling",
            href: "/runtime/contributing/profiling/",
          },
          {
            title: "Release schedule",
            href: "/runtime/contributing/release_schedule/",
          },
          {
            title: "Style guide",
            href: "/runtime/contributing/style_guide/",
          },
          {
            title: "Web platform tests",
            href: "/runtime/contributing/web_platform_tests/",
          },
          {
            title: "Documentation",
            href: "/runtime/contributing/docs/",
          },
          {
            title: "Examples",
            href: "/runtime/contributing/examples/",
          },
        ],
      },
      {
        title: "Help",
        href: "/runtime/help/",
      },
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
    { label: string; icon: string; items: Array<[string, DescriptionItem]> }
  > = {
    good: {
      label: "Fully supported modules",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#22c55e"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
      items: [],
    },
    partial: {
      label: "Partially supported modules",
      icon:
        '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="#6366f1"><path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>',
      items: [],
    },
    unsupported: {
      label: "Unsupported modules",
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
      `<div class="module-info">\n\n## ${entries.icon} ${entries.label} (${entries.items.length}/${
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
