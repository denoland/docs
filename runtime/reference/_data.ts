import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Reference area. Because this _data.ts lives at
// /runtime/reference/, the Navigation component uses it for every page under
// that path (the same mechanism the deploy sub-sections use) — so landing in
// Reference swaps the left sidebar to just reference material instead of the
// full Runtime tree. SidebarNav (the second-level navbar) is inherited from
// runtime/_data.ts, so the bar stays and "Reference" highlights.
export const sidebar = [
  {
    title: "Reference",
    items: [
      { title: "Overview", href: "/runtime/reference/" },
      {
        title: "CLI",
        href: "/runtime/reference/cli/",
        items: [
          { title: "deno add", href: "/runtime/reference/cli/add/" },
          {
            title: "deno approve-scripts",
            href: "/runtime/reference/cli/approve_scripts/",
          },
          { title: "deno audit", href: "/runtime/reference/cli/audit/" },
          { title: "deno bench", href: "/runtime/reference/cli/bench/" },
          {
            title: "deno bump-version",
            href: "/runtime/reference/cli/bump_version/",
          },
          { title: "deno bundle", href: "/runtime/reference/cli/bundle/" },
          { title: "deno check", href: "/runtime/reference/cli/check/" },
          { title: "deno ci", href: "/runtime/reference/cli/ci/" },
          { title: "deno clean", href: "/runtime/reference/cli/clean/" },
          { title: "deno compile", href: "/runtime/reference/cli/compile/" },
          { title: "deno create", href: "/runtime/reference/cli/create/" },
          {
            title: "deno completions",
            href: "/runtime/reference/cli/completions/",
          },
          { title: "deno coverage", href: "/runtime/reference/cli/coverage/" },
          { title: "deno deploy", href: "/runtime/reference/cli/deploy/" },
          { title: "deno doc", href: "/runtime/reference/cli/doc/" },
          { title: "deno eval", href: "/runtime/reference/cli/eval/" },
          { title: "deno fmt", href: "/runtime/reference/cli/fmt/" },
          { title: "deno info", href: "/runtime/reference/cli/info/" },
          { title: "deno init", href: "/runtime/reference/cli/init/" },
          { title: "deno install", href: "/runtime/reference/cli/install/" },
          { title: "deno jupyter", href: "/runtime/reference/cli/jupyter/" },
          { title: "deno lint", href: "/runtime/reference/cli/lint/" },
          { title: "deno outdated", href: "/runtime/reference/cli/outdated/" },
          { title: "deno pack", href: "/runtime/reference/cli/pack/" },
          { title: "deno publish", href: "/runtime/reference/cli/publish/" },
          { title: "deno lsp", href: "/runtime/reference/cli/lsp/" },
          { title: "deno remove", href: "/runtime/reference/cli/remove/" },
          { title: "deno repl", href: "/runtime/reference/cli/repl/" },
          { title: "deno run", href: "/runtime/reference/cli/run/" },
          { title: "deno sandbox", href: "/runtime/reference/cli/sandbox/" },
          { title: "deno serve", href: "/runtime/reference/cli/serve/" },
          { title: "deno task", href: "/runtime/reference/cli/task/" },
          { title: "deno test", href: "/runtime/reference/cli/test/" },
          {
            title: "deno transpile",
            href: "/runtime/reference/cli/transpile/",
          },
          { title: "deno types", href: "/runtime/reference/cli/types/" },
          {
            title: "deno uninstall",
            href: "/runtime/reference/cli/uninstall/",
          },
          { title: "deno update", href: "/runtime/reference/cli/update/" },
          { title: "deno upgrade", href: "/runtime/reference/cli/upgrade/" },
          {
            title: "deno unstable flags",
            href: "/runtime/reference/cli/unstable_flags/",
          },
          { title: "deno why", href: "/runtime/reference/cli/why/" },
          { title: "deno x", href: "/runtime/reference/cli/x/" },
        ],
      },
      { title: "Standard library", href: "/runtime/reference/std/" },
      {
        title: "Web platform APIs",
        href: "/runtime/reference/web_platform_apis/",
      },
      { title: "Deno API reference", href: "/api/deno/" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { title: "deno.json", href: "/runtime/reference/deno_json/" },
      {
        title: "Environment variables",
        href: "/runtime/reference/env_variables/",
      },
      { title: "Permissions", href: "/runtime/reference/permissions/" },
    ],
  },
  {
    title: "TypeScript & JSX",
    items: [
      {
        title: "tsconfig migration",
        href: "/runtime/reference/ts_config_migration/",
      },
      { title: "JSX and React", href: "/runtime/reference/jsx/" },
    ],
  },
  {
    title: "Editor & tooling",
    items: [
      { title: "LSP integration", href: "/runtime/reference/lsp_integration/" },
      { title: "Deno & VS Code", href: "/runtime/reference/vscode/" },
    ],
  },
  {
    title: "Platform",
    items: [
      { title: "WebAssembly", href: "/runtime/reference/wasm/" },
      { title: "Bundling", href: "/runtime/reference/bundling/" },
      { title: "Docker", href: "/runtime/reference/docker/" },
      {
        title: "Continuous integration",
        href: "/runtime/reference/continuous_integration/",
      },
      { title: "Loader hooks", href: "/runtime/reference/loader_hooks/" },
      { title: "Lint plugins", href: "/runtime/reference/lint_plugins/" },
    ],
  },
  {
    title: "Migration",
    items: [
      { title: "Deno 1.x to 2.x", href: "/runtime/reference/migration_guide/" },
    ],
  },
] satisfies Sidebar;
