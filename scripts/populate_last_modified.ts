/**
 * One-time script to populate `last_modified` frontmatter in .md files
 * from git history. Targets: runtime/, deploy/, examples/tutorials/
 *
 * Usage: deno run -A scripts/populate_last_modified.ts
 */

const TARGET_GLOBS = [
  "runtime/*.md",
  "deploy/*.md",
  "examples/tutorials/*.md",
];

// Get last-modified dates from git history
const result = new Deno.Command("git", {
  args: [
    "log",
    "--pretty=format:%aI",
    "--name-only",
    "--diff-filter=ACMR",
    "HEAD",
  ],
  stdout: "piped",
}).outputSync();

if (!result.success) {
  console.error("git log failed");
  Deno.exit(1);
}

const output = new TextDecoder().decode(result.stdout);
const lastModified: Record<string, string> = {};
let currentDate = "";

for (const line of output.split("\n")) {
  if (!line) continue;
  if (line.match(/^\d{4}-/)) {
    currentDate = line.slice(0, 10); // YYYY-MM-DD
  } else if (!(line in lastModified)) {
    lastModified[line] = currentDate;
  }
}

// Collect target files
const targetFiles = new Set<string>();
for (const glob of TARGET_GLOBS) {
  const r = new Deno.Command("git", {
    args: ["ls-files", glob],
    stdout: "piped",
  }).outputSync();
  for (const entry of new TextDecoder().decode(r.stdout).trim().split("\n")) {
    if (entry) targetFiles.add(entry);
  }
}

let updated = 0;
let skipped = 0;

for (const file of targetFiles) {
  const date = lastModified[file];
  if (!date) {
    console.warn(`No git date for ${file}, skipping`);
    skipped++;
    continue;
  }

  const content = await Deno.readTextFile(file);
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) {
    console.warn(`No frontmatter in ${file}, skipping`);
    skipped++;
    continue;
  }

  const frontmatter = fmMatch[1];

  // Skip if already has last_modified
  if (frontmatter.includes("last_modified:")) {
    skipped++;
    continue;
  }

  // Insert last_modified after the opening ---
  const newContent = content.replace(
    /^---\n/,
    `---\nlast_modified: ${date}\n`,
  );

  await Deno.writeTextFile(file, newContent);
  updated++;
}

console.log(`Done: ${updated} files updated, ${skipped} skipped`);
