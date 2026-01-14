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
        title: "Management via CLI",
        href: "/sandboxes/cli/",
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
        title: "SSH",
        href: "/sandboxes/ssh/",
      },
      {
        title: "Deno Deploy apps",
        href: "/sandboxes/apps/",
      },
      {
        title: "Volumes",
        href: "/sandboxes/volumes/",
      },
      {
        title: "Timeouts",
        href: "/sandboxes/timeouts/",
      },
      {
        title: "Security",
        href: "/sandboxes/security/",
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
        href: "/runtime/reference/cli/deploy/#sandbox-management",
      },
      {
        title: "Examples",
        href: "/examples/#sandboxes",
      },
      {
        title: "Pricing",
        href: "https://deno.com/deploy/pricing/",
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
    title: "Sandboxes",
    href: "/sandboxes/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SidebarNav;
