---
title: "Use local and unpublished packages"
description: "Work with code that isn't on a registry: link a local package copy with the links field, import straight from HTTPS URLs including private GitHub repos, and know which specifiers Deno does not support."
url: /examples/local_unpublished_packages_tutorial/
---

Not every dependency lives on JSR or npm. Deno has two supported ways to use
code that isn't published anywhere: the `links` field for local directories, and
plain HTTPS imports for code reachable by URL.

## Link a local package with `links`

The `links` field in `deno.json` plays the role of `npm link` in Node.js: it
overrides a dependency with a local directory during development. Given a local
package with a `name`, `version`, and `exports`:

```json title="greeter/deno.json"
{
  "name": "@acme/greeter",
  "version": "0.1.0",
  "exports": "./mod.ts"
}
```

```ts title="greeter/mod.ts"
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

Point your application at it with `links`, and import it like a registry
package:

```json title="my-app/deno.json"
{
  "links": ["../greeter"],
  "imports": {
    "@acme/greeter": "jsr:@acme/greeter@^0.1.0"
  }
}
```

```ts title="my-app/main.ts"
import { greet } from "@acme/greeter";

console.log(greet("local package"));
```

```sh
$ deno run main.ts
Hello, local package!
```

The linked directory is used instead of the registry; the package doesn't even
have to be published. Edits in `greeter/` are picked up directly.

:::note

`links` is only respected in the workspace root. Linking npm packages also
works, but requires a `node_modules` directory and the package name must exist
in the npm registry.

:::

## Import straight from an HTTPS URL

Any module reachable over HTTPS can be imported directly, including raw files
from a GitHub repository:

```ts title="main.ts"
import { equal } from "https://raw.githubusercontent.com/denoland/std/cdf74a86680beb4ef74c95e0fd5d71c5d7841eb9/assert/equal.ts";

console.log(equal([1, 2], [1, 2]));
```

```sh
$ deno run main.ts
Download https://raw.githubusercontent.com/denoland/std/cdf74a86680beb4ef74c95e0fd5d71c5d7841eb9/assert/equal.ts
true
```

Pin the URL to a tag or commit hash rather than a branch, so the code can't
change underneath you.

For private repositories, set `DENO_AUTH_TOKENS` to a personal access token
scoped to the host, e.g.
`DENO_AUTH_TOKENS=a1b2c3d4e5f6@raw.githubusercontent.com`; see
[Private repositories](/runtime/packages/private_repositories/) for details.

:::caution

Only import over HTTPS from sources you trust, and prefer a registry for
anything beyond small projects. HTTPS imports are not supported by
`deno add`/`deno install`.

:::

## What is not supported

Deno does not support git dependency specifiers (`git+https:`/`git+ssh:`) or
tarball URL dependencies in `package.json`. Additionally, since Deno 2.8,
`file:` and `link:` entries in `package.json` dependencies are silently skipped
during npm resolution: they neither work nor error.

The supported alternatives are:

- the [`links` field](/runtime/packages/#overriding-local-packages) for local
  directories
- HTTPS imports for code hosted in a (possibly private) git repository
- [vendoring](/runtime/packages/#vendoring-remote-modules) remote modules you
  need to patch or build offline
- publishing the package to [JSR](https://jsr.io) or npm

For lockfiles, version ranges, and everything else about dependencies, see
[the packages documentation](/runtime/packages/).
