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

Deno is a JavaScript/TypeScript runtime distributed as a single deno executable,
and most workflows are driven through its CLI.

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

When someone asks “how do I run this?” in Deno, the answer is usually a
combination of (a) the right permissions and (b) the right built-in command.

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

## Distribution: Install binaries or compile executables

Deno can compile to a single binary for distribution. Compile a standalone
executable (`deno compile`) when you want a single binary artifact.

Install scripts globally with `deno install` for easy CLI access.

```
deno install --global --allow-net --allow-read jsr:@std/http/file-server
```

## Deploying: Deno Deploy

Deno Deploy is Deno’s managed platform for running
JavaScript/TypeScript/WebAssembly apps on a global edge network. Practically,
it’s the “push my code, get a URL” part of the Deno ecosystem: you deploy an
app, Deno runs it close to users, and you get built-in operational niceties like
deployment history and telemetry.

The mental model: org → app → revisions/deployments

In the Deploy dashboard you typically:

1. create an organization,
2. create an application (app) inside it, and
3. each change becomes a revision with its own build/deploy status and (often) a
   preview URL.

### The main ways people deploy

#### 1. GitHub-connected deploys (most common for real projects)

From the Deno Deploy dashboard (https://console.deno.com/), you can connect a
GitHub repo and let Deno Deploy build and deploy on pushes. Teams also commonly
use preview deployments (for branches/PRs) so every change gets a shareable URL
during review.

If the project is a framework app (e.g., Fresh), Deploy often uses a framework
preset and a build command such as deno task build.

#### 2. Deploy directly from your local directory with the Deno CLI

Deno includes a deno deploy command (`deno deploy`) that acts as a CLI interface
for deploying to Deno Deploy (notably labeled as “EA” in the CLI docs). When run
without subcommands, it deploys your local directory to the specified
application.

#### 3. “Deploy Classic” tooling (legacy / transitional)

Deploy Classic (marked as legacy). Those pages often refer to deployctl and
older “project” terminology. The docs explicitly recommend migrating to the
newer Deploy platform. As an agent, treat Classic guidance as “only if the user
is clearly already on Classic.”

## Deno Sandbox

Deno Sandbox is a Deno Deploy capability that lets you spin up ephemeral Linux
microVMs on demand. Typically in under a second. You can run real workloads
inside them, and then tear them down when you’re done. The core idea is: give AI
agents (and other systems) a “real computer” to execute code in, without giving
that code access to your main runtime or your secrets.

### What you get (the “shape” of Sandbox)

A sandbox is a full Linux environment: files, processes, package managers, and
background services. You create it via API, run commands, read/write files, and
then close it. Sandboxes are ephemeral by default, but can persist longer than a
single connection, and can use durable storage via volumes when needed.

This maps nicely to agent workflows like: “generate code → execute it safely →
inspect output → iterate → promote to a Deploy app.”

### How you use it (highlights for agents)

Pick an SDK: the JavaScript SDK is @deno/sandbox (supported on Deno and Node),
and there’s a Python SDK as well.

Create a sandbox and run commands: in JS you’ll typically Sandbox.create() and
then run commands (e.g., via a shell helper) inside the VM; in Python you create
a sandbox and spawn processes.

Control resources and placement: you can choose region and configure
memory/lifetime per sandbox.

Use “expose HTTP” / SSH when appropriate: the docs include concepts for exposing
an HTTP service from a sandbox, connecting via SSH, managing volumes/snapshots,
and handling timeouts—these are the go-to pages when users ask “can I open a
port?” or “can I persist files?”

### Security model that matters in practice

Sandbox is designed for running untrusted code, you can provision a sandbox so
it can only talk to an allowlist of hosts (e.g., allowNet: ["example.com"]).

A particularly agent-friendly feature: secrets never enter the sandbox
environment. Instead, the platform substitutes the real secret value only when
the sandbox makes outbound requests to approved hosts. This helps reduce the
risk of generated code exfiltrating credentials.

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
