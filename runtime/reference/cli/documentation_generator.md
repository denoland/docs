---
title: "`deno doc`, documentation generator"
oldUrl: /runtime/manual/tools/documentation_generator/
command: doc
---

## Examples

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

## Supported JSDoc tags

Deno implements a large set of JSDoc tags, but also additional tags that are not
specified in the JSDoc specification. The following tags are supported:

- [`constructor`/`class`](https://jsdoc.app/tags-class): mark a function to be a
  constructor.
- [`ignore`](https://jsdoc.app/tags-ignore): ignore a symbol to be included in
  the output.
- internal: mark a symbol to be used only for internal. In the HTML generator,
  the symbol will not get a listed entry, however it will still be generated and
  can be reached if a non-internal symbol links to it.
- [`public`](https://jsdoc.app/tags-public): treat a symbol as public API.
  Equivalent of TypeScript `public` keyword.
- [`private`](https://jsdoc.app/tags-private): treat a symbol as private API.
  Equivalent of TypeScript `private` keyword.
- [`protected`](https://jsdoc.app/tags-protected): treat a property or method as
  protected API. Equivalent of TypeScript `protected` keyword.
- [`readonly`](https://jsdoc.app/tags-readonly): mark a symbol to be readonly,
  meaning that it cannot be overwritten.
- [`experimental`](https://tsdoc.org/pages/tags/experimental): mark a symbol as
  experimental, meaning that the API might change or be removed, or behaviour is
  not well-defined.
- [`deprecated`](https://jsdoc.app/tags-deprecated): mark a symbol as
  deprecated, meaning that it is not supported anymore and might be removed in a
  future version.
- [`module`](https://jsdoc.app/tags-module): this tag can be defined on a
  top-level JSDoc comment, which will treat that comment to be for the file
  instead of the subsequent symbol.
- `category`/`group`: mark a symbol to be of a specific category/group. This is
  useful for grouping together various symbols together.
- [`see`](https://jsdoc.app/tags-see): define an external reference related to
  the symbol.
- [`example`](https://jsdoc.app/tags-example): define an example for the symbol.
- `tags`: define additional custom labels for a symbol, via a comma separated
  list.
- [`since`](https://jsdoc.app/tags-since): define since when the symbol has been
  available.
- [`callback`](https://jsdoc.app/tags-callback): define a callback.
- [`template`/`typeparam`/`typeParam`](https://tsdoc.org/pages/tags/typeparam):
  define a callback.
- [`prop`/`property`](https://jsdoc.app/tags-property): define a property on a
  symbol.
- [`typedef`](https://jsdoc.app/tags-typedef): define a type.
- [`param`/`arg`/`argument`](https://jsdoc.app/tags-param): define a parameter
  on a function.
- [`return`/`returns`](https://jsdoc.app/tags-returns): define the return type
  and/or comment of a function.
- [`throws`/`exception`](https://jsdoc.app/tags-throws): define what a function
  throws when called.
- [`enum`](https://jsdoc.app/tags-enum): define an object to be an enum.
- [`extends`/`augments`](https://jsdoc.app/tags-augments): define a type that a
  function extends on.
- [`this`](https://jsdoc.app/tags-this): define what the `this` keyword refers
  to in a function.
- [`type`](https://jsdoc.app/tags-type): define the type of a symbol.
- [`default`](https://jsdoc.app/tags-default): define the default value for a
  variable, property or field.

## HTML output

Use the `--html` flag to generate a static site with documentation.

```console
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
