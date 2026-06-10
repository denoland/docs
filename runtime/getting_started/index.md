---
title: "Get started"
description: "Install Deno and build your first project: create it, run it, test it, add a dependency, and use the built-in toolchain — no build step, no config."
oldUrl:
  - /runtime/getting_started/first_project/
  - /runtime/manual/getting_started/first_steps/
---

This page takes you from nothing to a running, tested Deno project in a few
minutes. We'll use [TypeScript](https://www.typescriptlang.org/) throughout — to
follow along in JavaScript, rename the files to `.js` and drop the type
annotations.

## Install Deno

Install the runtime with one command:

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="mac" label="macOS">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```shell title="pwsh"
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
</deno-tabs>

Verify it, and see [Installation](/runtime/getting_started/installation/) for
package managers, Docker, and other options:

```sh
deno --version
```

## Create a project

Scaffold a new project with [`deno init`](/runtime/reference/cli/init/):

```sh
deno init my_project
```

That creates a small, ready-to-run project:

```plaintext
my_project
├── deno.json      # project configuration: tasks, imports, lint/fmt settings
├── main.ts        # a tiny HTTP server built on Deno.serve
└── main_test.ts   # its tests
```

[`deno.json`](/runtime/reference/deno_json/) is where your tasks, dependencies,
and tooling config live — the equivalent of `package.json` plus your tool
configs, in one file.

## Run it

```sh
$ cd my_project
$ deno -N main.ts
Listening on http://localhost:8000/
```

Notice the `-N` (short for `--allow-net`). Deno is
[secure by default](/runtime/fundamentals/security/): code can't touch the
network, filesystem, or environment until you grant it. Open the URL to see the
response.

`main.ts` is TypeScript and it ran directly — **no `tsc`, no build step**. It's
also built on the web-standard [`Deno.serve`](/api/deno/~/Deno.serve) with
`Request`/`Response`, so what you learn here is the platform, not a framework.

## Test it

The project ships with tests. Run them with
[`deno test`](/runtime/fundamentals/testing/) — the test runner is built in, no
dependencies to add:

```sh
$ deno test
running 2 tests from ./main_test.ts
handler returns hello ... ok (1ms)
handler returns 404 for unknown route ... ok (1ms)

ok | 2 passed | 0 failed (3ms)
```

## Add a dependency

Pull in packages from [JSR](https://jsr.io) or npm with
[`deno add`](/runtime/reference/cli/add/) — it records them in `deno.json`:

```sh
deno add jsr:@std/assert    # the Deno standard library, on JSR
deno add npm:express        # any npm package
```

Then import and use them:

```ts
import { assertEquals } from "@std/assert";

assertEquals(1 + 1, 2);
```

## Use the built-in toolchain

Formatting, linting, and more come with the runtime — no setup:

```sh
deno fmt     # format your code
deno lint    # catch problems
deno task    # run scripts defined in deno.json
```

## Next steps

- **[Set up your editor](/runtime/getting_started/setup_your_environment/)** —
  autocomplete, inline errors, and formatting on save.
- **[Run code](/runtime/run/)** — servers, tasks, web APIs, and debugging.
- **[Manage packages](/runtime/packages/)** — dependencies, workspaces, publishing.
- **[Migrate from Node.js](/runtime/migrate/)** — bring an existing project across.
- **[Examples and tutorials](/examples/)** — ideas for what to build next.
