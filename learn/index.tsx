import { walkSync } from "@std/fs/walk";
import LandingPage from "./_pages/LandingPage.tsx";
import ExamplePage from "./_pages/ExamplePage.tsx";
import ExamplesPage from "./_pages/ExamplesPage.tsx";
import TutorialPage from "./_pages/TutorialsPage.tsx";
import VideoPage from "./_pages/VideosPage.tsx";
import { ExampleFromFileSystem } from "./types.ts";
import { parseExample } from "./utils/parseExample.ts";

export const layout = "raw.tsx";

export const sidebar = [
  {
    items: [
      {
        label: "Runtime Manual",
        id: "/runtime/",
      },
      {
        label: "Examples",
        id: "/learn/examples/",
      },
      {
        label: "API reference",
        id: "/api/deno",
      },
      {
        label: "Deploy",
        id: "/deploy/manual/",
      },
      {
        label: "Subhosting",
        id: "/subhosting/manual/",
      },
      {
        label: "deno.com",
        id: "https://deno.com",
      },
    ],
  },
];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  const files = [...walkSync("./learn/examples/", { exts: [".ts"] })];

  const examples = files.map((file) => {
    const content = Deno.readTextFileSync(file.path);

    return {
      name: file.name,
      content,
      label: file.name.replace(".ts", ""),
      parsed: parseExample(file.name, content),
    } as ExampleFromFileSystem;
  });

  for (const example of examples) {
    yield {
      url: `/learn/examples/${example.label}/index.html`,
      title: `${example.parsed.title} - Deno by Example`,
      content: <ExamplePage example={example} />,
    };
  }

  yield {
    url: `/learn/tutorials/index.html`,
    title: `Tutorials`,
    content: <TutorialPage />,
  };

  yield {
    url: `/learn/videos/index.html`,
    title: `Videos`,
    content: <VideoPage />,
  };

  yield {
    url: `/learn/examples/index.html`,
    title: `Deno by Example`,
    content: <ExamplesPage examples={examples} />,
  };

  yield {
    url: `/learn/index.html`,
    title: `Learning Hub`,
    content: <LandingPage />,
  };
}
