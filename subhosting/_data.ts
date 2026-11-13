import type { Sidebar, SidebarNavItem } from "../types.ts";

export const sidebar = [
  {
    title: "Subhosting",
    items: [
      {
        title: "About Subhosting",
        href: "/subhosting/",
      },
      {
        title: "API reference",
        href: "https://api.deno.com/v2/docs",
      },
      {
        title: "Deno Deploy docs",
        href: "/deploy/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Subhosting";
export const sectionHref = "/subhosting/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
  },
  {
    title: "Deno Sandbox",
    href: "/sandbox/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/",
  },
] satisfies SidebarNavItem[];
