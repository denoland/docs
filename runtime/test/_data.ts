import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Test section. The landing is the testing guide;
// commands stay in the central CLI reference and are linked.
export const sidebar = [
  {
    title: "Test",
    items: [
      { title: "Overview", href: "/runtime/test/" },
    ],
  },
  {
    title: "Commands",
    items: [
      { title: "deno test", href: "/runtime/reference/cli/test/" },
      { title: "deno bench", href: "/runtime/reference/cli/bench/" },
      { title: "deno coverage", href: "/runtime/reference/cli/coverage/" },
    ],
  },
] satisfies Sidebar;
