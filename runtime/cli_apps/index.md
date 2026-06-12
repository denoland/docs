---
title: "Build CLI apps"
description: "Build command-line tools with Deno: read arguments and stdin, prompt the user, set exit codes, compile to a single self-contained executable, and distribute your tool."
---

Deno is a great way to ship command-line tools. Your tool is just TypeScript, so
there's no build step to run it. When you're ready to distribute it,
`deno compile` turns it into a single self-contained executable that runs
without Deno installed.

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

## Read from stdin and detect a TTY

Good CLI tools compose with pipes. [`Deno.stdin`](/api/deno/~/Deno.stdin)
exposes standard input as a web-standard `ReadableStream`, so the easiest way to
read all piped input as text is to wrap it in a `Response`:

```ts
const input = await new Response(Deno.stdin.readable).text();
```

When your tool can be used both ways, use
[`Deno.stdin.isTerminal()`](/api/deno/~/Deno.stdin.isTerminal) to tell whether
stdin is an interactive terminal or a pipe, and branch accordingly. This is also
how tools decide whether to print colors and progress bars (interactive) or
plain machine-readable output (piped). Here the tool falls back to asking the
user when nothing is piped in:

```ts title="count.ts"
let input: string;

if (Deno.stdin.isTerminal()) {
  input = prompt("Enter some text:") ?? "";
} else {
  input = await new Response(Deno.stdin.readable).text();
}

console.log(`Got ${input.trim().length} characters`);
```

```sh
$ echo "hello from a pipe" | deno run count.ts
Got 17 characters
$ deno run count.ts
Enter some text: hi
Got 2 characters
```

Reading stdin requires no permission flags.

## Prompt the user

For simple interactive input, Deno ships the browser globals `prompt()`,
`confirm()`, and `alert()`. They block until the user responds, and they need no
imports or permissions:

```ts title="setup.ts"
const name = prompt("Project name:", "my-app");
const ok = confirm(`Create ${name}?`);
if (!ok) Deno.exit(1);
console.log(`Creating ${name}...`);
```

For anything fancier, reach for [`@std/cli`](https://jsr.io/@std/cli). Besides
argument parsing, it includes spinners, progress bars, and select prompts. These
live in modules prefixed with `unstable-`, so their APIs may still change. The
`Spinner` class shows an animated status line while your tool works:

```ts title="spin.ts"
import { Spinner } from "jsr:@std/cli/unstable-spinner";

const spinner = new Spinner({ message: "Downloading..." });
spinner.start();
await new Promise((resolve) => setTimeout(resolve, 2000));
spinner.stop();
console.log("Done");
```

```sh
deno run spin.ts
```

## Exit with the right code

Shells, scripts, and CI systems rely on your tool's exit code: zero means
success, anything else means failure. [`Deno.exit()`](/api/deno/~/Deno.exit)
terminates the process immediately with the given code:

```ts
if (Deno.args.length === 0) {
  console.error("Usage: check <file>...");
  Deno.exit(2);
}
```

Because [`Deno.exit()`](/api/deno/~/Deno.exit) stops the process on the spot,
pending work like flushing logs or `finally` blocks never runs. When you want to
record a failure but keep going, set
[`Deno.exitCode`](/api/deno/~/Deno.exitCode) instead. The process continues,
finishes naturally, and then exits with the code you set. This is the right
pattern for linters and batch tools that should report every problem rather than
stop at the first one:

```ts title="check.ts"
for (const file of Deno.args) {
  try {
    await Deno.lstat(file);
  } catch {
    console.error(`Missing: ${file}`);
    Deno.exitCode = 1;
  }
}
console.log("Check finished");
```

```sh
$ deno run --allow-read check.ts real.txt nope.txt
Missing: nope.txt
Check finished
$ echo $?
1
```

There is no fixed meaning for nonzero codes beyond "failure", but a common
convention is `1` for the errors your tool checks for and `2` for usage mistakes
like missing arguments.

## Compile to a single executable

[`deno compile`](/runtime/reference/cli/compile/) bundles your program and the
Deno runtime into one binary: no `node_modules`, no install step for your users.

```sh
deno compile greet.ts
./greet --name=Deno
```

Name the binary with `--output`. If your tool needs permissions, bake them in
with the usual `--allow-*` flags so it runs without prompting:

```sh
deno compile --output greet greet.ts
```

## Embed assets in the binary

A single-file executable should stay single-file even when your tool needs data
such as templates, word lists, or default configs. Pass `--include` to bundle
files or directories into the binary:

```sh
deno compile --include names.csv --output greet greet.ts
```

At runtime, read the embedded files relative to your module's directory with
`import.meta.dirname`:

```ts
const names = Deno.readTextFileSync(import.meta.dirname + "/names.csv");
```

The same code works during development with `deno run` and inside the compiled
binary, regardless of where the user runs it from. See
[including data files](/runtime/reference/cli/compile/#including-data-files-or-directories)
for directory includes and for configuring the paths once in `deno.json`.

## Cross-compile for other platforms

Build for a platform other than your own with `--target`, so you can ship
binaries for Windows, macOS, and Linux from one machine:

```sh
deno compile --target x86_64-pc-windows-msvc --output greet.exe greet.ts
deno compile --target aarch64-apple-darwin --output greet greet.ts
```

The full list of targets covers x86_64 and ARM builds of Linux, macOS, and
Windows; see
[supported targets](/runtime/reference/cli/compile/#supported-targets). If you
distribute binaries to end users, you can also sign them so operating systems
trust your tool; see
[code signing](/runtime/reference/cli/compile/#code-signing) for the macOS and
Windows steps.

## Install a tool from source

To make a script available as a command on your own machine (without compiling),
install it globally with [`deno install`](/runtime/reference/cli/install/):

```sh
deno install --global --name greet greet.ts
greet --name=Deno
```

## Going further

- **[deno compile](/runtime/reference/cli/compile/).** All targets, flags, asset
  embedding, icons, and code signing.
- **[deno install](/runtime/reference/cli/install/).** Install tools and
  dependencies.
- **[@std/cli](https://jsr.io/@std/cli).** Argument parsing, spinners, progress
  bars, and interactive prompts.
- **[Deno API reference](/api/deno/).** Everything on the `Deno` namespace,
  including stdin, exit codes, and file APIs.
- **[Permissions](/runtime/reference/permissions/).** Choose exactly what your
  compiled tool may access.
