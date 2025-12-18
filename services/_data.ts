import { SidebarNav } from "../types.ts";

export const sectionTitle = "Services";
export const sectionHref = "/services/";
export const SidebarNav = [
  {
    title: "Deno Deploy",
    href: "/deploy/",
  },
  {
    title: "Sandboxes",
    href: "/sandboxes/",
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
