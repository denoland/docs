# `deno doc`, documentation generator

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
being generated. `deno doc` will point out three kinds of problems:

1. Error for an exported type from the root module referencing a non-exported
   type.
   - Ensures API consumers have access to all the types the API uses. This can
     be suppressed by exporting the type from a root module (one of the files
     specified to `deno doc` on the command line) or by marking the type with an
     `@internal` jsdoc tag.
1. Error for missing return type or property type on a **public** type.
   - Ensures `deno doc` displays the return/property type and helps improve type
     checking performance.
1. Error for missing JS doc comment on a **public** type.
   - Ensures the code is documented. Can be suppressed by adding a jsdoc
     comment, or via an `@ignore` jsdoc tag to exclude it from the
     documentation. Alternatively, add an `@internal` tag to keep it in the
     docs, but signify it's internal.

For example:

```ts title="/mod.ts"
interface Person {
  name: string;
  // ...
}

export function getName(person: Person) {
  return person.name;
}
```

```shell
$ deno doc --lint mod.ts
Type 'getName' references type 'Person' which is not exported from a root module.
Missing JS documentation comment.
Missing return type.
    at file:///mod.ts:6:1
```

These lints are meant to help you write better documentation and speed up
type-checking in your projects. If any problems are found, the program exits
with non-zero exit code and the output is reported to standard error.

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
