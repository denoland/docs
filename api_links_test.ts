import { walk } from "@std/fs";
import { assert } from "@std/assert";

const DIRS_TO_CHECK = ["./runtime"];

/**
 * Find unlinked `Deno.*` API references in markdown prose.
 *
 * Matches: `Deno.serve`  `Deno.readFile()`  `Deno.FsFile`
 * Ignores: [`Deno.serve`](/api/deno/~/Deno.serve)  (already linked)
 * Ignores: references inside fenced code blocks
 * Ignores: section headings (linking a heading breaks anchor nav, see #3358)
 */
function findUnlinkedDenoApis(
  content: string,
): { line: number; api: string }[] {
  const lines = content.split("\n");
  const results: { line: number; api: string }[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    // Skip headings: linking a section heading to the API reference breaks the
    // on-this-page anchor navigation (see issue #3358).
    if (/^#{1,6}\s/.test(line)) continue;

    // Match `Deno.something` or `Deno.something()` NOT preceded by [
    const regex = /(?<!\[)`(Deno\.[a-zA-Z]\w+(?:\.\w+)*?)(?:\(\))?`/g;
    let match;
    while ((match = regex.exec(line)) !== null) {
      results.push({ line: i + 1, api: match[1] });
    }
  }

  return results;
}

Deno.test("`Deno.*` API references should be linked to /api/deno/", async () => {
  const allUnlinked: { file: string; line: number; api: string }[] = [];

  for (const dir of DIRS_TO_CHECK) {
    for await (
      const entry of walk(dir, {
        exts: [".md", ".mdx"],
        skip: [/migration_guide\.md$/],
      })
    ) {
      const content = await Deno.readTextFile(entry.path);
      for (const { line, api } of findUnlinkedDenoApis(content)) {
        allUnlinked.push({ file: entry.path, line, api });
      }
    }
  }

  if (allUnlinked.length > 0) {
    const report = allUnlinked.map(
      ({ file, line, api }) =>
        `${file}:${line} — \`${api}\` → [\`${api}\`](/api/deno/~/${api})`,
    );
    console.log(
      `\nFound ${allUnlinked.length} unlinked Deno API references:\n`,
    );
    console.log(report.join("\n"));
    console.log();
  }

  assert(
    allUnlinked.length === 0,
    `${allUnlinked.length} unlinked Deno API references found (see above)`,
  );
});
