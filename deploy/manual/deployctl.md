# Using deployctl on the command line

`deployctl` is a command line tool (CLI) that lets you work with the Deno Deploy
platform.

## Install `deployctl`

With the Deno runtime installed, you can install the `deployctl` utility with
the following command:

```sh
deno install -Arf https://deno.land/x/deploy/deployctl.ts
```

## Usage

The most basic usage of `deployctl` is to get in the root of the project you
want to deploy, and execute:

```shell
deployctl deploy
```

By default, deployctl will guess the project name based on the Git repo or
directory it is in. Similarly, it will guess the entrypoint by looking for files
with common entrypoint names (main.ts, src/main.ts, etc). After the first
deployment, the settings used will be stored in a config file (by default
deno.json).

You can specify the project name and/or the entrypoint using the `--project` and
`--entrypoint` arguments respectively:

```shell
deployctl deploy --project=helloworld --entrypoint=src/entrypoint.ts
```

By default, deployctl deploys all the files in the current directory
(recursively). You can customize this behaviour using the `--include` and
`--exclude` arguments (also supported in the config file). Here are some
examples:

- Include only source and static files:

  ```shell
  deployctl deploy --include=./src --include=./static
  ```

- Ignore the node_modules directory:

  ```shell
  deployctl deploy --exclude=./node_modules
  ```

A common pitfall is to not include the source code modules that need to be run
(entrypoint and dependencies). The following example will fail because main.ts
is not included:

```shell
deployctl deploy --include=./static --entrypoint=./main.ts
```

The entrypoint can also be a remote script. A common use case for this is to
deploy an static site using `@std/http/file_server` (more details in
[Static Site Tutorial](https://docs.deno.com/deploy/tutorials/static-site)):

```shell
deployctl deploy --include=dist --entrypoint=jsr:@std/http@^0/file_server
```

See the help message (`deployctl -h`) for more details.

## `deno` CLI and local development

For local development you can use the `deno` CLI. To install `deno`, follow the
instructions in the
[Deno manual](https://deno.land/manual/getting_started/installation).

After installation, you can run your scripts locally:

```shell
$ deno run --allow-net=:8000 ./main.ts
Listening on http://localhost:8000
```

To watch for file changes add the `--watch` flag:

```shell
$ deno run --allow-net=:8000 --watch ./main.ts
Listening on http://localhost:8000
```

For more information about the Deno CLI, and how to configure your development
environment and IDE, visit the Deno Manual's [Getting Started][manual-gs]
section.

[manual-gs]: https://deno.land/manual/getting_started
