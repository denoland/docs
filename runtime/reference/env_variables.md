---
title: "Environment variables"
oldUrl:
- /runtime/manual/basics/env_variables/
- /runtime/reference/cli/env_variables/
---

There are a few ways to use environment variables in Deno:

## Built-in Deno.env

The Deno runtime offers built-in support for environment variables with
[`Deno.env`](https://docs.deno.com/api/deno/~/Deno.env).

`Deno.env` has getter and setter methods. Here is example usage:

```ts
Deno.env.set("FIREBASE_API_KEY", "examplekey123");
Deno.env.set("FIREBASE_AUTH_DOMAIN", "firebasedomain.com");

console.log(Deno.env.get("FIREBASE_API_KEY")); // examplekey123
console.log(Deno.env.get("FIREBASE_AUTH_DOMAIN")); // firebasedomain.com
console.log(Deno.env.has("FIREBASE_AUTH_DOMAIN")); // true
```

## .env file

Deno supports `.env` files. You can cause Deno to read environment variables
from `.env` using the `--env-file` flag: `deno run --env-file <script>`. This
will read `.env` by default; if you want or need to load environment variables
from a different file, you can specify that file as a parameter to the flag.

Alternately, the `dotenv` package in the standard library will load environment
variables from `.env` as well.

Let's say you have an `.env` file that looks like this:

```sh
GREETING="Hello, world."
```

Import the `load` module to auto-import from the `.env` file and into the
process environment.

```ts
import "jsr:@std/dotenv/load";

console.log(Deno.env.get("GREETING")); // "Hello, world."
```

Further documentation for `.env` handling can be found in the
[@std/dotenv](https://jsr.io/@std/dotenv/doc) documentation.

## `std/cli`

The Deno Standard Library has a [`std/cli` module](https://jsr.io/@std/cli) for
parsing command line arguments. Please refer to the module for documentation and
examples.

## Special environment variables

The Deno runtime has these special environment variables.

| name                 | description                                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DENO_AUTH_TOKENS     | A semi-colon separated list of bearer tokens and hostnames to use when fetching remote modules from private repositories<br />(e.g. `abcde12345@deno.land;54321edcba@github.com`) |
| DENO_TLS_CA_STORE    | Comma-separated list of order dependent certificate stores.<br />Possible values: `system`, `mozilla`. Defaults to `mozilla`.                                                     |
| DENO_CERT            | Load certificate authority from PEM encoded file                                                                                                                                  |
| DENO_DIR             | Set the cache directory                                                                                                                                                           |
| DENO_INSTALL_ROOT    | Set deno install's output directory (defaults to `$HOME/.deno/bin`)                                                                                                               |
| DENO_REPL_HISTORY    | Set REPL history file path History file is disabled when the value is empty <br />(defaults to `$DENO_DIR/deno_history.txt`)                                                      |
| DENO_NO_PACKAGE_JSON | Disables auto-resolution of `package.json`                                                                                                                                        |
| DENO_NO_PROMPT       | Set to disable permission prompts on access<br />(alternative to passing `--no-prompt` on invocation)                                                                             |
| DENO_NO_UPDATE_CHECK | Set to disable checking if a newer Deno version is available                                                                                                                      |
| DENO_V8_FLAGS        | Set V8 command line options                                                                                                                                                       |
| DENO_JOBS            | Number of parallel workers used for the `--parallel` flag with the test subcommand.<br />Defaults to number of available CPUs.                                                    |
| DENO_WEBGPU_TRACE    | Path to a directory to output a [WGPU trace](https://github.com/gfx-rs/wgpu/pull/619) to when using the WebGPU API                                                                |
| DENO_WEBGPU_BACKEND  | Select the backend WebGPU will use, or a comma separated list of backends in order of preference. Possible values are `vulkan`, `dx12`, `metal`, or `opengl`                      |
| HTTP_PROXY           | Proxy address for HTTP requests (module downloads, fetch)                                                                                                                         |
| HTTPS_PROXY          | Proxy address for HTTPS requests (module downloads, fetch)                                                                                                                        |
| NPM_CONFIG_REGISTRY  | URL to use for the npm registry.                                                                                                                                                  |
| NO_COLOR             | Set to disable color                                                                                                                                                              |
| NO_PROXY             | Comma-separated list of hosts which do not use a proxy (module downloads, fetch)                                                                                                  |
