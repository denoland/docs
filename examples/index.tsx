export const layout = "raw.tsx";

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
