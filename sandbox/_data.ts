import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Sandbox",
    items: [
      { title: "About", href: "/sandbox/" },
      {
        title: "Getting started",
        href: "/sandbox/getting_started/",
      },
      {
        title: "Create a sandbox",
        href: "/sandbox/create/",
      },
      {
        title: "Management via CLI",
        href: "/sandbox/cli/",
      },
    ],
  },
  {
    title: "Concepts",
    items: [
      {
        title: "Expose HTTP",
        href: "/sandbox/expose_http/",
      },
      {
        title: "SSH",
        href: "/sandbox/ssh/",
      },
      {
        title: "Manage Deno Deploy apps",
        href: "/sandbox/apps/",
      },
      {
        title: "Volumes & Snapshots",
        href: "/sandbox/volumes/",
      },
      {
        title: "Timeouts",
        href: "/sandbox/timeouts/",
      },
      {
        title: "Security",
        href: "/sandbox/security/",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "SDK Reference",
        href: "https://jsr.io/@deno/sandbox/doc/~/Sandbox",
      },
      {
        title: "REST API",
        href: "https://console.deno.com/api/v2/docs",
      },
      {
        title: "CLI subcommand",
        href: "/runtime/reference/cli/deploy/#sandbox-management",
      },
      {
        title: "Examples",
        href: "/examples/#sandbox",
      },
      {
        title: "Pricing",
        href: "https://deno.com/deploy/sandbox#sandbox-pricing",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Sandbox";
export const sectionHref = "/sandbox/";
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
    title: "Deploy Classic",
    href: "/deploy/classic/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SidebarNav;
