import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Run section. The guide pages live under
// /runtime/fundamentals/ for now and opt in via `navSection: /runtime/run/`
// frontmatter (URLs get aligned later). Commands stay in the central CLI
// reference and are linked here.
export const sidebar = [
  {
    title: "Run code",
    items: [
      { title: "Overview", href: "/runtime/run/" },
      { title: "Web development", href: "/runtime/fundamentals/web_dev/" },
      { title: "HTTP server", href: "/runtime/fundamentals/http_server/" },
      { title: "Debugging", href: "/runtime/fundamentals/debugging/" },
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
    title: "Related",
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
] satisfies Sidebar;
