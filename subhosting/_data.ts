import { Sidebar } from "../types.ts";

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
        title: "API Reference Docs",
        href: "https://apidocs.deno.com",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Subhosting";
export const sectionHref = "/subhosting/manual/";
