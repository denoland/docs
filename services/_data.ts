import { SidebarNav } from "../types.ts";

export const sectionTitle = "Deploy";
export const sectionHref = "/deploy/classic/";
export const SidebarNav = [
  {
    title: "Deno Deploy<sup>EA</sup>",
    href: "/deploy/early-access/",
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
