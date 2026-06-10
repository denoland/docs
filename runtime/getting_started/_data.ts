import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Get started section. These pages already live under
// /runtime/getting_started/, so this works with no file moves (like Reference).
export const sidebar = [
  {
    title: "Get started",
    items: [
      { title: "Overview", href: "/runtime/getting_started/" },
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
    title: "Next steps",
    items: [
      { title: "Run code", href: "/runtime/run/" },
      { title: "Manage packages", href: "/runtime/packages/" },
      { title: "Migrate from Node.js", href: "/runtime/migrate/" },
    ],
  },
] satisfies Sidebar;
