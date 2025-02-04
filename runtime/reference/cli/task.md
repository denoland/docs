---
title: "`deno task`"
oldUrl:
 - /runtime/tools/task_runner/
 - /runtime/manual/tools/task_runner/
 - /runtime/reference/cli/task_runner/
command: task
---

## Description

`deno task` provides a cross-platform way to define and execute custom commands
specific to a codebase.

To get started, define your commands in your codebase's
[Deno configuration file](/runtime/fundamentals/configuration/) under a
`"tasks"` key.

For example:

```jsonc
{
  "tasks": {
    "data": "deno task collect && deno task analyze",
    "collect": "deno run --allow-read=. --allow-write=. scripts/collect.js",
    "analyze": {
      "description": "Run analysis script",
      "command": "deno run --allow-read=. scripts/analyze.js"
    }
  }
}
```

## Specifying the current working directory

By default, `deno task` executes commands with the directory of the Deno
configuration file (ex. _deno.json_) as the current working directory. This
allows tasks to use relative paths and continue to work regardless of where in
the directory tree you happen to execute the deno task from. In some scenarios,
this may not be desired and this behavior can be overridden with the `INIT_CWD`
environment variable.

`INIT_CWD` will be set with the full path to the directory the task was run in,
if not already set. This aligns with the same behavior as `npm run`.

For example, the following task will change the current working directory of the
task to be in the same directory the user ran the task from and then output the
current working directory which is now that directory (remember, this works on
Windows too because `deno task` is cross-platform).

```json
{
  "tasks": {
    "my_task": "cd $INIT_CWD && pwd"
  }
}
```

## Getting directory `deno task` was run from

Since tasks are run using the directory of the Deno configuration file as the
current working directory, it may be useful to know the directory the
`deno task` was executed from instead. This is possible by using the `INIT_CWD`
environment variable in a task or script launched from `deno task` (works the
same way as in `npm run`, but in a cross-platform way).

For example, to provide this directory to a script in a task, do the following
(note the directory is surrounded in double quotes to keep it as a single
argument in case it contains spaces):

```json
{
  "tasks": {
    "start": "deno run main.ts \"$INIT_CWD\""
  }
}
```

## Wildcard matching of tasks

The `deno task` command can run multiple tasks in parallel by passing a wildcard pattern. A wildcard pattern is specified with the `*` character.

```json title="deno.json"
{
  "tasks": {
    "build-client": "deno run -RW client/build.ts",
    "build-server": "deno run -RW server/build.ts"
  }
}
```

Running `deno task "build-*"` will run both `build-client` and `build-server`
tasks.

:::note

**When using a wildcard** make sure to quote the task name (eg. `"build-*"`),
otherwise your shell might try to expand the wildcard character, leading to
suprising errors.

:::

## Task dependencies

You can specify dependencies for a task:

```json title="deno.json"
{
  "tasks": {
    "build": "deno run -RW build.ts",
    "generate": "deno run -RW generate.ts",
    "serve": {
      "command": "deno run -RN server.ts",
      "dependencies": ["build", "generate"]
    }
  }
}
```

In the above example, running `deno task serve` will first execute `build` and
`generate` tasks in parallel, and once both of them finish successfully the
`serve` task will be executed:

```bash
$ deno task serve
Task build deno run -RW build.ts
Task generate deno run -RW generate.ts
Generating data...
Starting the build...
Build finished
Data generated
Task serve deno run -RN server.ts
Listening on http://localhost:8000/
```

Dependency tasks are executed in parallel, with the default parallel limit being
equal to number of cores on your machine. To change this limit, use the
`DENO_JOBS` environmental variable.

Dependencies are tracked and if multiple tasks depend on the same task, that
task will only be run once:

```jsonc title="deno.json"
{
  //   a
  //  / \
  // b   c
  //  \ /
  //   d
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b", "c"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["d"]
    },
    "c": {
      "command": "deno run c.js",
      "dependencies": ["d"]
    },
    "d": "deno run d.js"
  }
}
```

```bash
$ deno task a
Task d deno run d.js
Running d
Task c deno run c.js
Running c
Task b deno run b.js
Running b
Task a deno run a.js
Running a
```

If a cycle between dependencies is discovered, an error will be returned:

```jsonc title="deno.json"
{
  "tasks": {
    "a": {
      "command": "deno run a.js",
      "dependencies": ["b"]
    },
    "b": {
      "command": "deno run b.js",
      "dependencies": ["a"]
    }
  }
}
```

```bash
$ deno task a
Task cycle detected: a -> b -> a
```

You can also specify a task that has `dependencies` but no `command`. This is
useful to logically group several tasks together:

```json title="deno.json"
{
  "tasks": {
    "dev-client": "deno run --watch client/mod.ts",
    "dev-server": "deno run --watch sever/mod.ts",
    "dev": {
      "dependencies": ["dev-client", "dev-server"]
    }
  }
}
```

Running `deno task dev` will run both `dev-client` and `dev-server` in parallel.

## Workspace support

`deno task` can be used in workspaces, to run tasks from multiple member
directories in parallel. To execute `dev` tasks from all workspace members use
`--recursive` flag:

```jsonc title="deno.json"
{
  "workspace": [
    "client",
    "server"
  ]
}
```

```jsonc title="client/deno.json"
{
  "name": "@scope/client",
  "tasks": {
    "dev": "deno run -RN build.ts"
  }
}
```

```jsonc title="server/deno.json"
{
  "name": "@scope/server",
  "tasks": {
    "dev": "deno run -RN server.ts"
  }
}
```

```bash
$ deno task --recursive dev
Task dev deno run -RN build.ts
Task dev deno run -RN server.ts
Bundling project...
Listening on http://localhost:8000/
Project bundled
```

Tasks to run can be filtered based on the workspace members:

```bash
$ deno task --filter "client" dev
Task dev deno run -RN build.ts
Bundling project...
Project bundled
```

Note that the filter matches against the workspace member names as specified in
the `name` field of each member's `deno.json` file.

## Syntax

`deno task` uses a cross-platform shell that's a subset of sh/bash to execute
defined tasks.

### Boolean lists

Boolean lists provide a way to execute additional commands based on the exit
code of the initial command. They separate commands using the `&&` and `||`
operators.

The `&&` operator provides a way to execute a command and if it _succeeds_ (has
an exit code of `0`) it will execute the next command:

```sh
deno run --allow-read=. --allow-write=. collect.ts && deno run --allow-read=. analyze.ts
```

The `||` operator is the opposite. It provides a way to execute a command and
only if it _fails_ (has a non-zero exit code) it will execute the next command:

```sh
deno run --allow-read=. --allow-write=. collect.ts || deno run play_sad_music.ts
```

### Sequential lists

Sequential lists are similar to boolean lists, but execute regardless of whether
the previous command in the list passed or failed. Commands are separated with a
semi-colon (`;`).

```sh
deno run output_data.ts ; deno run --allow-net server.ts
```

### Async commands

Async commands provide a way to make a command execute asynchronously. This can
be useful when starting multiple processes. To make a command asynchronous, add
an `&` to the end of it. For example the following would execute
`sleep 1 && deno run --allow-net client.ts` and `deno run --allow-net server.ts`
at the same time:

```sh
sleep 1 && deno run --allow-net client.ts & deno run --allow-net server.ts
```

Unlike in most shells, the first async command to fail will cause all the other
commands to fail immediately. In the example above, this would mean that if the
client command fails then the server command will also fail and exit. You can
opt out of this behavior by adding `|| true` to the end of a command, which will
force a `0` exit code. For example:

```sh
deno run --allow-net client.ts || true & deno run --allow-net server.ts || true
```

### Environment variables

Environment variables are defined like the following:

```sh
export VAR_NAME=value
```

Here's an example of using one in a task with shell variable substitution and
then with it being exported as part of the environment of the spawned Deno
process (note that in the JSON configuration file the double quotes would need
to be escaped with backslashes):

```sh
export VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

Would output:

```console
hello
Deno: hello
```

#### Setting environment variables for a command

To specify environment variable(s) before a command, list them like so:

```console
VAR=hello VAR2=bye deno run main.ts
```

This will use those environment variables specifically for the following
command.

### Shell variables

Shell variables are similar to environment variables, but won't be exported to
spawned commands. They are defined with the following syntax:

```sh
VAR_NAME=value
```

If we use a shell variable instead of an environment variable in a similar
example to what's shown in the previous "Environment variables" section:

```sh
VAR=hello && echo $VAR && deno eval "console.log('Deno: ' + Deno.env.get('VAR'))"
```

We will get the following output:

```console
hello
Deno: undefined
```

Shell variables can be useful when we want to re-use a value, but don't want it
available in any spawned processes.

### Exit status variable

The exit code of the previously run command is available in the `$?` variable.

```sh
# outputs 10
deno eval 'Deno.exit(10)' || echo $?
```

### Pipelines

Pipelines provide a way to pipe the output of one command to another.

The following command pipes the stdout output "Hello" to the stdin of the
spawned Deno process:

```sh
echo Hello | deno run main.ts
```

To pipe stdout and stderr, use `|&` instead:

```sh
deno eval 'console.log(1); console.error(2);' |& deno run main.ts
```

### Command substitution

The `$(command)` syntax provides a way to use the output of a command in other
commands that get executed.

For example, to provide the output of getting the latest git revision to another
command you could do the following:

```sh
deno run main.ts $(git rev-parse HEAD)
```

Another example using a shell variable:

```sh
REV=$(git rev-parse HEAD) && deno run main.ts $REV && echo $REV
```

### Negate exit code

To negate the exit code, add an exclamation point and space before a command:

```sh
# change the exit code from 1 to 0
! deno eval 'Deno.exit(1);'
```

### Redirects

Redirects provide a way to pipe stdout and/or stderr to a file.

For example, the following redirects _stdout_ of `deno run main.ts` to a file
called `file.txt` on the file system:

```sh
deno run main.ts > file.txt
```

To instead redirect _stderr_, use `2>`:

```sh
deno run main.ts 2> file.txt
```

To redirect both stdout _and_ stderr, use `&>`:

```sh
deno run main.ts &> file.txt
```

To append to a file, instead of overwriting an existing one, use two right angle
brackets instead of one:

```sh
deno run main.ts >> file.txt
```

Suppressing either stdout, stderr, or both of a command is possible by
redirecting to `/dev/null`. This works in a cross-platform way including on
Windows.

```sh
# suppress stdout
deno run main.ts > /dev/null
# suppress stderr
deno run main.ts 2> /dev/null
# suppress both stdout and stderr
deno run main.ts &> /dev/null
```

Or redirecting stdout to stderr and vice-versa:

```sh
# redirect stdout to stderr
deno run main.ts >&2
# redirect stderr to stdout
deno run main.ts 2>&1
```

Input redirects are also supported:

```sh
# redirect file.txt to the stdin of gzip
gzip < file.txt
```

Note that redirecting multiple redirects is currently not supported.

### Cross-platform shebang

Starting in Deno 1.42, `deno task` will execute scripts that start with
`#!/usr/bin/env -S` the same way on all platforms.

For example:

```ts title="script.ts"
#!/usr/bin/env -S deno run
console.log("Hello there!");
```

```json title="deno.json"
{
  "tasks": {
    "hi": "./script.ts"
  }
}
```

Then on a Windows machine:

```sh
> pwd
C:\Users\david\dev\my_project
> deno task hi
Hello there!
```

### Glob expansion

Glob expansion is supported in Deno 1.34 and above. This allows for specifying
globs to match files in a cross-platform way.

```console
# match .ts files in the current and descendant directories
echo **/*.ts
# match .ts files in the current directory
echo *.ts
# match files that start with "data", have a single number, then end with .csv
echo data[0-9].csv
```

The supported glob characters are `*`, `?`, and `[`/`]`.

## Built-in commands

`deno task` ships with several built-in commands that work the same out of the
box on Windows, Mac, and Linux.

- [`cp`](https://man7.org/linux/man-pages/man1/cp.1.html) - Copies files.
- [`mv`](https://man7.org/linux/man-pages/man1/mv.1.html) - Moves files.
- [`rm`](https://man7.org/linux/man-pages/man1/rm.1.html) - Remove files or
  directories.
  - Ex: `rm -rf [FILE]...` - Commonly used to recursively delete files or
    directories.
- [`mkdir`](https://man7.org/linux/man-pages/man1/mkdir.1.html) - Makes
  directories.
  - Ex. `mkdir -p DIRECTORY...` - Commonly used to make a directory and all its
    parents with no error if it exists.
- [`pwd`](https://man7.org/linux/man-pages/man1/pwd.1.html) - Prints the name of
  the current/working directory.
- [`sleep`](https://man7.org/linux/man-pages/man1/sleep.1.html) - Delays for a
  specified amount of time.
  - Ex. `sleep 1` to sleep for 1 second, `sleep 0.5` to sleep for half a second,
    or `sleep 1m` to sleep a minute
- [`echo`](https://man7.org/linux/man-pages/man1/echo.1.html) - Displays a line
  of text.
- [`cat`](https://man7.org/linux/man-pages/man1/cat.1.html) - Concatenates files
  and outputs them on stdout. When no arguments are provided it reads and
  outputs stdin.
- [`exit`](https://man7.org/linux/man-pages/man1/exit.1p.html) - Causes the
  shell to exit.
- [`head`](https://man7.org/linux/man-pages/man1/head.1.html) - Output the first
  part of a file.
- [`unset`](https://man7.org/linux/man-pages/man1/unset.1p.html) - Unsets
  environment variables.
- [`xargs`](https://man7.org/linux/man-pages/man1/xargs.1p.html) - Builds
  arguments from stdin and executes a command.

If you find a useful flag missing on a command or have any suggestions for
additional commands that should be supported out of the box, then please
[open an issue](https://github.com/denoland/deno_task_shell/issues) on the
[deno_task_shell](https://github.com/denoland/deno_task_shell/) repo.

Note that if you wish to execute any of these commands in a non-cross-platform
way on Mac or Linux, then you may do so by running it through `sh`:
`sh -c <command>` (ex. `sh -c cp source destination`).

## package.json support

`deno task` falls back to reading from the `"scripts"` entries in a package.json
file if it is discovered. Note that Deno does not respect or support any npm
life cycle events like `preinstall` or `postinstall`—you must explicitly run the
script entries you want to run (ex.
`deno install --entrypoint main.ts && deno task postinstall`).
