import LandingPage from "./_pages/LandingPage.tsx";

export const layout = "raw.tsx";
export const sidebar = [
  {
    title: "Runtime",
    href: "/runtime/",
    items: [],
  },
  {
    title: "API reference",
    href: "/api/deno/",
    items: [],
  },
  {
    title: "Learning hub",
    href: "/learn/",
    items: [],
  },
  {
    title: "Deploy",
    href: "/deploy/",
    items: [],
  },
  {
    title: "Subhosting",
    href: "/subhosting/",
    items: [],
  },
];

export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  yield {
    url: `/learn/index.html`,
    title: `Learning Hub`,
    content: <LandingPage />,
  };
}
