---
title: "Standard Library"
oldUrl: /runtime/manual/basics/standard_library/
---

Deno provides a standard library, a set of standard modules that can be reused
by programs, allowing you to focus on your application logic rather than
"reinventing the wheel" for common tasks. All of the modules in the Deno
standard library are audited by the core team and are guaranteed to work with
Deno, ensuring consistency and reliability.

The standard library is hosted on JSR and is available at: https://jsr.io/@std.
Packages are documented, tested, and include usage examples.

## Versioning and stability

Each package of the standard library is independently versioned. Packages follow
[semantic versioning rules](https://jsr.io/@std/semver). You can use version
pinning or version ranges to prevent breaking changes.

## Importing standard library modules

To install packages from the Deno Standard library, you can use the `deno add`
subcommand to add the package to your `deno.json` import map.

```sh
deno add @std/fs @std/path
```

Your updates your deno.json import map will be updated to include those imports:

```json
{
  "imports": {
    "@std/fs": "jsr:@std/fs@^0.224.0",
    "@std/path": "jsr:@std/path@^0.224.0"
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
import { copy } from "jsr:@std/fs@^0.224.0";
import { join } from "jsr:@std/path@^0.224.0";

await copy("foo.txt", join("dist", "foo.txt"));
```

## Node.js compatibility

The Deno standard library is designed to be compatible with Node.js, Cloudflare
Workers, and other JavaScript environments. The standard library is written in
TypeScript and compiled to JavaScript, so it can be used in any JavaScript
environment.

```sh
npx jsr add @std/fs @std/path
```

Will add those packages to your `package.json`:

```json
{
  "dependencies": {
    "@std/fs": "npm:@jsr/std__fs@^1.0.2",
    "@std/path": "npm:@jsr/std__path@^1.0.3"
  }
}
```

Then you can import them in your source code above.
