---
title: "Standard Library"
oldUrl: /runtime/manual/basics/standard_library/
---

Deno provides a standard library written in TypeScript. It is a set of standard
modules that can be reused by programs, allowing you to focus on your
application logic rather than "reinventing the wheel" for common tasks. All of
the modules in the Deno Standard Library are audited by the core team and are
guaranteed to work with Deno, ensuring consistency and reliability.

Many packages in the Deno Standard Library are also compatible with Node.js,
Cloudflare Workers, and other JavaScript environments. This allows you to write
code that can be run in multiple environments without modification.

The standard library is hosted on JSR and is available at: https://jsr.io/@std.
Packages are documented, tested, and include usage examples. You can browse the
full list of standard library packages on JSR, but here are a few examples:

- [@std/path](https://jsr.io/@std/path): Path manipulation utilities, akin to
  Node.js's `path` module.
- [@std/jsonc](https://jsr.io/@std/jsonc): (De)serialization of JSON with
  comments
- [@std/encoding](https://jsr.io/@std/encoding): Utilities for encoding and
  decoding common formats like hex, base64, and varint

## Versioning and stability

Each package of the standard library is independently versioned. Packages follow
[semantic versioning rules](https://jsr.io/@std/semver). You can use
[version pinning or version ranges](./modules#package-versions) to prevent major
releases from affecting your code.

## Importing standard library modules

To install packages from the Deno Standard Library, you can use the `deno add`
subcommand to add the package to your `deno.json` import map.

```sh
deno add jsr:@std/fs jsr:@std/path
```

The `deno.json` `imports` field will be updated to include those imports:

```json
{
  "imports": {
    "@std/fs": "jsr:@std/fs@^1.0.2",
    "@std/path": "jsr:@std/path@^1.0.3"
  }
}
```

You can then import these packages in your source code:

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```

Alternatively, you can import modules directly with the `jsr:` specifier:

```js
import { copy } from "jsr:@std/fs@^1.0.2";
import { join } from "jsr:@std/path@^1.0.3";

await copy("foo.txt", join("dist", "foo.txt"));
```

## Node.js compatibility

The Deno Standard Library is designed to be compatible with Node.js, Cloudflare
Workers, and other JavaScript environments. The standard library is written in
TypeScript and compiled to JavaScript, so it can be used in any JavaScript
environment.

```sh
npx jsr add @std/fs @std/path
```

Running this command will add those packages to your `package.json`:

```json
{
  "dependencies": {
    "@std/fs": "npm:@jsr/std__fs@^1.0.2",
    "@std/path": "npm:@jsr/std__path@^1.0.3"
  }
}
```

Then you can import them in your source code, just like you would with any other
Node.js package. TypeScript will automatically find the type definitions for
these packages.

```ts
import { copy } from "@std/fs";
import { join } from "@std/path";

await copy("foo.txt", join("dist", "foo.txt"));
```
