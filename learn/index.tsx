import { walkSync } from "@std/fs/walk";
import LandingPage from "./_pages/LandingPage.tsx";
import ExamplePage from "./_pages/ExamplePage.tsx";
import { ExampleFromFileSystem } from "./types.ts";
import { parseExample } from "./utils/parseExample.ts";

export const layout = "raw.tsx";

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
    url: `/learn/index.html`,
    title: `Learning Hub`,
    content: <LandingPage />,
  };
}
