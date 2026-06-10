import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Package manager section. The landing is the dependency
// management guide; the Modules and Workspaces concept pages opt in via
// navSection. Commands stay in the central CLI reference and are linked.
export const sidebar = [
  {
    title: "Package manager",
    items: [
      { title: "Overview", href: "/runtime/packages/" },
      { title: "Modules and imports", href: "/runtime/fundamentals/modules/" },
      { title: "Workspaces", href: "/runtime/fundamentals/workspaces/" },
    ],
  },
  {
    title: "Commands",
    items: [
      { title: "deno add", href: "/runtime/reference/cli/add/" },
      { title: "deno remove", href: "/runtime/reference/cli/remove/" },
      { title: "deno install", href: "/runtime/reference/cli/install/" },
      { title: "deno outdated", href: "/runtime/reference/cli/outdated/" },
      { title: "deno update", href: "/runtime/reference/cli/update/" },
      { title: "deno why", href: "/runtime/reference/cli/why/" },
      { title: "deno publish", href: "/runtime/reference/cli/publish/" },
      { title: "deno pack", href: "/runtime/reference/cli/pack/" },
      { title: "deno audit", href: "/runtime/reference/cli/audit/" },
      {
        title: "deno approve-scripts",
        href: "/runtime/reference/cli/approve_scripts/",
      },
    ],
  },
] satisfies Sidebar;
