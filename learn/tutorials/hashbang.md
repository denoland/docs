---
title: "Executable scripts"
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

We'll make a simple script that prints the Deno installation path using the
[Deno.env](/api/deno/~/Deno.env) API.

Create a file named `hashbang.ts` with the following content:

```ts title="hashbang.ts"
#!/usr/bin/env -S deno run --allow-env
const path = Deno.env.get("DENO_INSTALL");

console.log("Deno Install Path:", path);
```

This script tells the system to use the deno runtime to run the script. The -S
flag splits the command into arguments and indicates that the following argument
(`deno run --allow-env`) should be passed to the env command.

The script then retrieves the value associated with the environment variable
named `DENO_INSTALL` with `Deno.env.get()` and assigns it to a variable called
`path`. Finally, it prints the path to the console using `console.log()`.

### Execute the script

In order to execute the script, you may need to give the script execution
permissions, you can do so using the `chmod` command with a `+x` flag (for
execute):

```sh
chmod +x hashbang.ts
```

You can execute the script directly in the command line with:

```sh
./hashbang.ts
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
[Deno examples](/learn/examples/) for inspiration on what you can script.
