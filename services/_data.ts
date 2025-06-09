import { SecondaryNav } from "../types.ts";

export const sectionTitle = "Deploy";
export const sectionHref = "/deploy/manual/";
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
