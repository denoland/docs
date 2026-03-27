/**
 * Generates lastModified.json from git history.
 *
 * For each file ever touched, records the most recent commit date.
 * Output: a flat JSON object mapping file paths to ISO 8601 date strings.
 *
 * Usage: deno run --allow-run=git --allow-write=lastModified.json --allow-read=. scripts/generate_last_modified.ts
 */

const result = Deno.spawnAndWaitSync("git", [
  "log",
  "--pretty=format:%aI",
  "--name-only",
  "--diff-filter=ACMR",
  "HEAD",
]);

if (!result.success) {
  console.error("git log failed:", new TextDecoder().decode(result.stderr));
  Deno.exit(1);
}

const output = new TextDecoder().decode(result.stdout);
const lastModified: Record<string, string> = {};
let currentDate = "";

for (const line of output.split("\n")) {
  if (!line) continue;
  if (line.match(/^\d{4}-/)) {
    currentDate = line;
  } else if (!(line in lastModified)) {
    lastModified[line] = currentDate;
  }
}

const json = JSON.stringify(lastModified, null, 2);
Deno.writeTextFileSync("lastModified.json", json + "\n");

const count = Object.keys(lastModified).length;
console.log(`Wrote lastModified.json with ${count} entries.`);
