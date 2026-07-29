#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Generates static/llms.txt from the runtime sidebar.
 *
 * llms.txt used to be hand-maintained, which meant it silently described an
 * older docs structure every time the runtime docs were reorganised. The
 * sidebar in runtime/_data.ts is the one structure that cannot go stale
 * unnoticed, because a wrong entry visibly breaks site navigation — so this
 * derives the index from it instead.
 *
 * Scope is deliberately the open-source runtime. Deno Deploy, Deno Sandbox and
 * Subhosting are complementary products with their own docs trees; they get a
 * single pointer each rather than a shallow, half-complete listing. The
 * exhaustive indexes live in llms-summary.txt and llms-full.txt.
 *
 * Regenerate with `deno task generate:llms-txt`. llms_txt_test.ts fails if the
 * committed file is stale or links to a page that no longer exists, so this
 * runs as part of `deno task test`; `deno task check:llms-txt` does the
 * staleness check on its own.
 */

import { extract } from "@std/front-matter/yaml";
import { sidebar } from "./runtime/_data.ts";

const BASE_URL = "https://docs.deno.com";

/** Sidebar groups to emit, in order, mapped to their llms.txt section heading. */
const SECTIONS: Array<{ group: string; heading: string }> = [
  { group: "Get started", heading: "Get started" },
  { group: "Guides", heading: "Guides" },
  { group: "Concepts", heading: "Concepts" },
  { group: "Diagnostics", heading: "Diagnostics" },
  { group: "Advanced", heading: "Advanced" },
  { group: "Reference", heading: "Reference" },
];

/**
 * Emitted after the main sections, under `## Optional` — the llms.txt
 * convention for "skip these when context is short".
 */
const OPTIONAL_GROUPS = ["Contributing"];

const HEADER = `# Deno

> Deno is a secure JavaScript and TypeScript runtime built on V8 and Rust,
> distributed as a single binary. TypeScript, formatting, linting, testing and a
> standard library work with zero configuration. Programs are sandboxed by
> default; capabilities (network, filesystem, etc.) are granted explicitly via
> --allow-* flags. Deno runs npm packages and Node.js built-in modules natively,
> and reads an existing package.json.

This file indexes the Deno runtime documentation. Deno Deploy, Deno Sandbox and
Subhosting are separate products and are linked at the end.

- [agents.md](https://deno.com/agents.md): Start here if you are a coding agent working in a user's project — orientation, the Node assumptions to unlearn, and how to install Deno's agent skills
- [llms-full-guide.txt](${BASE_URL}/llms-full-guide.txt): Self-contained quick reference: CLI commands, permissions, configuration and code examples
- [llms-summary.txt](${BASE_URL}/llms-summary.txt): Compact index of every documentation section, including the products below
- [llms-full.txt](${BASE_URL}/llms-full.txt): Full documentation content dump (large)
`;

const FOOTER = `## Examples

- [Examples and tutorials](${BASE_URL}/examples/): Runnable examples and step-by-step tutorials, indexed by topic

## Other Deno products

- [Deno Deploy](${BASE_URL}/deploy/): Managed platform for deploying JavaScript and TypeScript apps
- [Deno Sandbox](${BASE_URL}/sandbox/): Ephemeral Linux microVMs for running untrusted code
- [Subhosting](${BASE_URL}/subhosting/manual/): Run your customers' code securely, for SaaS platforms
- [Agent skills](https://github.com/denoland/skills): Deno skills for coding agents
`;

interface SidebarItem {
  title?: unknown;
  href?: unknown;
  items?: unknown;
}

/**
 * Resolves a site path to the markdown file backing it, so a description can be
 * read from its frontmatter. Returns null for paths with no local source (for
 * example generated reference trees).
 */
async function sourceFileFor(href: string): Promise<string | null> {
  const clean = href.replace(/^\/+/, "").replace(/\/+$/, "");
  const candidates = clean === "" ? ["index.md"] : [
    `${clean}.md`,
    `${clean}/index.md`,
    `${clean}.mdx`,
    `${clean}/index.mdx`,
  ];
  for (const candidate of candidates) {
    try {
      const stat = await Deno.stat(candidate);
      if (stat.isFile) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

/**
 * Pages whose index is generated at build time, so there is no local
 * frontmatter to read a description from.
 */
const DESCRIPTION_OVERRIDES: Record<string, string> = {
  "/runtime/reference/cli/":
    "Every deno subcommand and its flags: run, test, fmt, lint, task, install, add, compile, publish and the rest",
  "/runtime/reference/std/":
    "The Deno standard library (@std on JSR): audited, dependency-free modules for common tasks",
  "/lint/":
    "Every deno lint rule, what it catches, and how to configure or suppress it",
};

/** Frontmatter descriptions are written for SEO and run long; keep one sentence. */
function condense(description: string): string {
  const collapsed = description.replace(/\s+/g, " ").trim();
  const firstSentence = collapsed.match(/^(.*?[.!?])(\s|$)/)?.[1];
  let text = firstSentence && firstSentence.length >= 40
    ? firstSentence
    : collapsed;
  // Strip the terminal period before any truncation, so a shortened line does
  // not end up with a stray "..".
  text = text.replace(/[.\s]+$/, "");
  if (text.length > 170) {
    const cut = text.slice(0, 167);
    const lastSpace = cut.lastIndexOf(" ");
    text = `${(lastSpace > 120 ? cut.slice(0, lastSpace) : cut).trimEnd()}...`;
  }
  return text;
}

async function describe(href: string): Promise<string | null> {
  const override = DESCRIPTION_OVERRIDES[href];
  if (override) return override;
  const file = await sourceFileFor(href);
  if (!file) return null;
  const content = await Deno.readTextFile(file);
  if (!content.startsWith("---")) return null;
  try {
    const { attrs } = extract<{ description?: string }>(content);
    return typeof attrs.description === "string" && attrs.description.trim()
      ? condense(attrs.description)
      : null;
  } catch {
    return null;
  }
}

/** Renders the top-level items of one sidebar group. Children are omitted: the
 * CLI and standard library subtrees alone run to ~90 pages, which belongs in
 * llms-full.txt, not in a curated index. */
async function renderGroup(group: SidebarItem): Promise<string[]> {
  const lines: string[] = [];
  const items = Array.isArray(group.items) ? group.items as SidebarItem[] : [];
  for (const item of items) {
    const { title, href } = item;
    if (typeof title !== "string" || typeof href !== "string") continue;
    const url = href.startsWith("http") ? href : `${BASE_URL}${href}`;
    const description = href.startsWith("http") ? null : await describe(href);
    lines.push(`- [${title}](${url})${description ? `: ${description}` : ""}`);
  }
  return lines;
}

function findGroup(title: string): SidebarItem {
  const group = (sidebar as SidebarItem[]).find((g) => g.title === title);
  if (!group) {
    throw new Error(
      `Runtime sidebar has no "${title}" group. A group was renamed or ` +
        `removed — update SECTIONS in generate_llms_txt.ts to match.`,
    );
  }
  return group;
}

export async function generateLlmsTxt(): Promise<string> {
  const parts: string[] = [HEADER];

  for (const { group, heading } of SECTIONS) {
    const lines = await renderGroup(findGroup(group));
    if (lines.length === 0) continue;
    parts.push(`## ${heading}\n\n${lines.join("\n")}\n`);
  }

  parts.push(FOOTER);

  const optional: string[] = [];
  for (const group of OPTIONAL_GROUPS) {
    optional.push(...await renderGroup(findGroup(group)));
  }
  if (optional.length > 0) {
    parts.push(`## Optional\n\n${optional.join("\n")}\n`);
  }

  return parts.join("\n");
}

if (import.meta.main) {
  const output = await generateLlmsTxt();
  const check = Deno.args.includes("--check");
  const path = "static/llms.txt";

  if (check) {
    const existing = await Deno.readTextFile(path).catch(() => "");
    if (existing !== output) {
      console.error(
        `${path} is out of date. Run \`deno task generate:llms-txt\` and ` +
          `commit the result.`,
      );
      Deno.exit(1);
    }
    console.log(`${path} is up to date.`);
  } else {
    await Deno.writeTextFile(path, output);
    console.log(`Wrote ${path}`);
  }
}
