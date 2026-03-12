import { walk } from "@std/fs";
import { extract } from "@std/front-matter/yaml";
import { assert, assertEquals } from "@std/assert";

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
