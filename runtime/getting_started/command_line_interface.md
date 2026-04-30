---
last_modified: 2025-11-05
title: Command line interface
description: "An overview of Deno's command-line interface: running scripts, common flags, and key subcommands."
oldUrl:
  - /manual/getting_started/command_line_interface
  - /runtime/manual/getting_started/command_line_interface/
  - /runtime/fundamentals/command_line_interface/
  - /runtime/manual/tools/
---

The Deno CLI lets you run scripts, manage dependencies, run tests, format code,
and more. You can view all available commands by running:

```shell
deno help
```

For detailed documentation on every subcommand and flag, see the
[CLI reference guide](/runtime/reference/cli/).

## Running scripts

Run a local TypeScript or JavaScript file:

```shell
deno run main.ts
```

You can also pipe code from stdin:

```shell
cat main.ts | deno run -
```

## Permissions

By default, Deno runs programs in a sandbox without access to disk, network, or
environment. Use `--allow-*` flags to grant access:

```shell
# Allow network and file read access
deno run --allow-net --allow-read server.ts

# Grant all permissions (not recommended for production)
deno run -A server.ts
```

Learn more about [permissions and security](/runtime/fundamentals/security/).

## Script arguments

Arguments passed **after** the script name are available via `Deno.args`:

```shell
$ deno run main.ts arg1 arg2 arg3
[ "arg1", "arg2", "arg3" ]
```

:::caution

Deno flags must come _before_ the script name. Anything after the script name is
treated as a script argument, not a Deno flag:

```shell
# Good — grants net permission
deno run --allow-net server.ts

# Bad — --allow-net is passed to Deno.args instead
deno run server.ts --allow-net
```

:::

## Watch mode

Use `--watch` to automatically restart on file changes during development:

```shell
deno run --watch server.ts
deno test --watch
```

## Key subcommands

| Command                                              | Description                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [`deno run`](/runtime/reference/cli/run/)             | Execute a script                                                                     |
| [`deno serve`](/runtime/reference/cli/serve/)         | Run an HTTP server                                                                   |
| [`deno test`](/runtime/reference/cli/test/)           | Run tests                                                                            |
| [`deno fmt`](/runtime/reference/cli/fmt/)             | Format source code                                                                   |
| [`deno lint`](/runtime/reference/cli/lint/)           | Lint source code                                                                     |
| [`deno check`](/runtime/reference/cli/check/)         | Type-check without running                                                           |
| [`deno add`](/runtime/reference/cli/add/)             | Add a dependency to `deno.json`                                                      |
| [`deno install`](/runtime/reference/cli/install/)     | Install dependencies                                                                 |
| [`deno compile`](/runtime/reference/cli/compile/)     | Compile to a standalone binary                                                       |
| [`deno task`](/runtime/reference/cli/task/)           | Run a task defined in `deno.json`                                                    |
| [`deno doc`](/runtime/reference/cli/doc/)             | Generate documentation                                                               |

Each command has its own flags — run `deno <command> --help` for details, or
browse the [CLI reference](/runtime/reference/cli/).
