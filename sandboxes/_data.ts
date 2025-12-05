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
      {
        title: "Create a sandbox",
        href: "/sandboxes/reference/create/",
      },
      {
        title: "Promoting sandboxes",
        href: "/sandboxes/reference/promote/",
      },
    ],
  },
  {
    title: "Concepts",
    items: [
      {
        title: "Expose HTTP",
        href: "/sandboxes/reference/expose_http/",
      },
      {
        title: "Expose SSH",
        href: "/sandboxes/reference/expose_ssh/",
      },
      {
        title: "Lifetimes",
        href: "/sandboxes/reference/lifetimes/",
      },
      {
        title: "Manage Deploy apps",
        href: "/sandboxes/reference/manage_apps/",
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
        title: "CLI subcommand",
        href: "/runtime/reference/cli/deploy/#sandbox",
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
