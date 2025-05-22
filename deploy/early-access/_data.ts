import { SecondaryNav, Sidebar } from "../../types.ts";

export const sidebar = [
  {
    title: "About Early Access",
    href: "/deploy/early-access/",
  },
  {
    title: "Getting started",
    href: "/deploy/early-access/getting_started/",
  },
  {
    title: "Reference",
    items: [
      {
        title: "Account",
        href: "/deploy/early-access/reference/account/",
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
        title: "Contexts and Timelines",
        href: "/deploy/early-access/reference/contexts-and-timelines/",
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
        title: "Usage and Limitations",
        href: "/deploy/early-access/usage/",
      },
      {
        title: "Support",
        href: "/deploy/early-access/support/",
      },
    ],
  },
  {
    title: "Changelog",
    href: "/deploy/early-access/changelog/",
  },
] satisfies Sidebar;

export const sectionTitle = "Deploy Early Access";
export const sectionHref = "/deploy/early-access/";
export const secondaryNav = [
  {
    title: "Deploy Early Access",
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
