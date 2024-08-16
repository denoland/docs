/**
 * @title Writing Tests
 * @difficulty beginner
 * @tags cli
 * @run deno test --allow-read --allow-write <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.test} Doc: Deno.test
 * @resource {https://jsr.io/@std/assert/doc} Doc: @std/assert
 * @group CLI
 *
 * One of the most common tasks in developing software is writing tests for
 * existing code. Deno has a built-in test runner which makes this very easy.
 */

// First, we import assert statements from the standard library. There are
// quite a few options but we will just import the most common ones here.
import { assert, assertEquals } from "jsr:@std/assert";

// The most simple way to use the test runner is to just pass it a description
// and a callback function
Deno.test("assert works correctly", () => {
  assert(true);
  assertEquals(1, 1);
});

// In more complex scenarios, we often need to have some setup and teardown code
// with some steps in between. This is also made simple with the built-in test runner.
Deno.test("testing steps", async (t) => {
  const file = await Deno.open("example.txt", {
    read: true,
    write: true,
    create: true,
  });
  const encoder = new TextEncoder();
  const data = encoder.encode("Hello world!");

  await t.step("write some bytes", async () => {
    const bytesWritten = await file.write(data);
    assertEquals(bytesWritten, data.length);
    await file.seek(0, Deno.SeekMode.Start);
  });

  await t.step("read some bytes", async () => {
    const buffer = new Uint8Array(data.length);
    await file.read(buffer);
    assertEquals(buffer, data);
  });

  file.close();
});

// The test runner by default makes it very hard to shoot yourself in the foot. For
// each test, the test runner checks to make sure all resources created during the
// test are freed. There are situations where this is not useful behavior. We can use
// the more complex test definition to disable this behavior
Deno.test({
  name: "leaky test",
  async fn() {
    await Deno.open("example.txt");
  },
  sanitizeResources: false,
});
