# Making Scripts Executable With a Hashbang (Shebang)

## Concepts

- [Deno.env] provides the environment variables.
- [env] runs a program in a modified environment.

## Overview

Making Deno scripts executable can come in handy when creating small tools.

Note: Hashbangs do not work on Windows.

## Example

In this program we give the context permission to access the environment
variables and print the Deno installation path.

```ts, ignore
#!/usr/bin/env -S deno run --allow-env

/**
 *  hashbang.ts
 */

const path = Deno.env.get("DENO_INSTALL");

console.log("Deno Install Path:", path);
```

### Permissions

You may require to give the script execution permissions.

#### Unix

```shell
chmod +x hashbang.ts
```

### Execute

Start the script by calling it like any other command:

```shell
./hashbang.ts
```

## Details

- A hashbang has to be placed in the first line.

- `-S` splits the command into arguments.

- End the file name in `.ts` for the script to be interpreted as TypeScript.

## Using hashbang in files with no extension

You may wish to not use an extension for your script's filename. In this case,
you can supply one by using the `--ext` flag:

```shell, ignore
$ cat my_script
#!/usr/bin/env -S deno run --allow-env --ext=js
console.log("Hello!");
$ ./my_script
Hello!
```

[Deno.env]: https://deno.land/api?s=Deno.env
[env]: https://www.man7.org/linux/man-pages/man1/env.1.html
