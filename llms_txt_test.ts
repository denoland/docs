import { assert, assertEquals } from "@std/assert";
import { generateLlmsTxt } from "./generate_llms_txt.ts";

const LLMS_TXT = "static/llms.txt";

/**
 * Paths served from trees that are generated during the build, so there is no
 * markdown file to check against in this repository.
 */
const GENERATED_PATHS = [
  "/runtime/reference/cli/",
  "/runtime/reference/std/",
  "/lint/",
];

/** Section indexes that exist but are owned by another product's docs tree. */
const PRODUCT_INDEXES = [
  "/deploy/",
  "/sandbox/",
  "/subhosting/manual/",
  "/examples/",
];

Deno.test("llms.txt is up to date with the runtime sidebar", async () => {
  const committed = await Deno.readTextFile(LLMS_TXT);
  const generated = await generateLlmsTxt();
  assertEquals(
    committed,
    generated,
    `${LLMS_TXT} is stale. Run \`deno task generate:llms-txt\` and commit the result.`,
  );
});

Deno.test("every llms.txt docs link resolves to a real page", async (t) => {
  const content = await Deno.readTextFile(LLMS_TXT);
  const paths = [...content.matchAll(/\]\(https:\/\/docs\.deno\.com([^)]*)\)/g)]
    .map((match) => match[1]);

  assert(paths.length > 0, "expected llms.txt to contain docs.deno.com links");

  for (const path of paths) {
    if (GENERATED_PATHS.includes(path) || PRODUCT_INDEXES.includes(path)) {
      continue;
    }
    // The published .txt siblings are emitted by generate_llms_files.ts.
    if (path.endsWith(".txt")) continue;

    await t.step(path, async () => {
      assert(
        path.endsWith("/"),
        `${path} has no trailing slash, so it will 301 on every fetch. ` +
          `Use the canonical URL.`,
      );
      const clean = path.replace(/^\/+/, "").replace(/\/+$/, "");
      const candidates = clean === "" ? ["index.md"] : [
        `${clean}.md`,
        `${clean}/index.md`,
        `${clean}.mdx`,
        `${clean}/index.mdx`,
      ];
      let found = false;
      for (const candidate of candidates) {
        try {
          if ((await Deno.stat(candidate)).isFile) {
            found = true;
            break;
          }
        } catch {
          // try the next candidate
        }
      }
      assert(
        found,
        `${path} is linked from ${LLMS_TXT} but no source file backs it ` +
          `(looked for ${candidates.join(", ")}). The page moved or was ` +
          `removed — fix the sidebar entry it came from.`,
      );
    });
  }
});
