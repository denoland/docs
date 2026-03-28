import { walk } from "jsr:@std/fs";
import { parse as yamlParse } from "jsr:@std/yaml";
import {
  Sidebar,
  SidebarItem,
  SidebarNav as SidebarNavType,
  SidebarSection,
} from "../types.ts";

// ─── Sub-navigation tabs ────────────────────────────────────
export const SidebarNav = [
  { title: "Basics", href: "/runtime/" },
  { title: "Code Quality", href: "/runtime/fundamentals/testing/" },
  { title: "Build & Publish", href: "/runtime/fundamentals/workspaces/" },
  { title: "Tools", href: "/runtime/reference/vscode/" },
] satisfies SidebarNavType;

// ─── Per-tab sidebars ───────────────────────────────────────
const basicsSidebar = [
  {
    title: "Getting Started",
    items: [
      { title: "Welcome to Deno", href: "/runtime/" },
      { title: "Installation", href: "/runtime/getting_started/installation/" },
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
      {
        title: "Migrating to Deno",
        href: "/runtime/reference/migration_guide/",
      },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "TypeScript", href: "/runtime/fundamentals/typescript/" },
      {
        title: "Modules and dependencies",
        href: "/runtime/fundamentals/modules/",
      },
      { title: "Configuration", href: "/runtime/fundamentals/configuration/" },
      {
        title: "Security and permissions",
        href: "/runtime/fundamentals/security/",
      },
      {
        title: "Node.js compatibility",
        href: "/runtime/fundamentals/node/",
      },
      {
        title: "Stability and releases",
        href: "/runtime/fundamentals/stability_and_releases/",
      },
    ],
  },
  {
    title: "Running Code",
    items: [
      { title: "deno run", href: "/runtime/reference/cli/run/" },
      { title: "deno serve", href: "/runtime/reference/cli/serve/" },
      { title: "deno task", href: "/runtime/reference/cli/task/" },
      { title: "deno eval", href: "/runtime/reference/cli/eval/" },
      { title: "deno repl", href: "/runtime/reference/cli/repl/" },
      { title: "deno sandbox", href: "/runtime/reference/cli/sandbox/" },
    ],
  },
  {
    title: "Serving HTTP",
    items: [
      { title: "HTTP Server", href: "/runtime/fundamentals/http_server/" },
      { title: "Web development", href: "/runtime/fundamentals/web_dev/" },
      { title: "Using JSX and React", href: "/runtime/reference/jsx/" },
    ],
  },
  {
    title: "Native & Wasm",
    items: [
      { title: "FFI", href: "/runtime/fundamentals/ffi/" },
      { title: "WebAssembly", href: "/runtime/reference/wasm/" },
    ],
  },
  {
    title: "Contributing and Support",
    items: [
      {
        title: "Contributing to Deno",
        items: [
          { title: "Contributing overview", href: "/runtime/contributing/" },
          {
            title: "Architecture",
            href: "/runtime/contributing/architecture/",
          },
          { title: "Profiling", href: "/runtime/contributing/profiling/" },
          {
            title: "Release schedule",
            href: "/runtime/contributing/release_schedule/",
          },
          {
            title: "Style guide",
            href: "/runtime/contributing/style_guide/",
          },
          { title: "Documentation", href: "/runtime/contributing/docs/" },
          { title: "Examples", href: "/runtime/contributing/examples/" },
        ],
      },
      { title: "Help", href: "/runtime/help/" },
    ],
  },
] satisfies Sidebar;

const qualitySidebar = [
  {
    title: "Testing & Code Quality",
    items: [
      {
        title: "Writing and running tests",
        href: "/runtime/fundamentals/testing/",
      },
      {
        title: "Linting and formatting",
        href: "/runtime/fundamentals/linting_and_formatting/",
      },
      { title: "Lint plugins", href: "/runtime/reference/lint_plugins/" },
      { title: "deno test", href: "/runtime/reference/cli/test/" },
      { title: "deno bench", href: "/runtime/reference/cli/bench/" },
      { title: "deno coverage", href: "/runtime/reference/cli/coverage/" },
      { title: "deno fmt", href: "/runtime/reference/cli/fmt/" },
      { title: "deno lint", href: "/runtime/reference/cli/lint/" },
      { title: "deno check", href: "/runtime/reference/cli/check/" },
      { title: "deno doc", href: "/runtime/reference/cli/doc/" },
      {
        title: "Testing code in docs",
        href: "/runtime/reference/documentation/",
      },
    ],
  },
] satisfies Sidebar;

const packagesSidebar = [
  {
    title: "Package Management",
    items: [
      { title: "Workspaces", href: "/runtime/fundamentals/workspaces/" },
      { title: "deno add", href: "/runtime/reference/cli/add/" },
      { title: "deno remove", href: "/runtime/reference/cli/remove/" },
      { title: "deno install", href: "/runtime/reference/cli/install/" },
      { title: "deno uninstall", href: "/runtime/reference/cli/uninstall/" },
      { title: "deno outdated", href: "/runtime/reference/cli/outdated/" },
      { title: "deno update", href: "/runtime/reference/cli/update/" },
      { title: "deno audit", href: "/runtime/reference/cli/audit/" },
      {
        title: "deno approve-scripts",
        href: "/runtime/reference/cli/approve_scripts/",
      },
      { title: "Standard Library", href: "/runtime/reference/std/" },
    ],
  },
  {
    title: "Building & Deploying",
    items: [
      { title: "deno init", href: "/runtime/reference/cli/init/" },
      { title: "deno create", href: "/runtime/reference/cli/create/" },
      { title: "Bundling", href: "/runtime/reference/bundling/" },
      { title: "deno compile", href: "/runtime/reference/cli/compile/" },
      { title: "deno bundle", href: "/runtime/reference/cli/bundle/" },
      { title: "deno publish", href: "/runtime/reference/cli/publish/" },
      { title: "deno deploy", href: "/runtime/reference/cli/deploy/" },
      { title: "Docker", href: "/runtime/reference/docker/" },
      {
        title: "Continuous integration",
        href: "/runtime/reference/continuous_integration/",
      },
    ],
  },
] satisfies Sidebar;

const toolsSidebar = [
  {
    title: "Development",
    items: [
      { title: "Deno & VS Code", href: "/runtime/reference/vscode/" },
      {
        title: "LSP integration",
        href: "/runtime/reference/lsp_integration/",
      },
      { title: "deno lsp", href: "/runtime/reference/cli/lsp/" },
      {
        title: "Jupyter notebooks",
        href: "/runtime/reference/cli/jupyter/",
      },
      { title: "Debugging", href: "/runtime/fundamentals/debugging/" },
      { title: "OpenTelemetry", href: "/runtime/fundamentals/open_telemetry/" },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        title: "Environment variables",
        href: "/runtime/reference/env_variables/",
      },
      {
        title: "Configuring TypeScript",
        href: "/runtime/reference/ts_config_migration/",
      },
    ],
  },
  {
    title: "CLI Utilities",
    items: [
      { title: "CLI overview", href: "/runtime/reference/cli/" },
      { title: "deno info", href: "/runtime/reference/cli/info/" },
      { title: "deno types", href: "/runtime/reference/cli/types/" },
      {
        title: "deno completions",
        href: "/runtime/reference/cli/completions/",
      },
      { title: "deno upgrade", href: "/runtime/reference/cli/upgrade/" },
      { title: "deno clean", href: "/runtime/reference/cli/clean/" },
      {
        title: "deno unstable flags",
        href: "/runtime/reference/cli/unstable_flags/",
      },
      { title: "deno x", href: "/runtime/reference/cli/x/" },
    ],
  },
] satisfies Sidebar;

// ─── Sidebar routing ────────────────────────────────────────
// Maps SubNav tab hrefs to their sidebar data
export const sidebars: Record<string, Sidebar> = {
  "/runtime/": basicsSidebar,
  "/runtime/fundamentals/testing/": qualitySidebar,
  "/runtime/fundamentals/workspaces/": packagesSidebar,
  "/runtime/reference/vscode/": toolsSidebar,
};

// Auto-generate a URL → tab-href mapping from the sidebar data
function collectHrefs(items: SidebarItem[]): string[] {
  const hrefs: string[] = [];
  for (const item of items) {
    if (item.href) hrefs.push(item.href.replace(/\/$/, ""));
    if (item.items) hrefs.push(...collectHrefs(item.items));
  }
  return hrefs;
}

export const sidebarUrlMap: Record<string, string> = {};
for (const [tabHref, sidebarData] of Object.entries(sidebars)) {
  for (const section of sidebarData as SidebarSection[]) {
    if (section.href) {
      sidebarUrlMap[section.href.replace(/\/$/, "")] = tabHref;
    }
    if (section.items) {
      for (const href of collectHrefs(section.items)) {
        sidebarUrlMap[href] = tabHref;
      }
    }
  }
}

// Default sidebar (fallback for pages not in the URL map)
export const sidebar = basicsSidebar;

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
    const parsed = yamlParse(file) as Partial<DescriptionItem> & {
      description?: Description | string;
      symbols?: Record<string, Description | string>;
    };
    if (!parsed) {
      throw `Invalid or empty file: ${dirEntry.path}`;
    }
    if (parsed.description) {
      parsed.description = handleDescription(parsed.description);
    }

    if (parsed.symbols) {
      parsed.symbols = Object.fromEntries(
        Object.entries(parsed.symbols).map(([key, value]) => [
          key,
          handleDescription(value as Description | string),
        ]),
      );
    }

    if (
      !(
        parsed.status === "good" ||
        parsed.status === "partial" ||
        parsed.status === "stubs" ||
        parsed.status === "unsupported"
      )
    ) {
      throw `Invalid status provided in '${dirEntry.name}': ${parsed.status}`;
    }

    descriptions[dirEntry.name.slice(0, -5)] = parsed as DescriptionItem;
  }

  return descriptions;
}

/*
generates the node compat list for the Node Support page.
This the data is read from the files in the reference_gen/node_description directory.
This function is called in node.md through the templating engine Vento,
after which the normal markdown rendered is called.
 */
export async function generateNodeCompatibility() {
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

  return Object.entries(grouped)
    .map(([_status, entries]) => {
      let content =
        `<div class="module-info">\n\n## ${entries.icon} ${entries.label} (${entries.items.length}/${
          Object.keys(descriptions).length
        })\n\n`;

      content += entries.items
        .map(([key, content]) => {
          const link = key.replaceAll("--", "/");
          let out =
            `\n\n### <a href="/api/node/${link}">node:${link}</a>\n\n<div class="item-content">\n\n`;

          if (content) {
            if (content.description) {
              out += `${content.description.description}\n\n`;
            }
            if (content.symbols) {
              for (
                const [symbol, description] of Object.entries(
                  content.symbols,
                )
              ) {
                out += `**${
                  symbol === "*" ? "All symbols" : symbol
                }**: ${description.description}\n\n`;
              }
            }
          }

          return out + "</div>";
        })
        .join("\n\n");

      return content;
    })
    .join("\n\n");
}
