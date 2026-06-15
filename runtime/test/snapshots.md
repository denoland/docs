---
last_modified: 2026-06-12
title: "Snapshot testing"
description: "Capture program output as reference snapshots with @std/testing, compare against them on every run, and update them with deno test -- --update."
oldUrl:
  - /runtime/manual/basics/testing/snapshot_testing/
  - /examples/snapshot_test_tutorial/
  - /examples/snapshot_tutorial/
---

Snapshot testing captures the output of your code and compares it against a
stored reference version on every test run. Instead of hand-writing an assertion
for each property, you let the test runner record the entire serialized output
once, then fail loudly whenever that output changes. This is ideal when the
value you want to verify is large or hard to express by hand (rendered HTML, CLI
output, API response shapes, error objects), or when the expected output changes
often enough that maintaining manual assertions becomes a chore. The
[Deno Standard Library](/runtime/reference/std/) ships this as the
[`@std/testing/snapshot`](https://jsr.io/@std/testing/doc/snapshot) module.

## Write your first snapshot test

The `assertSnapshot` function serializes a value and compares it to a reference
snapshot stored alongside your test file. It takes the test context `t` that
Deno passes to your test function, which it uses to name the snapshot and locate
the snapshot file.

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async (t) => {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a);
});
```

No snapshot exists yet, so the first run must create one. New snapshots are only
written when you run the tests in update mode:

```bash
deno test --allow-read --allow-write -- --update
```

Two things to note about this command:

- `--allow-read` and `--allow-write` are required because `assertSnapshot` reads
  and writes snapshot files on disk. Without `--allow-read`, every call to
  `assertSnapshot` fails with a permission error. You can scope both permissions
  down to just the snapshot directory if you prefer.
- The bare `--` separates flags for `deno test` from arguments passed to the
  test files themselves. The `--update` flag (or its short form `-u`) must come
  after the `--`, because it is read by the snapshot module, not by the Deno
  CLI.

Once the snapshot exists, run the test normally. Only read permission is needed:

```bash
deno test --allow-read
```

The test now passes if the serialized value matches the stored snapshot and
fails with an `AssertionError` showing a diff if it does not.

## Read the snapshot file

Snapshots are written to a `__snapshots__` directory next to the test file, in a
`.snap` file named after the test module. For the example above, the file is
`__snapshots__/example_test.ts.snap`:

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

Each entry is keyed by the test name plus a counter, so a test that calls
`assertSnapshot` multiple times produces `isSnapshotMatch 1`,
`isSnapshotMatch 2`, and so on. The value is the result of serializing your data
with [`Deno.inspect`](/api/deno/~/Deno.inspect), with object keys sorted
alphabetically. Snapshot files are plain TypeScript, so they are easy to read in
code review.

Commit snapshot files to version control. That way, snapshot changes are
reviewed alongside the code changes that caused them, and anyone who pulls your
branch gets passing tests without regenerating snapshots locally.

## Update snapshots

This is the part of the workflow you will use most. When you intentionally
change behavior and your snapshot tests start failing, or when you add new
`assertSnapshot` calls, rerun the tests in update mode:

```bash
deno test --allow-read --allow-write -- --update
```

In update mode, any snapshot that does not match the current output is
rewritten, and any missing snapshot is created. Snapshots that already match are
left untouched. You can also pass `-u` instead of `--update`.

After updating, inspect the diff of the `.snap` files with `git diff` before
committing. The update command happily records bugs as the new expected output,
so the human review of that diff is what gives snapshot tests their value.

To try the full loop with the example above: change `hello: "world!"` to
`hello: "everyone!"`, run `deno test --allow-read`, and watch the test fail with
a diff. Then run the update command and the snapshot file is rewritten to match.

## Review snapshot diffs in CI

In CI you want to verify snapshots, never update them, so run the tests without
the `--update` flag and without write permission:

```yaml title=".github/workflows/test.yml"
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - name: Run tests
        run: deno test --allow-read
```

If a pull request changes output, the CI run fails and the author must update
the snapshots locally and commit the new `.snap` files. Reviewers then see the
exact before-and-after output in the pull request diff and can confirm the
change is intentional.

## Control serialization and snapshot location

`assertSnapshot` accepts an options object as its third argument for cases where
the defaults do not fit:

```ts title="serializer_test.ts"
import { assertSnapshot, serialize } from "jsr:@std/testing/snapshot";
import { stripAnsiCode } from "jsr:@std/fmt/colors";

function customSerializer(actual: string) {
  return serialize(stripAnsiCode(actual));
}

Deno.test("Custom Serializer", async (t) => {
  const output = "\x1b[34mHello World!\x1b[39m";
  await assertSnapshot(t, output, {
    serializer: customSerializer,
  });
});
```

The most useful options:

- `serializer`: a function that turns the value into a string. It must be
  deterministic. Use it to strip ANSI color codes, replace timestamps or UUIDs
  with placeholders, or redact sensitive data before it lands in a committed
  file.
- `name`: overrides the snapshot key, which otherwise defaults to the test name.
- `dir` and `path`: control where the snapshot file is written, resolved
  relative to the test file.
- `mode`: force `"assert"` or `"update"` behavior for a single call, regardless
  of the `--update` flag.

Classes can also customize their own serialization by implementing
`Symbol.for("Deno.customInspect")`, since the default serializer is built on
[`Deno.inspect`](/api/deno/~/Deno.inspect). See the
[`@std/testing/snapshot` API documentation](https://jsr.io/@std/testing/doc/snapshot)
for the full options reference and the `createAssertSnapshot` factory.

## When not to snapshot

Snapshot tests assert that output has not changed, not that it is correct. They
are a poor fit when:

- A precise assertion is easy to write. `assertEquals(sum, 3)` documents intent
  far better than a snapshot of `3`.
- The output is non-deterministic. Timestamps, random IDs, and unordered
  collections cause flaky failures unless you normalize them with a custom
  serializer.
- The output is huge. Multi-thousand-line snapshots get rubber-stamped in
  review, which defeats the purpose. Snapshot the relevant fragment instead.
- The test should verify behavior rather than representation. Asserting on a
  rendered string couples the test to formatting details that may change for
  unrelated reasons.

A good rule of thumb: use snapshots where a human can meaningfully review the
recorded output, and explicit assertions everywhere else.

## Keep going

- [Testing overview](/runtime/test/): the built-in test runner, assertions,
  steps, and permissions.
- [Mocking](/runtime/test/mocking/): spies, stubs, and faked time for the inputs
  your snapshots depend on.
- [`@std/testing/snapshot` API docs](https://jsr.io/@std/testing/doc/snapshot):
  every option, plus `createAssertSnapshot` for shared defaults.
