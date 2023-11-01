# Documentation Generator

`deno doc` followed by a list of one or more source files will print the JSDoc
documentation for each of the module's **exported** members.

For example, given a file `add.ts` with the contents:

```ts
/**
 * Adds x and y.
 * @param {number} x
 * @param {number} y
 * @returns {number} Sum of x and y
 */
export function add(x: number, y: number): number {
  return x + y;
}
```

Running the Deno `doc` command, prints the function's JSDoc comment to `stdout`:

```shell
deno doc add.ts
function add(x: number, y: number): number
  Adds x and y. @param {number} x @param {number} y @returns {number} Sum of x and y
```

## Linting

You can use `--lint` flag to check for problems in your documentation while it's
being generated. `deno doc` will point out missing JSDoc comments, missing types
for public APIs, and usages of non-exported types from root modules (the files
specified on the command line).

```ts
// mod.ts
export function multiply(a: number, b: number) {
  return a * b;
}
```

```shell
$ deno doc --lint mod.ts
Missing JS documentation comment.
Missing return type.
    at file:///mod.ts:1:1

error: Found 2 documentation diagnostics.
```

These lints are meant to help you write better documentation and speed up
type-checking in your projects. If any problems are found, the program exits
with non-zero exit code and the output is reported to the standard error.

### Non-exported type referenced in exported type lint

The `--lint` flag will error when you use a non-exported type in an exported
type.

```ts
// mod.ts
type PersonName = string;

/** A person. */
export interface Person {
  /** Name of a person. */
  name: PersonName;
}
```

```shell
$ deno doc --lint mod.ts
Type 'Person' references type 'PersonName' which is not exported from a root module.
    at file:///mod.ts:3:1

error: Found 1 documentation diagnostic.
```

The recommended fix is to export the `PersonName` type from the module so API
consumers also have access to it. If you really don't want to do that, mark the
non-exported type as `@internal` and the error will be suppressed:

```ts
/** @internal */
type PersonName = string;
```

## HTML output

Use the `--html` flag to generate a static site with documentation.

```
$ deno doc --html --name="My library" ./mod.ts

$ deno doc --html --name="My library" --output=./documentation/ ./mod.ts

$ deno doc --html --name="My library" ./sub1/mod.ts ./sub2/mod.ts
```

The generated documentation is a static site with multiple pages that can be
deployed to any static site hosting service.

A client-side search is included in the generated site, but is not available if
user's browser has JavaScript disabled.

## JSON output

Use the `--json` flag to output the documentation in JSON format. This JSON
format is consumed by the
[deno doc website](https://github.com/denoland/docland) and is used to generate
module documentation.
