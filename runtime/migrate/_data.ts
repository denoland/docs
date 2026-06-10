import type { Sidebar } from "../../types.ts";

// Scoped sidebar for the Migrate from Node.js section. Guide pages live under
// /runtime/fundamentals/ and opt in via `navSection: /runtime/migrate/`
// frontmatter; reference pages stay in the central reference and are linked.
export const sidebar = [
  {
    title: "Migrate from Node.js",
    items: [
      { title: "Overview", href: "/runtime/migrate/" },
      { title: "Node.js compatibility", href: "/runtime/fundamentals/node/" },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "tsconfig migration",
        href: "/runtime/reference/ts_config_migration/",
      },
      {
        title: "Deno 1.x to 2.x",
        href: "/runtime/reference/migration_guide/",
      },
    ],
  },
] satisfies Sidebar;
