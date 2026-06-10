import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Lint & format section. The landing is the guide;
// commands and rule references stay central and are linked.
export const sidebar = [
  {
    title: "Lint & format",
    items: [
      { title: "Overview", href: "/runtime/lint_and_format/" },
    ],
  },
  {
    title: "Commands",
    items: [
      { title: "deno lint", href: "/runtime/reference/cli/lint/" },
      { title: "deno fmt", href: "/runtime/reference/cli/fmt/" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Lint rules", href: "/lint/" },
      { title: "Lint plugins", href: "/runtime/reference/lint_plugins/" },
    ],
  },
] satisfies Sidebar;
