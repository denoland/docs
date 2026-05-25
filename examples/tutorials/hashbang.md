---
last_modified: 2026-05-21
title: "Executable scripts"
description: "Guide to creating executable scripts with Deno. Learn about hashbangs, file permissions, cross-platform compatibility, and how to create command-line tools that can run directly from the terminal."
url: /examples/hashbang_tutorial/
oldUrl:
  - /runtime/manual/examples/hashbang/
  - /runtime/tutorials/hashbang/
---

Making Deno scripts executable can come in handy when creating small tools or
utilities for tasks like file manipulation, data processing or repetitive tasks
that you might want to run from the command line. Executable scripts allow you
to create ad-hoc solutions without setting up an entire project.

## Creating an example script

To make a script executable, start the script with a hashbang, (sometimes called
a shebang). This is a sequence of characters (#!) that tells your operating
system how to execute a script. It is followed by the path to the interpreter
that should be used to run the script.

:::note

To use a hashbang on Windows you will need to install the Windows Subsystem for
Linux (WSL) or use a Unix-like shell like
[Git Bash](https://git-scm.com/downloads).

:::

We'll make a small command-line greeter that reads its first argument from
[Deno.args](/api/deno/~/Deno.args) and falls back to a default when none is
supplied. This is the shape almost every Deno CLI tool starts with.

Create a file named `hashbang.ts` with the following content:

```ts title="hashbang.ts"
#!/usr/bin/env -S deno run
const name = Deno.args[0] ?? "world";

console.log(`Hello, ${name}!`);
```

The first line is the hashbang. It tells the system to run the file with
`/usr/bin/env`, which then locates `deno` on your `PATH` and invokes `deno run`
on the script. The `-S` flag splits `deno run` into separate arguments so `env`
treats them correctly; without `-S` the whole string would be passed as a single
argument name and `env` would fail to find a program called `deno run`. There
are no `--allow-*` flags here because the script only reads from `Deno.args`,
which is always available. Deno prompts for permissions only when the script
tries to use a sandboxed API.

`Deno.args` is an array of the arguments that follow the script name on the
command line. `Deno.args[0]` is the first one; `?? "world"` substitutes
`"world"` when no argument was supplied.

### Execute the script

Before running the file directly, give it execute permission with `chmod` (you
only need to do this once per file):

```sh
chmod +x hashbang.ts
```

Now invoke it from the command line. With no arguments it uses the default; pass
a name and it greets that name instead:

```console
$ ./hashbang.ts
Hello, world!
$ ./hashbang.ts Ada
Hello, Ada!
```

## Using hashbang in files with no extension

For brevity, you may wish to omit the extension for your script's filename. In
this case, supply one using the `--ext` flag in the script itself, then you can
run the script with just the file name:

```shell title="my_script"
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("Hello!");
$ ./my_script
Hello!
```

🦕 Now you can directly execute Deno scripts from the command line! Remember to
set the execute permission (`chmod +x`) for your script file, and you’re all set
to build anything from simple utilities to complex tools. Check out the
[Deno examples](/examples/) for inspiration on what you can script.
