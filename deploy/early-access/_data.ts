import { Sidebar } from "../../types.ts";

export const sidebar = [
  {
    title: "About Early Access",
    href: "/deploy/early-access/",
  },
  {
    title: "Getting started",
    href: "/deploy/early-access/getting_started/",
    items: [
      {
        title: "Reference guide",
        href: "/deploy/early-access/reference/",
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
