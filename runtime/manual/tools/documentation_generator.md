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

You can use `--lint` flag to check for problems in your documentation.
`deno doc` will point out missing JSDoc comments and return types for public
APIs.

```js
// multiply.ts
export function multiply(a: number, b: number) {
  return a * b;
}
```

```shell
$ deno doc --lint multiply.ts
Missing JS documentation comment.
Missing return type.
    at file:///multiply.ts:1:1

error: Found 2 documentation diagnostics.
```

These lints are meant to help you write better documentation and speed up
type-checking in your projects. If any problems are found, the program exits
with non-zero exit code and the output is reported to the standard error.

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
