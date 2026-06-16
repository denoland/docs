// Freshness check: when a docs page that tracks a `last_modified` field is
// changed in a pull request, that field must be bumped in the same PR.
//
// The check compares the PR against its merge-base with the target branch.
// Pages that don't have a `last_modified` field at all are left alone, so
// this only enforces freshness where we already opted in to tracking it.
//
// Run locally:   deno task check:freshness
// Run in CI:     BASE_SHA=<base sha> deno task check:freshness

import { extract } from "@std/front-matter/yaml";

const DOC_EXTENSIONS = [".md", ".mdx"];

async function git(...args: string[]): Promise<string> {
  const { code, stdout, stderr } = await new Deno.Command("git", {
    args,
    stdout: "piped",
    stderr: "piped",
  }).output();
  if (code !== 0) {
    throw new Error(
      `git ${args.join(" ")} failed:\n${new TextDecoder().decode(stderr)}`,
    );
  }
  return new TextDecoder().decode(stdout);
}

// Returns the blob at `ref:path`, or null if the path doesn't exist there.
async function showFile(ref: string, path: string): Promise<string | null> {
  const { code, stdout } = await new Deno.Command("git", {
    args: ["show", `${ref}:${path}`],
    stdout: "piped",
    stderr: "null",
  }).output();
  if (code !== 0) return null;
  return new TextDecoder().decode(stdout);
}

// Extracts and normalizes the `last_modified` field as a YYYY-MM-DD string,
// or null if the file has no frontmatter or no `last_modified` field.
function lastModified(content: string | null): string | null {
  if (!content || !content.startsWith("---")) return null;
  let attrs: { last_modified?: unknown };
  try {
    ({ attrs } = extract<{ last_modified?: unknown }>(content));
  } catch {
    return null;
  }
  const value = attrs.last_modified;
  if (value == null) return null;
  // YAML parses an unquoted date into a Date; normalize both forms to a string.
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim();
}

function isDoc(path: string): boolean {
  return DOC_EXTENSIONS.some((ext) => path.endsWith(ext));
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function resolveBase(): Promise<string> {
  const fromEnv = Deno.env.get("BASE_SHA") ?? Deno.env.get("BASE_REF");
  if (fromEnv) return fromEnv.trim();
  // Local fallback: diff against the default branch.
  for (const ref of ["origin/main", "main"]) {
    const { code } = await new Deno.Command("git", {
      args: ["rev-parse", "--verify", "--quiet", ref],
      stdout: "null",
      stderr: "null",
    }).output();
    if (code === 0) return ref;
  }
  throw new Error(
    "Could not determine a base ref. Set BASE_SHA or ensure origin/main exists.",
  );
}

async function main() {
  const base = await resolveBase();
  const mergeBase = (await git("merge-base", base, "HEAD")).trim();

  const today = new Date().toISOString().slice(0, 10);
  const violations: string[] = [];

  // -M detects renames; status is e.g. "M", "A", "D", "R095".
  const nameStatus = await git(
    "diff",
    "--name-status",
    "-M",
    `${mergeBase}..HEAD`,
  );

  for (const line of nameStatus.split("\n")) {
    if (!line.trim()) continue;
    const parts = line.split("\t");
    const status = parts[0];
    if (status === "D") continue; // deletions need no bump

    const isRename = status.startsWith("R");
    const oldPath = parts[1];
    const newPath = isRename ? parts[2] : parts[1];
    if (!isDoc(newPath)) continue;

    const headContent = await showFile("HEAD", newPath);
    const baseContent = status === "A"
      ? null
      : await showFile(mergeBase, oldPath);

    // No real content change (e.g. a pure rename) needs no bump.
    if (baseContent !== null && baseContent === headContent) continue;

    const baseLM = lastModified(baseContent);
    const headLM = lastModified(headContent);

    // Page doesn't track last_modified on either side: out of scope.
    if (baseLM === null && headLM === null) continue;

    if (headLM === null) {
      violations.push(
        `${newPath}: the 'last_modified' field was removed; keep it and set it to ${today}.`,
      );
      continue;
    }

    if (!DATE_RE.test(headLM)) {
      violations.push(
        `${newPath}: 'last_modified' must be a YYYY-MM-DD date, got "${headLM}".`,
      );
      continue;
    }

    if (headLM > today) {
      violations.push(
        `${newPath}: 'last_modified' is in the future ("${headLM}"); today is ${today}.`,
      );
      continue;
    }

    // The core freshness rule: content changed but the date didn't move.
    if (baseLM !== null && headLM === baseLM) {
      violations.push(
        `${newPath}: page changed but 'last_modified' was not updated (still ${headLM}); set it to ${today}.`,
      );
    }
  }

  if (violations.length > 0) {
    console.error(
      `\nFreshness check failed for ${violations.length} page(s):\n`,
    );
    for (const v of violations) console.error(`  - ${v}`);
    console.error(
      `\nWhen you change a page that tracks 'last_modified', bump that field to the date of the change.\n`,
    );
    Deno.exit(1);
  }

  console.log(
    "Freshness check passed: all changed pages have a fresh 'last_modified'.",
  );
}

if (import.meta.main) {
  await main();
}
