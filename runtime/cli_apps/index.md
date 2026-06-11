---
title: "Build CLI apps"
description: "Build command-line tools with Deno: read arguments, compile to a single self-contained executable, cross-compile for other platforms, and distribute your tool."
---

Deno is a great way to ship command-line tools. Your tool is just TypeScript —
no build step to run it — and when you're ready to distribute it, `deno compile`
turns it into a single self-contained executable that runs without Deno
installed.

## Read command-line arguments

Raw arguments are available on [`Deno.args`](/api/deno/~/Deno.args). For real
tools, parse them with [`@std/cli`](https://jsr.io/@std/cli), which handles
flags, options, and defaults:

```ts title="greet.ts"
import { parseArgs } from "jsr:@std/cli/parse-args";

const flags = parseArgs(Deno.args, {
  string: ["name"],
  default: { name: "world" },
});

console.log(`Hello, ${flags.name}!`);
```

```sh
$ deno run greet.ts --name=Deno
Hello, Deno!
```

## Compile to a single executable

[`deno compile`](/runtime/reference/cli/compile/) bundles your program and the
Deno runtime into one binary — no `node_modules`, no install step for your
users:

```sh
deno compile greet.ts
./greet --name=Deno
```

Name the output and bake in the permissions your tool needs, so it runs without
prompting:

```sh
deno compile --allow-net --output greet greet.ts
```

## Cross-compile for other platforms

Build for a platform other than your own with `--target`, so you can ship
binaries for Windows, macOS, and Linux from one machine:

```sh
deno compile --target x86_64-pc-windows-msvc --output greet.exe greet.ts
deno compile --target aarch64-apple-darwin --output greet greet.ts
```

See [`deno compile`](/runtime/reference/cli/compile/) for every target and flag,
including embedding assets and setting an icon.

## Install a tool from source

To make a script available as a command on your own machine (without compiling),
install it globally with [`deno install`](/runtime/reference/cli/install/):

```sh
deno install --global --allow-net --name greet greet.ts
greet --name=Deno
```

## Going further

- **[deno compile](/runtime/reference/cli/compile/)** — all targets, flags, and
  asset embedding.
- **[deno install](/runtime/reference/cli/install/)** — install tools and
  dependencies.
- **[Permissions](/runtime/reference/permissions/)** — choose exactly what your
  compiled tool may access.
