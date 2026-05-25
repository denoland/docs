import { Sidebar, SidebarNav } from "../types.ts";

export const sidebar = [
  {
    title: "Getting started",
    items: [
      {
        title: "About Subhosting",
        href: "/subhosting/manual/",
      },
      {
        title: "Quick start",
        href: "/subhosting/manual/quick_start/",
      },
      {
        title: "Planning your implementation",
        href: "/subhosting/manual/planning_your_implementation/",
      },
      {
        title: "Pricing and Limits",
        href: "/subhosting/manual/pricing_and_limits/",
      },
    ],
  },
  {
    title: "REST API",
    items: [
      {
        title: "Resources",
        href: "/subhosting/api/",
      },
      {
        title: "Authentication",
        href: "/subhosting/api/authentication/",
      },
      {
        title: "Events",
        href: "/subhosting/manual/events/",
      },
      {
        title: "v1 API Reference (legacy)",
        href: "https://apidocs.deno.com",
      },
      {
        title: "v2 API Reference",
        href: "https://api.deno.com/v2/docs",
      },
      {
        title: "Migration guide (v1 to v2)",
        href: "/subhosting/manual/api_migration_guide/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Subhosting";
export const sectionHref = "/subhosting/manual/";
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
