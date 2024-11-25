import { join } from "@std/path";
import { walk } from "@std/fs";
import { assertEquals, assertNotMatch } from "@std/assert";

const decoder = new TextDecoder();

Deno.test("Check examples", async (t) => {
  for await (const item of walk("./learn/examples/")) {
    const path = join("examples", item.name);

    if (!path.endsWith(".ts")) continue;

    await t.step("Check graph: " + path, async () => {
      const result = await new Deno.Command(Deno.execPath(), {
        args: ["info", path],
      }).output();
      assertEquals(result.code, 0);
      assertNotMatch(decoder.decode(result.stdout), /\(resolve error\)/);
    });
  }
});
