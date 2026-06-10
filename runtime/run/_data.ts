import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the combined "Run code" section — it absorbs the old
// "Get started" section (getting your code running IS getting started). The
// landing is /runtime/ (the quickstart); the get-started and run guide pages
// opt in via `navSection: /runtime/run/`. Commands stay in the central CLI
// reference and are linked here.
export const sidebar = [
  {
    title: "Get started",
    items: [
      { title: "Overview", href: "/runtime/" },
      {
        title: "Installation",
        href: "/runtime/getting_started/installation/",
      },
      {
        title: "Set up your environment",
        href: "/runtime/getting_started/setup_your_environment/",
      },
      {
        title: "Command line interface",
        href: "/runtime/getting_started/command_line_interface/",
      },
    ],
  },
  {
    title: "Run code",
    items: [
      { title: "Running code", href: "/runtime/run/" },
      { title: "Web development", href: "/runtime/fundamentals/web_dev/" },
      { title: "HTTP server", href: "/runtime/fundamentals/http_server/" },
      { title: "Debugging", href: "/runtime/fundamentals/debugging/" },
    ],
  },
  {
    title: "Concepts",
    items: [
      { title: "TypeScript", href: "/runtime/fundamentals/typescript/" },
      { title: "Node", href: "/runtime/fundamentals/node/" },
      { title: "Security", href: "/runtime/fundamentals/security/" },
      { title: "Modules", href: "/runtime/fundamentals/modules/" },
      { title: "Config files", href: "/runtime/fundamentals/configuration/" },
      { title: "Workspaces", href: "/runtime/fundamentals/workspaces/" },
      {
        title: "Stability and releases",
        href: "/runtime/fundamentals/stability_and_releases/",
      },
    ],
  },
  {
    title: "Commands",
    items: [
      { title: "deno run", href: "/runtime/reference/cli/run/" },
      { title: "deno serve", href: "/runtime/reference/cli/serve/" },
      { title: "deno task", href: "/runtime/reference/cli/task/" },
      { title: "deno eval", href: "/runtime/reference/cli/eval/" },
      { title: "deno repl", href: "/runtime/reference/cli/repl/" },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Web platform APIs",
        href: "/runtime/reference/web_platform_apis/",
      },
      {
        title: "Environment variables",
        href: "/runtime/reference/env_variables/",
      },
      { title: "Permissions", href: "/runtime/reference/permissions/" },
    ],
  },
  {
    title: "Contributing",
    items: [
      { title: "Overview", href: "/runtime/contributing/" },
      { title: "Architecture", href: "/runtime/contributing/architecture/" },
      { title: "Style guide", href: "/runtime/contributing/style_guide/" },
      { title: "Help", href: "/runtime/help/" },
    ],
  },
] satisfies Sidebar;
