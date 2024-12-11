import LandingPage from "./_pages/LandingPage.tsx";

export const layout = "raw.tsx";
export const sidebar = [];

export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  yield {
    url: `/examples/`,
    title: `Deno examples and tutorials`,
    content: <LandingPage />,
  };
}
