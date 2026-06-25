---
last_modified: 2026-06-25
title: "Snapshot testing"
description: "Capture program output as reference snapshots with Deno's built-in test runner, compare against them on every run, and update them with deno test --update-snapshots."
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
often enough that maintaining manual assertions becomes a chore. Deno's built-in
test runner provides snapshot testing through the `t.assertSnapshot` method on
the test context, with no imports or dependencies.

## Write your first snapshot test

The test context `t` that Deno passes to each test has an `assertSnapshot`
method. It serializes a value and compares it against a reference snapshot
stored alongside your test file, using the test name to key the snapshot:

```ts title="example_test.ts"
Deno.test("isSnapshotMatch", async (t) => {
  const a = {
    hello: "world!",
    example: 123,
  };
  await t.assertSnapshot(a);
});
```

No snapshot exists yet, so the first run must create one. Snapshots are created
and updated with the `--update-snapshots` flag (short form `-u`):

```bash
deno test --update-snapshots
```

The runner manages the snapshot files itself, so no read or write permission is
needed for snapshots in the default location. Once the snapshot exists, run the
test normally; it passes if the serialized value still matches, or fails with an
`AssertionError` showing a diff if it does not:

```bash
deno test
```

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
deno test --update-snapshots
```

Any snapshot that does not match the current output is rewritten, any missing
snapshot is created, and snapshots that already match are left untouched. The
run summary reports how many snapshots were updated or removed.

After updating, inspect the diff of the `.snap` files with `git diff` before
committing. The update command happily records bugs as the new expected output,
so the human review of that diff is what gives snapshot tests their value.

To try the full loop with the example above: change `hello: "world!"` to
`hello: "everyone!"`, run `deno test`, and watch the test fail with a diff. Then
run `deno test --update-snapshots` and the snapshot file is rewritten to match.

## Verify snapshots in CI

In CI you want to verify snapshots, never update them, so run the tests without
`--update-snapshots`:

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
        run: deno test
```

If a pull request changes output, the CI run fails and the author must update
the snapshots locally and commit the new `.snap` files. Reviewers then see the
exact before-and-after output in the pull request diff and can confirm the
change is intentional.

## Control serialization and snapshot location

`t.assertSnapshot` accepts an options object as its second argument for cases
where the defaults do not fit:

```ts title="serializer_test.ts"
import { stripAnsiCode } from "jsr:@std/fmt/colors";

Deno.test("Custom Serializer", async (t) => {
  const output = "\x1b[34mHello World!\x1b[39m";
  await t.assertSnapshot(output, {
    serializer: (actual) => stripAnsiCode(actual),
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
  relative to the test file. A custom location requires read and write
  permission.
- `mode`: force `"assert"` or `"update"` behavior for a single call, regardless
  of the `--update-snapshots` flag.

Classes can customize their own serialization by implementing
`Symbol.for("Deno.customInspect")`, since the default serializer is built on
[`Deno.inspect`](/api/deno/~/Deno.inspect).

## Snapshots with node:test

If you write tests with [`node:test`](/runtime/reference/cli/test/) instead of
[`Deno.test`](/api/deno/~/Deno.test), its own snapshot assertion is available
too. `t.assert.fileSnapshot` serializes a value, writes it to a named file the
first time, and compares against that file on later runs:

```ts title="node_snapshot_test.ts"
import { test } from "node:test";

test("matches the saved output", (t) => {
  t.assert.fileSnapshot({ id: 1, name: "ada" }, "./__snapshots__/user.json");
});
```

See the
[Node.js test runner docs](https://nodejs.org/api/test.html#snapshot-testing)
for the full snapshot API.

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
