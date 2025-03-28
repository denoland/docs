---
title: "Snapshot testing"
description: "Learn how to use snapshot testing in Deno to compare outputs against recorded references, making it easier to detect unintended changes in your code"
url: "/examples/snapshot_tutorial"
---

Snapshot testing is a testing technique that captures the output of your code
and compares it against a stored reference version. Rather than manually writing
assertions for each property, you let the test runner record the entire output
structure, making it easier to detect any unexpected changes.

The [Deno Standard Library](/runtime/fundamentals/standard_library/) has a
[snapshot module](https://jsr.io/@std/testing/doc/snapshot), which enables
developers to write tests which assert a value against a reference snapshot.
This reference snapshot is a serialized representation of the original value and
is stored alongside the test file.

## Basic usage

The `assertSnapshot` function will create a snapshot of a value and compare it
to a reference snapshot, which is stored alongside the test file in the
`__snapshots__` directory.

To create an initial snapshot (or to update an existing snapshot), use the
`-- --update` flag with the `deno test` command.

### Basic snapshot example

The below example shows how to use the snapshot library with the `Deno.test`
API. We can test a snapshot of a basic object, containing string and number
properties.

The `assertSnapshot(t, a)` function compares the object against a stored
snapshot. The `t` parameter is the test context that Deno provides, which the
snapshot function uses to determine the test name and location for storing
snapshots.

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a);
});
```

You will need to grant read and write file permissions in order for Deno to
write a snapshot file and then read it to test the assertion. If it is the first
time you are running the test a do not already have a snapshot, add the
`--update` flag:

```bash
deno test --allow-read --allow-write -- --update
```

If you already have a snapshot file, you can run the test with:

```bash
deno test --allow-read
```

The test will compare the current output of the object against the stored
snapshot. If they match, the test passes; if they differ, the test fails.

The snapshot file will look like this:

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

You can edit your test to change the `hello` string to `"everyone!"` and run the
test again with `deno test --allow-read`. This time the `assertSnapshot`
function will throw an `AssertionError`, causing the test to fail because the
snapshot created during the test does not match the one in the snapshot file.

## Updating snapshots

When adding new snapshot assertions to your test suite, or when intentionally
making changes which cause your snapshots to fail, you can update your snapshots
by running the snapshot tests in update mode. Tests can be run in update mode by
passing the `--update` or `-u` flag as an argument when running the test. When
this flag is passed, then any snapshots which do not match will be updated.

```bash
deno test --allow-read --allow-write -- --update
```

:::note

New snapshots will only be created when the `--update` flag is present.

:::

## Permissions

When running snapshot tests, the `--allow-read` permission must be enabled, or
else any calls to `assertSnapshot` will fail due to insufficient permissions.
Additionally, when updating snapshots, the `--allow-write` permission must be
enabled, as this is required in order to update snapshot files.

The assertSnapshot function will only attempt to read from and write to snapshot
files. As such, the allow list for `--allow-read` and `--allow-write` can be
limited to only include existing snapshot files, if desired.

## Version Control

Snapshot testing works best when changes to snapshot files are committed
alongside other code changes. This allows for changes to reference snapshots to
be reviewed along side the code changes that caused them, and ensures that when
others pull your changes, their tests will pass without needing to update
snapshots locally.

## Options

The `assertSnapshot` function can be called with an `options` object which
offers greater flexibility and enables some non standard use cases:

```ts
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {/*custom options go here*/});
});
```

### serializer

When you run a test with `assertSnapshot`, the data you're testing needs to be
converted to a string format that can be written to the snapshot file (when
creating or updating snapshots) and compared with the existing snapshot (when
validating), this is called serialization.

The `serializer` option allows you to provide a custom serializer function. This
custom function will be called by `assertSnapshot` and be passed the value being
asserted. Your custom function must:

1. Return a `string`
2. Be deterministic, (it will always produce the same output, given the same
   input).

The code below shows a practical example of creating and using a custom
serializer function for snapshot testing. This serialiser removes any ANSI
colour codes from a string using the
[`stripColour`](https://jsr.io/@std/fmt/doc/colors) string formatter from the
Deno Standard Library.

```ts title="example_test.ts"
import { assertSnapshot, serialize } from "jsr:@std/testing/snapshot";
import { stripColor } from "jsr:@std/fmt/colors";

/**
 * Serializes `actual` and removes ANSI escape codes.
 */
function customSerializer(actual: string) {
  return serialize(stripColor(actual));
}

Deno.test("Custom Serializer", async function (t): Promise<void> {
  const output = "\x1b[34mHello World!\x1b[39m";
  await assertSnapshot(t, output, {
    serializer: customSerializer,
  });
});
```

```ts title="__snapshots__/example_test.ts.snap"
snapshot = {};

snapshot[`Custom Serializer 1`] = `"Hello World!"`;
```

Custom serializers can be useful in a variety of scenarios:

- To remove irrelevant formatting (like ANSI codes shown above) and improve
  legibility
- To handle non-deterministic data. Timestamps, UUIDs, or random values can be
  replaced with placeholders
- To mask or remove sensitive data that shouldn't be saved in snapshots
- Custom formatting to present complex objects in a domain-specific format

### Serialization with `Deno.customInspect`

Because the default serializer uses `Deno.inspect` under the hood, you can set
the property `Symbol.for("Deno.customInspect")` to a custom serialization
function if desired:

```ts title="example_test.ts"
// example_test.ts
import { assertSnapshot } from "https://deno.land/std@0.145.0/testing/snapshot.ts";

class HTMLTag {
  constructor(
    public name: string,
    public children: Array<HTMLTag | string> = [],
  ) {}

  public render(depth: number) {
    const indent = "  ".repeat(depth);
    let output = `${indent}<${this.name}>\n`;
    for (const child of this.children) {
      if (child instanceof HTMLTag) {
        output += `${child.render(depth + 1)}\n`;
      } else {
        output += `${indent}  ${child}\n`;
      }
    }
    output += `${indent}</${this.name}>`;
    return output;
  }

  public [Symbol.for("Deno.customInspect")]() {
    return this.render(0);
  }
}

Deno.test("Page HTML Tree", async (t) => {
  const page = new HTMLTag("html", [
    new HTMLTag("head", [
      new HTMLTag("title", [
        "Simple SSR Example",
      ]),
    ]),
    new HTMLTag("body", [
      new HTMLTag("h1", [
        "Simple SSR Example",
      ]),
      new HTMLTag("p", [
        "This is an example of how Deno.customInspect could be used to snapshot an intermediate SSR representation",
      ]),
    ]),
  ]);

  await assertSnapshot(t, page);
});
```

This test will produce the following snapshot.

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Page HTML Tree 1`] = `
<html>
  <head>
    <title>
      Simple SSR Example
    </title>
  </head>
  <body>
    <h1>
      Simple SSR Example
    </h1>
    <p>
      This is an example of how Deno.customInspect could be used to snapshot an intermediate SSR representation
    </p>
  </body>
</html>
`;
```

In contrast, when we remove the `Deno.customInspect` method, the test will
produce the following snapshot:

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Page HTML Tree 1`] = `HTMLTag {
  children: [
    HTMLTag {
      children: [
        HTMLTag {
          children: [
            "Simple SSR Example",
          ],
          name: "title",
        },
      ],
      name: "head",
    },
    HTMLTag {
      children: [
        HTMLTag {
          children: [
            "Simple SSR Example",
          ],
          name: "h1",
        },
        HTMLTag {
          children: [
            "This is an example of how Deno.customInspect could be used to snapshot an intermediate SSR representation",
          ],
          name: "p",
        },
      ],
      name: "body",
    },
  ],
  name: "html",
}`;
```

You can see that this second snapshot is much less readable. This is because:

1. The keys are sorted alphabetically, so the name of the element is displayed
   after its children
2. It includes a lot of extra information, causing the snapshot to be more than
   twice as long
3. It is not an accurate serialization of the HTML which the data represents

Note that in this example it would be possible to achieve the same result by
calling:

```ts
await assertSnapshot(t, page.render(0));
```

However, depending on the public API you choose to expose, this may not be
practical.

It is also worth considering that this could have an impact beyond your snapshot
testing. For example, `Deno.customInspect` is also used to serialize objects
when calling `console.log` (and in some other cases). This may or may not be
desirable.

### `dir` and `path`

The `dir` and `path` options allow you to control where the snapshot file will
be saved to and read from. These can be absolute paths or relative paths. If
relative, they will be resolved relative to the test file.

For example, if your test file is located at `/path/to/test.ts` and the `dir`
option is set to `snapshots`, then the snapshot file would be written to
`/path/to/snapshots/test.ts.snap`.

- `dir` allows you to specify the snapshot directory, while still using the
  default format for the snapshot file name.

- `path` allows you to specify the directory and file name of the snapshot file.

If your test file is located at `/path/to/test.ts` and the `path` option is set
to `snapshots/test.snapshot`, then the snapshot file would be written to
`/path/to/snapshots/test.snapshot`.

:::note

If both `dir` and `path` are specified, the `dir` option will be ignored and the
`path` option will be handled as normal.

:::

### `mode`

The `mode` option controls how `assertSnapshot` behaves regardless of command
line flags and has two settings, `assert` or `update`:

- `assert`: Always performs comparison only, ignoring any `--update` or `-u`
  flags. If snapshots don't match, the test will fail with an `AssertionError`.

- `update`: Always updates snapshots. Any mismatched snapshots will be updated
  after tests complete.

This option is useful when you need different snapshot behaviors within the same
test suite:

```ts
// Create a new snapshot or verify an existing one
await assertSnapshot(t, stableComponent);

// Always update this snapshot regardless of command line flags
await assertSnapshot(t, experimentalComponent, {
  mode: "update",
  name: "experimental feature",
});

// Always verify but never update this snapshot regardless of command line flags
await assertSnapshot(t, criticalComponent, {
  mode: "assert",
  name: "critical feature",
});
```

### `name`

The name of the snapshot. If unspecified, the name of the test step will be used
instead.

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:@std/testing/snapshot";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {
    name: "Test Name",
  });
});
```

```ts title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Test Name 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

When `assertSnapshot` is run multiple times with the same value for name, then
the suffix will be incremented as normal. i.e. `Test Name 1`, `Test Name 2`,
`Test Name 3`, etc.

### `msg`

Used to set a custom error message. This will overwrite the default error
message, which includes the diff for failed snapshots:

```ts
Deno.test("custom error message example", async function (t): Promise<void> {
  const userData = {
    name: "John Doe",
    role: "admin",
  };

  await assertSnapshot(t, userData, {
    msg:
      "User data structure has changed unexpectedly. Please verify your changes are intentional.",
  });
});
```

When the snapshot fails, instead of seeing the default diff message, you'll see
your custom error message.

## Testing Different Data Types

Snapshot testing works with various data types and structures:

```ts
Deno.test("snapshot various types", async function (t): Promise<void> {
  // Arrays
  await assertSnapshot(t, [1, 2, 3, "four", { five: true }]);

  // Complex objects
  await assertSnapshot(t, {
    user: { name: "Test", roles: ["admin", "user"] },
    settings: new Map([["theme", "dark"], ["language", "en"]]),
  });

  // Error objects
  await assertSnapshot(t, new Error("Test error message"));
});
```

## Working with Asynchronous Code

When testing asynchronous functions, ensure you await the results before passing
them to the snapshot:

```ts
Deno.test("async function test", async function (t): Promise<void> {
  const fetchData = async () => {
    // Simulate API call
    return { success: true, data: ["item1", "item2"] };
  };

  const result = await fetchData();
  await assertSnapshot(t, result);
});
```

## Best Practices

### Keep Snapshots Concise

Avoid capturing large data structures that aren't necessary for your test. Focus
on capturing only what's relevant.

### Descriptive Test Names

Use descriptive test names that clearly indicate what's being tested:

```ts
Deno.test(
  "renders user profile card with all required fields",
  async function (t): Promise<void> {
    // ... test code
    await assertSnapshot(t, component);
  },
);
```

### Review Snapshots During Code Reviews

Always review snapshot changes during code reviews to ensure they represent
intentional changes and not regressions.

### Snapshot Organization

For larger projects, consider organizing snapshots by feature or component:

```ts
await assertSnapshot(t, component, {
  path: `__snapshots__/components/${componentName}.snap`,
});
```

## Snapshot Testing in CI/CD

### GitHub Actions Example

When running snapshot tests in CI environments, you'll typically want to verify
existing snapshots rather than updating them:

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v1
      - name: Run tests
        run: deno test --allow-read
```

For pull requests that intentionally update snapshots, reviewers should verify
the changes are expected before merging.

## Practical Examples

### Testing HTML Output

HTML output testing with snapshots is particularly useful for web applications
where you want to ensure your components render the expected markup. This
approach allows you to catch unintended changes in your HTML structure,
attributes, or content that might affect the visual appearance or functionality
of your UI components.

By capturing a snapshot of the HTML output, you can:

- Verify that UI components render correctly with different props/data
- Detect regressions when refactoring rendering logic
- Document the expected output format of components

```ts
Deno.test("HTML rendering", async function (t): Promise<void> {
  const renderComponent = () => {
    return `<div class="card">
      <h2>User Profile</h2>
      <p>Username: testuser</p>
    </div>`;
  };

  await assertSnapshot(t, renderComponent());
});
```

### Testing API Responses

When building applications that interact with APIs, snapshot testing helps
ensure that the structure and format of API responses remain consistent. This is
particularly valuable for:

- Maintaining backward compatibility when updating API integrations
- Verifying that your API response parsing logic works correctly
- Documenting the expected shape of API responses for team collaboration
- Detecting unexpected changes in API responses that could break your
  application

```ts
Deno.test("API response format", async function (t): Promise<void> {
  const mockApiResponse = {
    status: 200,
    data: {
      users: [
        { id: 1, name: "User 1" },
        { id: 2, name: "User 2" },
      ],
      pagination: { page: 1, total: 10 },
    },
  };

  await assertSnapshot(t, mockApiResponse);
});
```

🦕 Snapshot testing is a powerful technique that complements traditional unit
tests by allowing you to capture and verify complex outputs without writing
detailed assertions. By incorporating snapshot tests into your testing strategy,
you can catch unintended changes, document expected behavior, and build more
resilient applications.
