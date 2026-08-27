import { join } from "@std/path";
import { walk } from "@std/fs";
import { assertEquals, assertNotMatch } from "@std/assert";
import { parseExample } from "../utils/parseExample.ts";

const decoder = new TextDecoder();

/** The `--unstable-*` flags an example declares in its `@run` line. The
 * typecheck below enables exactly the unstable APIs the example needs, so
 * it stays correct as Deno's flag set changes without a hardcoded list. */
function unstableFlags(run: string | undefined): string[] {
  return run?.match(/--unstable-[a-z-]+/g) ?? [];
}

async function typecheck(args: string[]): Promise<Deno.CommandOutput> {
  return await new Deno.Command(Deno.execPath(), {
    // Typecheck without evaluating the examples. This follows the runtime
    // type-checking path, which supports Deno-specific module types.
    args: ["test", "--no-run", ...args],
  }).output();
}

Deno.test("Check examples", async (t) => {
  for await (const item of walk("./examples/scripts/")) {
    const path = join("examples/scripts", item.name);

    if (!path.endsWith(".ts")) continue;

    await t.step("Check graph: " + path, async () => {
      const result = await new Deno.Command(Deno.execPath(), {
        args: ["info", path],
      }).output();
      assertEquals(result.code, 0);
      assertNotMatch(decoder.decode(result.stdout), /\(resolve error\)/);
    });

    // Typecheck each example so that a dependency changing its API is
    // caught here rather than shipping a broken snippet. The graph check
    // above only confirms imports resolve, not that the code still
    // compiles.
    await t.step("Typecheck: " + path, async () => {
      const content = await Deno.readTextFile(path);
      const parsed = parseExample(item.name, content);
      const flags = unstableFlags(parsed.run);

      // Single-file examples can be checked in place.
      if (parsed.files.length <= 1) {
        const result = await typecheck([...flags, path]);
        assertEquals(result.code, 0, decoder.decode(result.stderr));
        return;
      }

      // Multi-file examples embed their companion files inline with
      // `// File:` markers, so they cannot be checked standalone.
      // Reconstruct the files into a temp directory and typecheck every
      // TypeScript entry together so cross-file imports resolve.
      const dir = await Deno.makeTempDir();
      try {
        const entries: string[] = [];
        for (const file of parsed.files) {
          const rel = file.name.replace(/^\.\//, "");
          const code = file.snippets.map((s) => s.code).join("\n");
          await Deno.writeTextFile(join(dir, rel), code);
          if (rel.endsWith(".ts") || rel.endsWith(".js")) {
            entries.push(join(dir, rel));
          }
        }
        const result = await typecheck([...flags, ...entries]);
        assertEquals(result.code, 0, decoder.decode(result.stderr));
      } finally {
        await Deno.remove(dir, { recursive: true });
      }
    });
  }
});
