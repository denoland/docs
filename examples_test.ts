import { join } from "@std/path";
import { walk } from "@std/fs";
import { assertEquals } from "@std/assert";

Deno.test("Check examples", async (t) => {
  for await (const item of walk("./examples")) {
    const path = join("examples", item.name);

    if (!path.endsWith(".ts")) continue;

    await t.step("Check graph: " + path, async () => {
      const result = await new Deno.Command(Deno.execPath(), {
        args: ["info", path],
      }).output();
      assertEquals(result.code, 0);
    });
  }
});
