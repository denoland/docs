---
last_modified: 2025-10-10
title: "Welcome to Deno"
description: "Get started with Deno, the JavaScript and TypeScript toolkit with a built-in runtime, package manager, test runner, and compiler."
pagination_next: /runtime/getting_started/first_project/
oldUrl:
  - /manual/
  - /runtime/manual/introduction/
  - /manual/introduction/
  - /runtime/manual/
  - /runtime/manual/getting_started/
  - /
---

[Deno](https://deno.com) is an
[open source](https://github.com/denoland/deno/blob/main/LICENSE.md) JavaScript
and TypeScript toolkit: a runtime, package manager, test runner, and compiler in
a single executable. It runs TypeScript natively, is secure by default, and works
with your existing npm packages.

## Install

<deno-tabs group-id="operating-systems">
<deno-tab value="mac" label="macOS" default>

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```powershell
irm https://deno.land/install.ps1 | iex
```

</deno-tab>
<deno-tab value="linux" label="Linux">

```sh
curl -fsSL https://deno.land/install.sh | sh
```

</deno-tab>
</deno-tabs>

[More installation options](/runtime/getting_started/installation/) |
Verify with `deno --version`

## Try it

An HTTP server in Deno:

```ts title="server.ts"
Deno.serve((req) => {
  const url = new URL(req.url);

  if (url.pathname === "/api") {
    return Response.json({ message: "Hello, world!" });
  }

  return new Response("Welcome to Deno!");
});
```

```sh
$ deno run --allow-net server.ts
Listening on http://0.0.0.0:8000/
```

No `package.json`, no build step, no `node_modules`. Just a `.ts` file and
`deno run`.

## What's included

```sh
deno run server.ts          # Run TypeScript and JavaScript
deno add npm:zod            # Install npm and JSR packages
deno test                   # Run tests
deno fmt                    # Format code
deno lint                   # Lint code
deno check                  # Type-check without running
deno compile server.ts      # Compile to a standalone binary
deno serve server.ts        # Production-ready HTTP server
```

## Why Deno?

- **TypeScript without config** — run `.ts` files directly, no `tsconfig.json`
  or build step required.
  [Learn more](/runtime/fundamentals/typescript/).
- **Secure by default** — no file, network, or environment access unless you
  explicitly allow it.
  [Learn more](/runtime/fundamentals/security/).
- **npm compatible** — import from npm with `npm:` specifiers, use Node built-in
  APIs, and run in existing Node projects.
  [Learn more](/runtime/fundamentals/node/).
- **Batteries included** — formatter, linter, test runner, LSP, and a
  [standard library](/runtime/reference/std/) with no external dependencies.
- **Web standard APIs** — built on `fetch`, `Request`, `Response`, Web Streams,
  `URLPattern`, and other platform APIs.

## Next steps

- [Create your first project](/runtime/getting_started/first_project/) — build
  an HTTP server, add a dependency, write a test
- [Set up your editor](/runtime/getting_started/setup_your_environment/) —
  VS Code, JetBrains, and other IDE support
- [Explore the CLI](/runtime/getting_started/command_line_interface/) — commands
  and flags overview
- [Browse examples](/examples/) — ready-to-run code for common tasks
