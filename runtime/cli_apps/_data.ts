import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the CLI apps section. The landing is a guide; commands
// stay in the central CLI reference and are linked.
export const sidebar = [
  {
    title: "CLI apps",
    items: [
      { title: "Overview", href: "/runtime/cli_apps/" },
    ],
  },
  {
    title: "Commands",
    items: [
      { title: "deno compile", href: "/runtime/reference/cli/compile/" },
      { title: "deno install", href: "/runtime/reference/cli/install/" },
    ],
  },
] satisfies Sidebar;
