# Environment variables

There are a few ways to use environment variables in Deno:

## Built-in `Deno.env`

The Deno runtime offers built-in support for environment variables with
[`Deno.env`](https://deno.land/api@v1.25.3?s=Deno.env).

`Deno.env` has getter and setter methods. Here is example usage:

```ts
Deno.env.set("FIREBASE_API_KEY", "examplekey123");
Deno.env.set("FIREBASE_AUTH_DOMAIN", "firebasedomain.com");

console.log(Deno.env.get("FIREBASE_API_KEY")); // examplekey123
console.log(Deno.env.get("FIREBASE_AUTH_DOMAIN")); // firebasedomain.com
console.log(Deno.env.has("FIREBASE_AUTH_DOMAIN")); // true
```

## `.env` file

You can also put environment variables in a `.env` file and retrieve them using
`dotenv` in the standard library.

Let's say you have an `.env` file that looks like this:

```sh
PASSWORD=Geheimnis
```

To access the environment variables in the `.env` file, import the `load`
function from the standard library. Then, import the configuration using it.

```ts
import { load } from "jsr:std/dotenv@^0";

const env = await load();
const password = env["PASSWORD"];

console.log(password);
// "Geheimnis"
```

## `std/cli`

The Deno standard library has a [`std/cli` module](https://jsr.io/@std/cli) for
parsing command line arguments.

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
| HTTP_PROXY           | Proxy address for HTTP requests (module downloads, fetch)                                                                                                                         |
| HTTPS_PROXY          | Proxy address for HTTPS requests (module downloads, fetch)                                                                                                                        |
| NPM_CONFIG_REGISTRY  | URL to use for the npm registry.                                                                                                                                                  |
| NO_COLOR             | Set to disable color                                                                                                                                                              |
| NO_PROXY             | Comma-separated list of hosts which do not use a proxy (module downloads, fetch)                                                                                                  |

You can also view the same content with `deno --help`.
