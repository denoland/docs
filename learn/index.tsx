import LandingPage from "./_pages/LandingPage.tsx";

export const layout = "raw.tsx";

export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  yield {
    url: `/learn/index.html`,
    title: `Learning Hub`,
    content: <LandingPage />,
  };
}
