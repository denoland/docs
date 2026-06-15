---
last_modified: 2026-06-12
title: "Test sanitizers"
description: "Deno's test sanitizers catch leaking async operations, resources, and surprise exits in your tests. Learn what each sanitizer checks and how to enable them."
oldUrl:
  - /runtime/manual/basics/testing/sanitizers/
---

The [`deno test`](/runtime/reference/cli/test/) runner offers several sanitizers
that catch tests misbehaving in ways assertions don't see: leaking async
operations, unclosed resources, and unexpected process exits.

## Resource sanitizer

The resource sanitizer ensures that all I/O resources created during a test are
closed, to prevent leaks.

I/O resources are things like [`Deno.FsFile`](/api/deno/~/Deno.FsFile) handles,
network connections, [`fetch`](/api/web/~/fetch) bodies, timers, and other
resources that are not automatically garbage collected.

You should always close resources when you are done with them. For example, to
close a file:

```ts
const file = await Deno.open("hello.txt");
// Do something with the file
file.close(); // <- Always close the file when you are done with it
```

To close a network connection:

```ts
const conn = await Deno.connect({ hostname: "example.com", port: 80 });
// Do something with the connection
conn.close(); // <- Always close the connection when you are done with it
```

To close a [`fetch`](/api/web/~/fetch) body:

```ts
const response = await fetch("https://example.com");
// Do something with the response
await response.body?.cancel(); // <- Always cancel the body when you are done with it, if you didn't consume it otherwise
```

As of Deno 2.8 this sanitizer is **off by default**. Opt in with
`sanitizeResources: true`, or with one of the global mechanisms described in
[Enabling sanitizers globally](#enabling-sanitizers-globally).

```ts
Deno.test({
  name: "no leaks allowed",
  async fn() {
    using file = await Deno.open("hello.txt");
    // ...
  },
  sanitizeResources: true,
});
```

## Async operation sanitizer

The async operation sanitizer ensures that all async operations started in a
test are completed before the test ends. This is important because if an async
operation is not awaited, the test will end before the operation is completed,
and the test will be marked as successful even if the operation may have
actually failed.

You should always await all async operations in your tests. For example:

```ts
Deno.test({
  name: "async operation test",
  async fn() {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  },
});
```

As of Deno 2.8 this sanitizer is **off by default**. Opt in with
`sanitizeOps: true`, or with one of the global mechanisms described below.

```ts
Deno.test({
  name: "no leaked ops allowed",
  async fn() {
    await someAsyncWork();
  },
  sanitizeOps: true,
});
```

## Enabling sanitizers globally

If you want the pre-2.8 behavior (resource and op sanitizers on for every test),
you can re-enable them at any of five scopes. Higher-precedence settings
override lower ones.

1. **Per-test** (highest precedence):

   ```ts
   Deno.test({
     name: "strict",
     sanitizeOps: true,
     sanitizeResources: true,
     fn() {/* … */},
   });
   ```

2. **Per-module** with
   [`Deno.test.sanitizer()`](/api/deno/~/Deno.test.sanitizer):

   ```ts
   Deno.test.sanitizer({ ops: true, resources: true });

   Deno.test("uses module-level sanitizers", () => {/* … */});
   ```

3. **CLI flags**: `--sanitize-ops` and `--sanitize-resources`.

4. **Environment variables**: `DENO_TEST_SANITIZE_OPS=1` and
   `DENO_TEST_SANITIZE_RESOURCES=1`.

5. **`deno.json`** (lowest precedence):

   ```jsonc
   {
     "test": {
       "sanitizeOps": true,
       "sanitizeResources": true
     }
   }
   ```

## Exit sanitizer

The exit sanitizer ensures that tested code doesn’t call
[`Deno.exit()`](/api/deno/~/Deno.exit), which could signal a false test success.

This sanitizer is enabled by default, but can be disabled with
`sanitizeExit: false`.

```ts
Deno.test({
  name: "false success",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// This test never runs, because the process exits during "false success" test
Deno.test({
  name: "failing test",
  fn() {
    throw new Error("this test fails");
  },
});
```
