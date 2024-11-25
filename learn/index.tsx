import { walkSync } from "@std/fs/walk";
import LandingPage from "./_pages/LandingPage.tsx";
import ExamplePage from "./_pages/ExamplePage.tsx";
import { Example, ExampleFile, ExampleFromFileSystem, DIFFICULTIES, TAGS } from "./types.ts";
import { parseExample } from "./utils/parseExample.ts";
import TutorialPage from "./_pages/TutorialPage.tsx";
import VideoPage from "./_pages/VideoPage.tsx";
import Examples from "./_pages/Examples.tsx";

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
        id: "/examples/",
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
  const files = [...walkSync("./examples/", { exts: [".ts"] }) ];
  
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
    title: `Deno by Tutorial`,
    content: <TutorialPage />,
  };

  yield {
    url: `/learn/videos/index.html`,
    title: `Deno by Video`,
    content: <VideoPage />,
  };

  yield {
    url: `/learn/examples/index.html`,
    title: `Deno by Example`,
    content: <Examples examples={examples} />,
  };

  yield {
    url: `/learn/index.html`,
    title: `Learning Centre`,
    content: <LandingPage examples={examples} />,
  };
}
