# Using deployctl on the command line

`deployctl` is a command line tool (CLI) that lets you work with the Deno Deploy
platform.

## Install `deployctl`

You can install the `deployctl` command with the below command:

    deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts

You also need to set the `DENO_DEPLOY_TOKEN` environment variable to your
personal access token. You can generate your Personal Access Token in
https://dash.deno.com/account#access-tokens.

## Usage

To deploy a local script:

    deployctl deploy --project=helloworld main.ts

To deploy a remote script:

    deployctl deploy --project=helloworld https://deno.com/examples/hello.js

To deploy a remote script without static files:

    deployctl deploy --project=helloworld --no-static https://deno.com/examples/hello.js

To ignore the node_modules directory while deploying:

    deployctl deploy --project=helloworld --exclude=node_modules main.tsx

See the help message (`deployctl -h`) for more details.

## `deno` CLI and local development

For local development you can use the `deno` CLI. To install `deno`, follow the
instructions in the
[Deno manual](https://deno.land/manual/getting_started/installation).

After installation, you can run your scripts locally:

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
Listening on http://localhost:8000
```

To watch for file changes add the `--watch` flag:

```shell
$ deno run --allow-net=:8000 --watch ./main.js
Listening on http://localhost:8000
```

For more information about the Deno CLI, and how to configure your development
environment and IDE, visit the Deno Manual's [Getting Started][manual-gs]
section.

[manual-gs]: https://deno.land/manual/getting_started
