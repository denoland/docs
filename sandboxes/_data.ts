import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Sandboxes",
    items: [
      { title: "About", href: "/sandboxes/" },
      {
        title: "Getting started",
        href: "/sandboxes/getting_started/",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "API Reference",
        href: "https://jsr.io/@deno/sandbox/doc/~/Sandbox",
      },
      {
        title: "Examples",
        href: "/examples/#sandboxes",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Sandboxes";
export const sectionHref = "/sandboxes/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
  {
    title: "Sandboxes",
    href: "/sandboxes/",
  },
] satisfies SidebarNav;
