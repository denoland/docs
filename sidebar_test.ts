import { assert } from "@std/assert";

// The longest runtime sidebar label today is 22 characters (for example
// "Continuous integration" or "Stability and releases"). Labels longer than
// this wrap onto two lines and blow out the sidebar, so new nav labels must not
// exceed the current maximum. If you genuinely need a longer one, shorten it (or
// shorten another) — only raise this number with a deliberate design change.
const MAX_LABEL_LENGTH = 22;

// We read the `title:` string literals out of runtime/_data.ts directly rather
// than importing it: importing pulls in types.ts, whose `JSX.Element` type does
// not resolve under `deno test`'s standalone type-check. This covers every
// human-written label (the ones at risk of being too long); the generated
// standard-library entries use a variable and are short JSR module names.
Deno.test("Runtime sidebar labels stay within the max length", async () => {
  const source = await Deno.readTextFile("./runtime/_data.ts");
  const titles = [...source.matchAll(/title:\s*"([^"]+)"/g)].map((m) => m[1]);

  assert(
    titles.length > 0,
    "expected to find sidebar title labels in runtime/_data.ts",
  );

  const tooLong = titles.filter((title) => title.length > MAX_LABEL_LENGTH);

  assert(
    tooLong.length === 0,
    `These runtime sidebar labels exceed ${MAX_LABEL_LENGTH} characters:\n` +
      tooLong
        .map((title) => `  ${title.length}  "${title}"`)
        .join("\n") +
      `\nShorten them, or raise MAX_LABEL_LENGTH in sidebar_test.ts if this ` +
      `is an intentional design change.`,
  );
});
