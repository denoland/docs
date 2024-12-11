import LandingPage from "./_pages/LandingPage.tsx";

export const layout = "raw.tsx";
export const sidebar = [
  {
    items: [
      {
        label: "Runtime",
        id: "/runtime/",
      },
      {
        label: "API Reference",
        id: "/api/deno/",
      },
      {
        label: "Examples",
        id: "/examples/",
      },
      {
        label: "Deploy",
        id: "/deploy/",
      },
      {
        label: "Subhosting",
        id: "/subhosting/",
      },
    ],
  },
];

export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  yield {
    url: `/examples/`,
    title: `Deno examples and tutorials`,
    content: <LandingPage />,
  };
}
