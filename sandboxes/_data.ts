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
        href: "/sandboxes/create/",
      },
      {
        title: "Promoting sandboxes",
        href: "/sandboxes/promote/",
      },
    ],
  },
  {
    title: "Concepts",
    items: [
      {
        title: "Expose HTTP",
        href: "/sandboxes/expose_http/",
      },
      {
        title: "Expose SSH",
        href: "/sandboxes/expose_ssh/",
      },
      {
        title: "Manage Deploy apps",
        href: "/sandboxes/manage_apps/",
      },
      {
        title: "Volumes",
        href: "/sandboxes/volumes/",
      },
      {
        title: "Lifetimes",
        href: "/sandboxes/lifetimes/",
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
        href: "/runtime/cli/deploy/#sandbox-management",
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
