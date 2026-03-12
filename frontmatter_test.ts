import { walk } from "@std/fs";
import { extract } from "@std/front-matter/yaml";
import { assert, assertEquals } from "@std/assert";

const DIRS_TO_CHECK = ["./runtime", "./deploy", "./examples"];

Deno.test("Frontmatter titles must not contain backticks", async (t) => {
  for (const dir of DIRS_TO_CHECK) {
    for await (const entry of walk(dir, { exts: [".md", ".mdx"] })) {
      const content = await Deno.readTextFile(entry.path);
      if (!content.startsWith("---")) continue;

      const { attrs } = extract<{ title?: string }>(content);
      if (typeof attrs.title !== "string") continue;

      await t.step(entry.path, () => {
        assert(
          !attrs.title!.includes("`"),
          `Title contains backticks: "${attrs.title}". Use plain text instead.`,
        );
      });
    }
  }
});

Deno.test("CLI command page titles must be just the command name", async (t) => {
  for await (
    const entry of walk("./runtime/reference/cli", { exts: [".md"] })
  ) {
    const content = await Deno.readTextFile(entry.path);
    if (!content.startsWith("---")) continue;

    const { attrs } = extract<{ title?: string; command?: string }>(content);
    if (typeof attrs.command !== "string") continue;

    const expected = `deno ${attrs.command}`;

    await t.step(entry.path, () => {
      assertEquals(
        attrs.title,
        expected,
        `Title should be "${expected}", got "${attrs.title}". Put descriptions in the "description" field instead.`,
      );
    });
  }
});
