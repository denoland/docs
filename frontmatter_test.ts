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

Deno.test("last_modified dates must be valid and up to date", async (t) => {
  // Build a map of file -> last content-change date using git log.
  // Uses -G to match only commits that changed non-frontmatter lines,
  // skipping commits that only added/updated the last_modified field itself.
  const result = new Deno.Command("git", {
    args: [
      "log",
      "-G",
      "^(?!last_modified:)",
      "--pretty=format:%aI",
      "--name-only",
      "--diff-filter=ACMR",
      "HEAD",
    ],
    stdout: "piped",
  }).outputSync();

  const output = new TextDecoder().decode(result.stdout);
  const gitDates = new Map<string, string>();
  let currentDate = "";

  for (const line of output.split("\n")) {
    if (!line) continue;
    if (/^\d{4}-/.test(line)) {
      currentDate = line.slice(0, 10); // YYYY-MM-DD
    } else if (!gitDates.has(line)) {
      gitDates.set(line, currentDate);
    }
  }

  for (const dir of DIRS_TO_CHECK) {
    for await (const entry of walk(dir, { exts: [".md", ".mdx"] })) {
      const content = await Deno.readTextFile(entry.path);
      if (!content.startsWith("---")) continue;

      // Extract the raw last_modified value via regex because YAML parse
      // auto-converts YYYY-MM-DD strings to Date objects
      const rawMatch = content.match(/^last_modified:\s*(.+)$/m);
      if (!rawMatch) continue;

      const dateStr = rawMatch[1].trim();

      await t.step(`${entry.path} has valid last_modified`, () => {
        // Must be YYYY-MM-DD format
        assert(
          /^\d{4}-\d{2}-\d{2}$/.test(dateStr),
          `Invalid date format "${dateStr}" in ${entry.path}. Expected YYYY-MM-DD.`,
        );

        // Must parse to a real date
        const parsed = new Date(dateStr + "T00:00:00Z");
        assert(
          !isNaN(parsed.getTime()),
          `"${dateStr}" is not a valid date in ${entry.path}.`,
        );

        // Must not be in the future
        const today = new Date().toISOString().slice(0, 10);
        assert(
          dateStr <= today,
          `last_modified "${dateStr}" is in the future in ${entry.path}.`,
        );

        // Must match the date of the last content change in git history
        const relativePath = entry.path.replace(/^\.\//, "");
        const gitDate = gitDates.get(relativePath);
        if (gitDate) {
          assertEquals(
            dateStr,
            gitDate,
            `last_modified "${dateStr}" does not match last content change "${gitDate}" for ${entry.path}. ` +
              `Run the dev server to auto-update, or manually set last_modified: ${gitDate}.`,
          );
        }
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
