import { SecondaryNav, Sidebar } from "../../types.ts";

export const sidebar = [
  {
    title: "Deno Deploy Early Access",
    items: [
      { title: "About Early Access", href: "/deploy/early-access/" },
      {
        title: "Getting Started",
        href: "/deploy/early-access/getting_started",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Accounts",
        href: "/deploy/early-access/reference/accounts/",
      },
      {
        title: "Organizations",
        href: "/deploy/early-access/reference/organizations/",
      },
      {
        title: "Apps",
        href: "/deploy/early-access/reference/apps/",
      },
      {
        title: "Builds",
        href: "/deploy/early-access/reference/builds/",
      },
      {
        title: "Environment Variables and Contexts",
        href: "/deploy/early-access/reference/env-vars-and-contexts/",
      },
      {
        title: "Timelines",
        href: "/deploy/early-access/reference/timelines/",
      },
      {
        title: "Observability",
        href: "/deploy/early-access/reference/observability/",
      },
      {
        title: "Domains",
        href: "/deploy/early-access/reference/domains/",
      },
      {
        title: "Databases",
        href: "/deploy/early-access/reference/databases/",
      },
      {
        title: "Cloud Connections",
        href: "/deploy/early-access/reference/cloud-connections/",
      },
      {
        title: "Runtime",
        href: "/deploy/early-access/reference/runtime/",
      },
      {
        title: "Framework support",
        href: "/deploy/early-access/reference/frameworks/",
      },
      {
        title: "CDN and caching",
        href: "/deploy/early-access/reference/caching/",
      },
      {
        title: "Deploy Button",
        href: "/deploy/early-access/reference/button/",
      },
      {
        title: "Usage and Limitations",
        href: "/deploy/early-access/usage/",
      },
    ],
  },
  {
    title: "Support and Feedback",
    items: [
      {
        title: "Changelog",
        href: "/deploy/early-access/changelog/",
      },
      { title: "Support", href: "/deploy/early-access/support/" },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deno Deploy<sup>EA</sup>";
export const sectionHref = "/deploy/early-access/";
export const secondaryNav = [
  {
    title: "Deno Deploy<sup>EA</sup>",
    href: "/deploy/early-access/",
  },
  {
    title: "Deploy Classic",
    href: "/deploy/manual/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SecondaryNav;
