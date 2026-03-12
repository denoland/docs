import { walk } from "@std/fs";
import { extract } from "@std/front-matter/yaml";
import { assert } from "@std/assert";

const DIRS_TO_CHECK = ["./runtime", "./deploy", "./examples"];

Deno.test("Frontmatter titles must not contain backticks or comma-separated descriptions", async (t) => {
  for (const dir of DIRS_TO_CHECK) {
    for await (const entry of walk(dir, { exts: [".md", ".mdx"] })) {
      const content = await Deno.readTextFile(entry.path);
      if (!content.startsWith("---")) continue;

      const { attrs } = extract<{ title?: string }>(content);
      if (typeof attrs.title !== "string") continue;

      const title = attrs.title;

      await t.step(`${entry.path}`, () => {
        assert(
          !title.includes("`"),
          `Title contains backticks: "${title}". Use plain text instead.`,
        );
        assert(
          !title.includes(","),
          `Title contains a comma: "${title}". Avoid comma-separated descriptions in titles.`,
        );
      });
    }
  }
});
