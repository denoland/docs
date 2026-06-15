import { walk } from "@std/fs";
import { extract } from "@std/front-matter/yaml";
import { assert, assertEquals } from "@std/assert";

const DIRS_TO_CHECK = ["./runtime", "./deploy", "./examples"];

// Content pages that must carry a `last_modified` frontmatter field so the
// freshness check (scripts/check_freshness.ts) has something to enforce.
const LAST_MODIFIED_DIRS = [
  "./runtime",
  "./deploy",
  "./examples",
  "./sandbox",
  "./subhosting",
  "./ai",
];
// Generated or synced subtrees that aren't hand-edited content pages.
const LAST_MODIFIED_EXCLUDES = ["runtime/reference/std/"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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

Deno.test("Content pages must have a valid last_modified field", async (t) => {
  const today = new Date().toISOString().slice(0, 10);

  for (const dir of LAST_MODIFIED_DIRS) {
    for await (const entry of walk(dir, { exts: [".md", ".mdx"] })) {
      const rel = entry.path.replace(/^\.\//, "");
      if (LAST_MODIFIED_EXCLUDES.some((p) => rel.startsWith(p))) continue;

      const content = await Deno.readTextFile(entry.path);
      if (content.trim() === "") continue; // empty placeholder, not a page

      await t.step(entry.path, () => {
        assert(
          content.startsWith("---"),
          `Missing frontmatter; add a "last_modified: ${today}" field.`,
        );

        const { attrs } = extract<{ last_modified?: unknown }>(content);
        const value = attrs.last_modified;
        assert(
          value != null,
          `Missing "last_modified" field; add "last_modified: ${today}".`,
        );

        // YAML parses an unquoted date into a Date; accept either form.
        const date = value instanceof Date
          ? value.toISOString().slice(0, 10)
          : String(value).trim();
        assert(
          DATE_RE.test(date),
          `"last_modified" must be a YYYY-MM-DD date, got "${date}".`,
        );
        assert(
          date <= today,
          `"last_modified" is in the future ("${date}"); today is ${today}.`,
        );
      });
    }
  }
});
