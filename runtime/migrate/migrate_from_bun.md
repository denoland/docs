---
title: "Migrating from Bun"
description: "How to move a Bun project to Deno: run your package.json scripts unchanged, map Bun CLI commands to Deno, and replace Bun-specific APIs with Deno and Node built-ins."
---

Most Bun projects are standard `package.json` and TypeScript projects, and Deno
runs those directly. Deno reads your `package.json`, installs the same npm
dependencies, runs TypeScript without a build step, and ships a comparable
built-in toolchain: a test runner, formatter, linter, bundler, and compiler in
one binary.

What needs attention is anything that uses Bun-specific APIs (`Bun.serve`,
`bun:sqlite`, `Bun.file`, the `$` shell). Each has a close equivalent in Deno or
in the Node built-ins Deno supports, covered below. Code that imports nothing
from `bun` or `bun:*` usually runs unchanged.

## Run your project

Install dependencies and run your entrypoint:

```sh
cd my-bun-app
deno install
deno run main.ts
```

`deno install` reads your existing `package.json` and resolves the same npm
packages, like `bun install`. Scripts defined in `package.json` run with
[`deno task`](/runtime/reference/cli/task/), the equivalent of `bun run`:

```sh
deno task start
```

The one behavioral difference you will hit immediately: **Deno is sandboxed by
default**. Where Bun runs your code with full access to the network, file
system, and environment, Deno prompts for each permission the first time the
program needs it. You can grant everything up front with `deno run -A main.ts`
to match Bun's behavior, then tighten the flags later. See
[Security and permissions](/runtime/fundamentals/security/) and the
[permission flags reference](/runtime/reference/permissions/).

Like Bun, Deno lets you skip the subcommand for files: `deno main.ts` works the
same as `deno run main.ts`.

## Bun to Deno cheatsheet

Each command below was checked against the current Bun and Deno documentation.

<div class="cheatsheet">

### Dependencies

| Bun                | Deno                 |
| ------------------ | -------------------- |
| `bun install`      | `deno install`       |
| `bun add <pkg>`    | `deno add npm:<pkg>` |
| `bun remove <pkg>` | `deno remove <pkg>`  |
| `bun update`       | `deno update`        |
| `bun outdated`     | `deno outdated`      |

### Run and execute

| Bun                | Deno                 |
| ------------------ | -------------------- |
| `bun file.ts`      | `deno file.ts`       |
| `bun run <script>` | `deno task <script>` |
| `bunx <pkg>`       | `deno x npm:<pkg>`   |

### Test, build, and toolchain

| Bun                   | Deno            |
| --------------------- | --------------- |
| `bun test`            | `deno test`     |
| `bun build`           | `deno bundle` ¹ |
| `bun build --compile` | `deno compile`  |
| `bun upgrade`         | `deno upgrade`  |

¹ [`deno bundle`](/runtime/reference/cli/bundle/) produces a single JavaScript
file from a module graph. It is currently experimental; see the
[Bundling](/runtime/reference/bundling/) guide for the options.

</div>

Bun has no built-in formatter or linter, so these are additions rather than
replacements: [`deno fmt`](/runtime/reference/cli/fmt/) and
[`deno lint`](/runtime/reference/cli/lint/) cover what you would otherwise
install Prettier, ESLint, or Biome for, with no extra dependencies.

## Bun APIs and their Deno equivalents

### Bun.serve to Deno.serve

Both servers take a fetch-style handler: a function that receives a `Request`
and returns a `Response`. A `Bun.serve` call usually translates directly to
[`Deno.serve`](/api/deno/~/Deno.serve):

```ts title="server.ts"
Deno.serve({ port: 3000 }, (req) => {
  return new Response("Hello, World!");
});
```

The differences: `Bun.serve` takes a single options object with a `fetch`
property, while [`Deno.serve`](/api/deno/~/Deno.serve) takes the handler as a
direct argument (optionally preceded by an options bag). Bun passes the server
object as the handler's second argument; Deno passes connection info instead.
Bun's `routes` option has no built-in counterpart in
[`Deno.serve`](/api/deno/~/Deno.serve): use `URLPattern` or a framework for
routing. See [HTTP servers](/runtime/fundamentals/http_server/) for more.

### bun:sqlite to node:sqlite

Deno supports the [`node:sqlite`](/runtime/reference/node_apis/) built-in, which
is also synchronous and covers the same ground:

```ts title="db.ts"
import { DatabaseSync } from "node:sqlite";

const db = new DatabaseSync(":memory:");
db.exec("CREATE TABLE people (name TEXT)");
db.prepare("INSERT INTO people VALUES (?)").run("Ada");

const rows = db.prepare("SELECT * FROM people").all();
console.log(rows);
```

The class names differ (`DatabaseSync` and `StatementSync` instead of `Database`
and `Statement`), but the prepare/run/get/all flow is the same.

### Bun.file to Deno file APIs

`Bun.file()` returns a lazy file reference with `.text()` and `.json()` methods.
In Deno, read the file directly with
[`Deno.readTextFile`](/api/deno/~/Deno.readTextFile), or use
[`Deno.open`](/api/deno/~/Deno.open) when you need a handle for streaming:

```ts
const text = await Deno.readTextFile("./data.txt");
const config = JSON.parse(await Deno.readTextFile("./config.json"));
```

For higher-level helpers (copy, move, walk, exists), use the
[`@std/fs`](https://jsr.io/@std/fs) package. `node:fs` also works if you prefer
the Node APIs.

### bun:test to deno test

`bun test` runs Jest-style tests imported from `bun:test`. Deno's test runner
uses [`Deno.test`](/api/deno/~/Deno.test) instead, and the standard library
covers the Jest-style pieces: `describe` and `it` come from
[`@std/testing/bdd`](/runtime/reference/std/testing/), and `expect` comes from
[`@std/expect`](/runtime/reference/std/expect/):

```ts title="add.test.ts"
import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { add } from "./add.ts";

describe("add", () => {
  it("adds two numbers", () => {
    expect(add(1, 2)).toBe(3);
  });
});
```

```sh
deno test
```

Tests written against `node:test` also run under Deno. See
[Testing](/runtime/test/) for the full picture.

### The $ shell

Bun's `$` template-literal shell has a near-identical third-party counterpart:
[`dax`](https://jsr.io/@david/dax), one of the libraries that inspired it.

```ts
import $ from "jsr:@david/dax";

const result = await $`echo hello`.text();
```

For plain subprocess control without a shell layer, use the built-in
[`Deno.Command`](/api/deno/~/Deno.Command) API.

### bunfig.toml to deno.json

Runtime and tooling configuration moves from `bunfig.toml` to `deno.json`:
tasks, formatter and linter settings, compiler options, and import maps all live
there. Deno reads `package.json` alongside it, so you can migrate incrementally.
See [Configuration](/runtime/fundamentals/configuration/).

## What has no direct equivalent

A few Bun features have no Deno counterpart, so plan around them:

- **Macros.** Bun can run functions at bundle time via `with { type: "macro" }`
  imports and inline the results. Deno has no bundle-time macro system; do that
  work in a build script instead.
- **HTMLRewriter.** Bun ships the Cloudflare Workers-compatible `HTMLRewriter`
  built on lol-html. Deno has no built-in `HTMLRewriter` global; use an npm
  package such as `npm:lol-html` or an HTML parser like
  [`deno-dom`](https://jsr.io/@b-fuze/deno-dom).
- **Bundler specifics.** `bun build` features like HTML entrypoints with
  automatic asset bundling don't map one-to-one onto the experimental
  `deno bundle`. For full-featured frontend builds, use Vite or another bundler
  under Deno; see [Bundling](/runtime/reference/bundling/).

## Keep going

- **[Migrate from Node.js](/runtime/migrate/).** Much of it applies to Bun
  projects too, including how CommonJS and ES modules are resolved.
- **[Security and permissions](/runtime/fundamentals/security/).** How the
  sandbox works and which flags to grant.
- **[Testing](/runtime/test/).** The test runner, mocking, snapshots, and
  coverage.
- **[Dependency management](/runtime/packages/).** npm, JSR, and `package.json`
  workflows in detail.
