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

export default function* (
  data: Lume.Data,
) {
  yield {
    url: `/examples/`,
    title: `Deno examples and tutorials`,
    content: <data.comp.LandingPage />,
  };
}
