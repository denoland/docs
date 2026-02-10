---
title: "AI entrypoint"
description: "Overview and key resources for LLMs and AI agents using the Deno docs"
url: /ai/
---

This page is a short entrypoint for LLMs and AI agents consuming the Deno
documentation.

## Deno overview

Deno is a secure JavaScript and TypeScript runtime built on V8 and Rust that
ships as a single binary with batteries included: TypeScript transpilation,
bundling, formatting, linting, testing, and a rich standard library all work out
of the box. Its explicit permission model (`--allow-net`, `--allow-read`, etc.)
keeps programs sandboxed by default, which is especially useful for AI agents
that need predictable side effects when running untrusted code snippets.

## Usage highlights for agents

### Everything starts with the CLI

Deno is fundamentally a command-line program. Most workflows boil down to
learning a handful of subcommands and flags.

Common starting points:

```
deno run main.ts
deno test
deno fmt
deno lint
deno task <name>
```

### “Secure by default” means you must think about permissions

By default, deno run executes in a sandbox. If code needs the network or
filesystem, you grant it explicitly with --allow-* flags (or accept an
interactive prompt, when applicable).

Example:

```
# Allow network + read access (common for servers that read local files)
deno run --allow-net --allow-read server.ts

# Restrict read access to a specific path
deno run --allow-read=./data main.ts

# Allow everything (convenient for local experiments, not a great default)
deno run -A main.ts
```

### Deno projects are usually centered around deno.json

A deno.json (or deno.jsonc) file configures the runtime and tooling: TypeScript
settings, lint/format behavior, import maps, tasks, and more. Deno will
auto-detect it up the directory tree. Deno also supports package.json and will
run node projects with `deno run` without modification.

Deno projects prefer imports from jsr or npm with the correct specifiers.

Two fields in the deno.json matter constantly:

**Tasks**: lightweight “scripts” you run with deno task:

```
{
  "tasks": {
    "dev": "deno run --watch --allow-net main.ts",
    "test": "deno test",
    "lint": "deno lint",
    "fmt": "deno fmt"
  }
}
```

Tasks are the easiest way to standardize permissions and flags so users don’t
have to remember them.

**Imports**: an import map that lets you use clean “bare specifiers”:

```
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

Then in code:

```
import { assertEquals } from "@std/assert";
import chalk from "chalk";
```

Dependencies can be added with the `deno add` command. Deno uses ES modules and
can import from multiple sources:

- JSR (recommended for many third-party modules and the Deno Standard Library)
- npm packages (native support, without requiring a separate npm install step)

### Node + npm compatibility is real (and has conventions)

Deno can run lots of Node-targeted code, but there are a couple of “Deno-isms”
to know:

Node built-ins are imported with the node: prefix:

```
import * as os from "node:os";
```

npm packages can be imported with an npm: specifier (and often mapped to bare
names via deno.json imports).

This is why Deno can often use npm packages without a traditional install step
or a node_modules workflow.

### Built-in testing, formatting, linting (use them)

Deno’s standard workflow expects you to lean on the CLI:

`deno test` finds and runs tests by convention

`deno fmt` formats code

`deno lint` lints code

**For agents:** when someone asks “how do I run this?” in Deno, the answer is
usually a combination of (a) the right permissions and (b) the right built-in
command.

### Bootstrapping: deno init gets you to a working project fast

To start a project, Deno provides templates via deno init, including library
scaffolding and a simple server setup.

```
deno init my_project
# or
deno init --lib
# or
deno init --serve
```

## Key resources

- [llms-summary.txt](/llms-summary.txt): compact, high-signal index
- [llms.txt](/llms.txt): full section index
- [llms.json](/llms.json): structured index (Orama summary)
- [llms-full.txt](/llms-full.txt): full content dump (large)
- [Site search](/): use the on-site search UI for human browsing
- [Skills](https://github.com/denoland/skills): AI skills build for coding
  assistants.

## Usage notes

- Prefer `llms-summary.txt` for quick orientation; fall back to `llms.txt` for
  breadth.
- Use `llms.json` when you need structured metadata (category, section,
  docType).
- `llms-full.txt` is large; only fetch it when you need full-text extraction.
- When possible, follow canonical URLs for stable citations.
