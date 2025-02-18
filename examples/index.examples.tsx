import { walkSync } from "@std/fs/walk";
import { ExampleFromFileSystem } from "./types.ts";
import { parseExample } from "./utils/parseExample.ts";
import { sidebar as sidebar_ } from "./_data.ts";

export const layout = "doc.tsx";

export const sidebar = sidebar_;
export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  const files = [...walkSync("./examples/scripts/", { exts: [".ts"] })];

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
      url: `/examples/${example.label}/index.html`,
      title: `${example.parsed.title}`,
      content: <_data.comp.ExamplePage example={example} />,
    };
  }
}
