import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "Getting started",
    items: [
      {
        label: "About Subhosting",
        id: "/subhosting/manual/about/",
      },
      {
        label: "Quick start",
        id: "/subhosting/manual/quick_start/",
      },
      {
        label: "Planning your implementation",
        id: "/subhosting/manual/planning_your_implementation/",
      },
      {
        label: "Pricing and Limits",
        id: "/subhosting/manual/pricing_and_limits/",
      },
    ],
  },
  {
    title: "REST API",
    items: [
      {
        label: "Resources",
        id: "/subhosting/api/",
      },
      {
        label: "Authentication",
        id: "/subhosting/api/authentication/",
      },
      {
        label: "Events",
        id: "/subhosting/manual/events/",
      },
      {
        label: "API Reference Docs",
        href: "https://apidocs.deno.com",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Subhosting";
export const sectionHref = "/subhosting/manual/";
