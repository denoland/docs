import { Sidebar } from "../types.ts";

export const sidebar = [
  {
    title: "Style Guide",
    href: "/styleguide/",
    items: [
      {
        title: "Typography",
        href: "/styleguide/typography/",
      },
      {
        title: "OG images",
        href: "/styleguide/og/",
      },
    ],
  },
] satisfies Sidebar;

export const sectionTitle = "Style Guide";
export const sectionHref = "/styleguide/";
