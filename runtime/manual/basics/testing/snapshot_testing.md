# Snapshot Testing

The Deno standard library comes with a
[snapshot module](https://jsr.io/@std/testing/doc/snapshot/~), which enables
developers to write tests which assert a value against a reference snapshot.
This reference snapshot, is a serialized representation of the original value
and is stored alongside the test file.

Snapshot testing can be useful in many cases, as it enables catching a wide
array of bugs with very little code. It is particularly helpful in situations
where it is difficult to precisely express what should be asserted, without
requiring a prohibitive amount of code, or where the assertions a test makes are
expected to change often. It therefore lends itself especially well to use in
the development of front ends and CLIs.

## Basic usage

The `assertSnapshot` function will create a snapshot of a value and compare it
to a reference snapshot, which is stored alongside the test file in the
`__snapshots__` directory.

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:std/testing@^0/snapshot.ts";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a);
});
```

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

Calling `assertSnapshot` in a test will throw an `AssertionError`, causing the
test to fail, if the snapshot created during the test does not match the one in
the snapshot file.

## Creating and updating snapshots

When adding new snapshot assertions to your test suite, or when intentionally
making changes which cause your snapshots to fail, you can update your snapshots
by running the snapshot tests in update mode. Tests can be run in update mode by
passing the `--update` or `-u` flag as an argument when running the test. When
this flag is passed, then any snapshots which do not match will be updated.

```sh
deno test --allow-all -- --update
```

Additionally, new snapshots will only be created when this flag is present.

## Permissions

When running snapshot tests, the `--allow-read` permission must be enabled, or
else any calls to `assertSnapshot` will fail due to insufficient permissions.
Additionally, when updating snapshots, the `--allow-write` permission must also
be enabled, as this is required in order to update snapshot files.

The `assertSnapshot` function will only attempt to read from and write to
snapshot files. As such, the allow list for `--allow-read` and `--allow-write`
can be limited to only include existing snapshot files, if so desired.

## Version Control

Snapshot testing works best when changes to snapshot files are committed
alongside other code changes. This allows for changes to reference snapshots to
be reviewed along side the code changes that caused them, and ensures that when
others pull your changes, their tests will pass without needing to update
snapshots locally.

## Advanced Usage

### Options

The `assertSnapshot` function can also be called with an options object which
offers greater flexibility and enables some non standard use cases.

```ts
import { assertSnapshot } from "jsr:std/testing@^0/snapshot.ts";

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = {
    hello: "world!",
    example: 123,
  };
  await assertSnapshot(t, a, {
    // options
  });
});
```

**`serializer`**

The `serializer` option allows you to provide a custom serializer function. This
will be called by `assertSnapshot` and be passed the value being asserted. It
should return a string. It is important that the serializer function is
deterministic i.e. that it will always produce the same output, given the same
input.

The result of the serializer function will be written to the snapshot file in
update mode, and in assert mode will be compared to the snapshot stored in the
snapshot file.

```ts title="example_test.ts"
import { assertSnapshot, serialize } from "jsr:std/testing@^0/snapshot.ts";
import { stripColor } from "jsr:std/fmt@^0/colors.ts";

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

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Custom Serializer 1`] = `"Hello World!"`;
```

Custom serializers can be useful in a variety of cases. One possible use case is
to discard information which is not relevant and/or to present the serialized
output in a more human readable form.

For example, the above code snippet shows how a custom serializer could be used
to remove ANSI escape codes (which encode font color and styles in CLI
applications), making the snapshot more readable than it would be otherwise.

Other common use cases would be to obfuscate values which are non-deterministic
or which you may not want to write to disk for other reasons. For example,
timestamps or file paths.

Note that the default serializer is exported from the snapshot module so that
its functionality can be easily extended.

**`dir` and `path`**

The `dir` and `path` options allow you to control where the snapshot file will
be saved to and read from. These can be absolute paths or relative paths. If
relative, the they will be resolved relative to the test file.

For example, if your test file is located at `/path/to/test.ts` and the `dir`
option is set to `snapshots`, then the snapshot file would be written to
`/path/to/snapshots/test.ts.snap`.

As shown in the above example, the `dir` option allows you to specify the
snapshot directory, while still using the default format for the snapshot file
name.

In contrast, the `path` option allows you to specify the directory and file name
of the snapshot file.

For example, if your test file is located at `/path/to/test.ts` and the `path`
option is set to `snapshots/test.snapshot`, then the snapshot file would be
written to `/path/to/snapshots/test.snapshot`.

If both `dir` and `path` are specified, the `dir` option will be ignored and the
`path` option will be handled as normal.

**`mode`**

The `mode` option can be either `assert` or `update`. When set, the `--update`
and `-u` flags will be ignored.

If the `mode` option is set to `assert`, then `assertSnapshot` will always
behave as though the update flag is not passed i.e. if the snapshot does not
match the one saved in the snapshot file, then an `AssertionError` will be
thrown.

If the `mode` option is set to `update`, then `assertSnapshot` will always
behave as though the update flag has been passed i.e. if the snapshot does not
match the one saved in the snapshot file, then the snapshot will be updated
after all tests have run.

**`name`**

The `name` option specifies the name of the snapshot. By default, the name of
the test step will be used. However, if specified, the `name` option will be
used instead.

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:std/testing@^0/snapshot.ts";

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

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Test Name 1`] = `
{
  example: 123,
  hello: "world!",
}
`;
```

When `assertSnapshot` is run multiple times with the same value for `name`, then
the suffix will be incremented as normal. i.e. `Test Name 1`, `Test Name 2`,
`Test Name 3`, etc.

**`msg`**

Allows setting a custom error message to use. This will overwrite the default
error message, which includes the diff for failed snapshots.

### Default Options

You can configure default options for `assertSnapshot`.

```ts title="example_test.ts"
import { createAssertSnapshot } from "jsr:std/testing@^0/snapshot.ts";

const assertSnapshot = createAssertSnapshot({
  // options
});
```

When configuring default options like this, the resulting `assertSnapshot`
function will function the same as the default function exported from the
snapshot module. If passed an optional options object, this will take precedence
over the default options, where the value provided for an option differs.

It is possible to "extend" an `assertSnapshot` function which has been
configured with default options.

```ts title="example_test.ts"
import { createAssertSnapshot } from "jsr:std/testing@^0/snapshot.ts";
import { stripColor } from "jsr:std/fmt@^0/colors.ts";

const assertSnapshot = createAssertSnapshot({
  dir: ".snaps",
});

const assertMonochromeSnapshot = createAssertSnapshot<string>(
  { serializer: stripColor },
  assertSnapshot,
);

Deno.test("isSnapshotMatch", async function (t): Promise<void> {
  const a = "\x1b[32mThis green text has had it's colours stripped\x1b[39m";
  await assertMonochromeSnapshot(t, a);
});
```

```js title=".snaps/example_test.ts.snap"
export const snapshot = {};

snapshot[`isSnapshotMatch 1`] = `This green text has had it's colours stripped`;
```

### Serialization with `Deno.customInspect`

The default serialization behaviour can be customised in two ways. The first is
by specifying the `serializer` option. This allows you to control the
serialisation of any value which is passed to a specific `assertSnapshot` call.
See the [above documentation](#options) on the correct usage of this option.

The second option is to make use of `Deno.customInspect`. Because the default
serializer used by `assertSnapshot` uses `Deno.inspect` under the hood, you can
set property `Symbol.for("Deno.customInspect")` to a custom serialization
function.

Doing so will ensure that the custom serialization will, by default, be used
whenever the object is passed to `assertSnapshot`. This can be useful in many
cases. One example is shown in the code snippet below.

```ts title="example_test.ts"
import { assertSnapshot } from "jsr:std/testing@^0/snapshot.ts";

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
        "Ex of customInspect for a snapshot of an SSR representation",
      ]),
    ]),
  ]);

  await assertSnapshot(t, page);
});
```

This test will produce the following snapshot.

```js title="__snapshots__/example_test.ts.snap"
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
      Ex of customInspect for a snapshot of an SSR representation
    </p>
  </body>
</html>
`;
```

In contrast, when we remove the `Deno.customInspect` method, the test will
produce the following snapshot.

```js title="__snapshots__/example_test.ts.snap"
export const snapshot = {};

snapshot[`Page HTML Tree 1`] = `
HTMLTag {
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
            "Ex of customInspect for a snapshot of an SSR representation",
          ],
          name: "p",
        },
      ],
      name: "body",
    },
  ],
  name: "html",
}
`;
```

You can see that this snapshot is much less readable. This is because:

1. The keys are sorted alphabetically, so the name of the element is displayed
   after its children
2. It includes a lot of extra information, causing the snapshot to be more than
   twice as long
3. It is not an accurate serialization of the HTML which the data represents

Note that in this example it would be entirely possible to achieve the same
result by calling:

```ts
await assertSnapshot(t, page.render(0));
```

However, depending on the public API you choose to expose, this may not be
practical in other cases.

It is also worth considering that this will have an impact beyond just snapshot
testing. For example, `Deno.customInspect` is also used to serialize objects
when calling `console.log` and in some other cases. This may or may not be
desirable.
