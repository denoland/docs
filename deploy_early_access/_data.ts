import { SecondaryNav, Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "About Early Access",
    href: "/deploy_early_access/",
  },
  {
    title: "Getting started",
    href: "/deploy_early_access/getting_started/",
    items: [
      {
        title: "Reference guide",
        href: "/deploy_early_access/reference/",
      },
      {
        title: "Usage and Limitations",
        href: "/deploy_early_access/usage_and_limitations/",
      },
      {
        title: "Support",
        href: "/deploy_early_access/support/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Deploy Early Access";
export const sectionHref = "/deploy_early_access/";
export const secondaryNav = [
  {
    title: "Deploy",
    href: "/deploy/manual/",
  },
  {
    title: "Deploy Early Access",
    href: "/deploy_early_access/",
  },
  {
    title: "Subhosting",
    href: "/subhosting/manual/",
  },
] satisfies SecondaryNav;
