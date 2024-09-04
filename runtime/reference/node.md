---
title: "Node compatibility and interop"
oldUrl:
- /runtime/manual/npm_nodejs/std_node/
- /runtime/manual/node/
- /runtime/manual/npm_nodejs/cdns/
- /runtime/manual/using_deno_with_other_technologies/node/cdns/
- /runtime/manual/node/node_specifiers
- /runtime/manual/node/package_json
- /runtime/manual/npm_nodejs/compatibility_mode/
- /runtime/manual/node/migrate/
- /runtime/manual/node/compatibility/
- /runtime/manual/references/cheatsheet/
- /runtime/manual/node/cheatsheet/
---

Modern Node.js projects will run in Deno with little to no reworking required.
However, there are some key differences between the two runtimes that you can
take advantage of to make your code simpler and smaller when migrating your
Node.js projects to Deno.

## Migrating from Node.js to Deno

Running your Node.js project with Deno is a straightforward process, the main
points to be aware of are:

1. Usage of Node.js globals (like `process`, `Buffer`, etc)
2. Imported Node.js built-in modules need the `node:` specifier (`fs` ->
   `node:fs`)

:::tip

If your project is written with CommonJS (i.e. `require`), you will need to
update it to use ECMAScript modules, check out our helpful
[CommonJS to ESM guide](/runtime/tutorials/cjs_to_esm/) to get you up and
running with Deno.

:::

### Node.js built-ins

In Node.js 20 and earlier, built-in modules in the Node.js standard library
could be imported with "bare specifiers". Consider the Node program below with a
`.mjs` extension:

```js title="index.mjs"
import * as os from "os";
console.log(os.cpus());
```

The [`os` module](https://nodejs.org/api/os.html#oscpus) is built in to the
Node.js runtime, and can be imported using a bare specifier as above.

:::info .mjs extensions not required in Deno

The `.mjs` file extension is supported but not required in Deno. Because Node
doesn't support ESM by default, it requires you to name any files that use ESM
with a `.mjs` file extension.

## Node specifiers

:::

Deno provides a compatibility layer that allows the use of Node.js built-in APIs
within Deno programs. However, in order to use them, you will need to add the
`node:` specifier to any import statements that use them.

For example - if you update the code above to be this instead:

```js
import * as os from "node:os";
console.log(os.cpus());
```

And run it with `deno run index.mjs` - you will notice you get the same output
as running the program in Node.js. Updating any imports in your application to
use `node:` specifiers should enable any code using Node built-ins to function
as it did in Node.js.

### Runtime permissions in Deno

Consider the following simple [Express](https://expressjs.com/) server:

```js
import express from "npm:express@4";

const app = express();

app.get("/", function (_req, res) {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Express listening on :3000");
});
```

If you run the above with `deno run server.js`, you will be prompted for
permissions required to execute the code and its dependencies. For example:

```sh
$ deno run server.js
┌ ⚠️  Deno requests net access to "0.0.0.0:8000".
├ Requested by `Deno.listen()` API.
├ Run again with --allow-net to bypass this prompt.
└ Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) >
```

Deno features [runtime security by default](/runtime/fundamentals/security/),
meaning that you as the developer must opt in to giving your code access to the
filesystem, network, system environment, and more. Doing this prevents supply
chain attacks and other potential vulnerabilities in your code. By comparison,
Node.js has no concept of runtime security, with all code executed with the same
level of permission as the user running the code.

To run your code as you would in Node.js, you can pass the `-A` flag to enable
all permissions.

```sh
deno run -A server.js
```

For more granular control, you can enable access to specific features by opting
in to
[individual permissions](/runtime/fundamentals/security/#permissions-list).

### Running scripts from package.json

Deno supports running npm scripts natively with the
[`deno task`](../tools/task_runner.md) subcommand. Consider the following
Node.js project with a script called `start` inside its `package.json`:

```json title="package.json"
{
  "name": "my-project",
  "scripts": {
    "start": "eslint"
  }
}
```

You can execute this script with Deno by running:

```sh
deno task start
```

### Node.js global objects

In Node.js, there are a number of
[global objects](https://nodejs.org/api/globals.html) available in the scope of
all programs, like the `process` object, `Buffer`, or `__dirname` and
`__filename`.

Deno does not add additional objects and variables to the global scope, other
than the [`Deno` global](../runtime/builtin_apis.md). Any API that doesn't exist
as a web-standard browser API will be found in `Deno`. Alternatively, you can
import Node.js built-in modules using the `node:` specifier.

```js
import process from "node:process";
import { Buffer } from "node:buffer";

const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
```

:::note

If you do run into a problem with Node.js compatibility, please let us know by
[opening an issue on GitHub](https://github.com/denoland/deno/issues).

:::

### Optional improvements with Deno's built-in tools

One of Deno's core strengths is a unified toolchain that comes with support for
TypeScript out of the box, and tools like a linter, formatter and a test runner.
Switching to Deno allows you to simplify your toolchain and reduces the number
of moving components in your project. Deno also has a more secure runtime, with
[runtime permissions](../basics/permissions.md) that allow you to control what
your code can access.

#### deno.json (optional)

Deno has its own config file, `deno.json` or `deno.jsonc`, which can be used to
configure your project. You can use it to define tasks, dependencies, path
mappings, and other runtime configurations.

#### Migrating npm scripts to deno.json (optional)

If preferred, you can move your npm scripts over to `deno.json`, where they can
be run using `deno task`. This allows you to manage all necessary permission
flags and other runtime configuration in one place.

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read --allow-env server.js"
  }
}
```

```sh
deno task dev
```

#### Migrating npm dependencies to deno.json (optional)

You can also migrate your dependencies over to `deno.json`. Deno supports
importing dependencies from external package repositories, local files, and/or
URLs. To import your npm dependencies, you can add them to the `imports` field
in `deno.json`, and add the `npm:` specifier to the import path:

```json
{
  "imports": {
    "express": "npm:express@4"
  }
}
```

Deno supports multiple package registries and allows you to import dependencies
from npm, [JSR](https://jsr.io) and HTTP URLs.

```json
{
  "imports": {
    "express": "npm:express@4",
    "@luca/cases": "jsr:@luca/cases@1",
    "foo": "https://example.com/foo.ts"
  }
}
```

#### Linting (optional)

Deno ships with a built-in linter that is written with performance in mind. Deno
can lint large projects in just a few milliseconds. You can try it out on your
project by running:

```sh
deno lint
```

This will lint all files in your project. When the linter detects a problem, it
will show the line in your editor and in the terminal output. An example of what
that might look like:

```sh
error[no-constant-condition]: Use of a constant expressions as conditions is not allowed.
 --> /my-project/bar.ts:1:5
  | 
1 | if (true) {
  |     ^^^^
  = hint: Remove the constant expression

  docs: https://lint.deno.land/rules/no-constant-condition


Found 1 problem
Checked 4 files
```

Many linting issues can be fixed automatically by passing the `--fix` flag:

```sh
deno lint --fix
```

A full list of all supported linting rules can be found on
[https://lint.deno.land/](https://lint.deno.land/). To learn more about how to
configure the linter, check out the [`deno lint` subcommand](../tools/linter/).

### Formatting (optional)

Deno ships with a [built-in formatter](../tools/formatter/) that can optionally
format your code according to the Deno style guide. You can run the formatter on
your project by running:

```sh
deno fmt
```

If using `deno fmt` in CI, you can pass the `--check` argument to make the
formatter exit with an error when it detects improperly formatted code.

```sh
deno fmt --check
```

The formatting rules can be configured in your `deno.json` file. To learn more
about how to configure the formatter, check out the
[`deno fmt` subcommand](../tools/formatter/).

#### Testing (optional)

Deno encourages writing tests for your code, and provides a built-in test runner
to make it easy to write and run tests. The test runner is tightly integrated
into Deno, so that you don't have to do any additional configuration to make
TypeScript or other features work.

```ts title="my_test.ts"
Deno.test("my test", () => {
  // Your test code here
});
```

```sh
deno test
```

When passing the `--watch` flag, the test runner will automatically reload when
any of the imported modules change.

To learn more about the test runner and how to configure it, check out the
[`deno test` subcommand](../tools/test/) documentation.

## Node to Deno Cheatsheet

| Node.js                                | Deno                          |
| -------------------------------------- | ----------------------------- |
| `node file.js`                         | `deno run file.js`            |
| `ts-node file.ts`                      | `deno run file.ts`            |
| `nodemon`                              | `deno run --watch`            |
| `node -e`                              | `deno eval`                   |
| `npm i` / `npm install`                | `deno install`                |
| `npm install -g`                       | `deno install -g`             |
| `npm run`                              | `deno task`                   |
| `eslint`                               | `deno lint`                   |
| `prettier`                             | `deno fmt`                    |
| `package.json`                         | `deno.json` or `package.json` |
| `tsc`                                  | `deno check` ¹                |
| `typedoc`                              | `deno doc`                    |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                   |
| `nexe` / `pkg`                         | `deno compile`                |
| `npm explain`                          | `deno info`                   |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                |
| `tsserver`                             | `deno lsp`                    |
| `nyc` / `c8` / `istanbul`              | `deno coverage`               |
| benchmarks                             | `deno bench`                  |

¹ Type checking happens automatically, TypeScript compiler is built into the
`deno` binary.

## Built-in Node.js globals

Deno provides a similar set of built-in globals as Node.js, but with some
differences. Here are some common ones:

| Node.js                      | Deno                            |
| ---------------------------- | ------------------------------- |
| `process.cwd()`              | `Deno.cwd()`                    |
| `process.env.MY_ENV`         | `Deno.env.get("MY_ENV")`        |
| `process.env.MY_ENV = "foo"` | `Deno.env.set("MY_ENV", "foo")` |
| `process.platform`           | `Deno.build.os`                 |
| `process.arch`               | `Deno.build.arch`               |
| `process.execPath()`         | `Deno.execPath()`               |
| `process.exit(code)`         | `Deno.exit(code)`               |

It is also possible to import Node.js modules into your project using the
`node:` specifier. For example:

```js
import process from "node:process";
```

### APIs

| Node.js                                  | Deno                          |
| ---------------------------------------- | ----------------------------- |
| `fsPromises.readFile(filePath, "utf-8")` | `Deno.readTextFile(filePath)` |

## Node Compatibility

Deno provides polyfills for a number of built-in Node.js modules and globals.
For a full list of Node built-in modules, see the
[reference](https://docs.deno.com/api/node/).

Node compatibility is an ongoing project - help us identify gaps and let us know
which modules you need by
[opening an issue on GitHub](https://github.com/denoland/deno).

## Built-in module support

<div style="display: flex; flex-direction: row; gap: 10px; flex-wrap: wrap; margin-bottom: 10px">
  <div>✅ = Full support</div>
  <div>ℹ️ = Partial support</div>
  <div>❌ = Stubs only</div>
</div>

<details>
  <summary>
    <code>node:assert</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/assert/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:async_hooks</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>AsyncLocalStorage</code> is supported. <code>AsyncResource</code>,
    <code>executionAsyncId</code>, and <code>createHook</code> are
    non-functional stubs.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/async_hooks/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:buffer</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/buffer/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:child_process</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/child_process/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:cluster</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs.</p>
  <p>
    <a href="https://docs.deno.com/api/node/cluster/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:console</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/console/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:crypto</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Missing <code>Certificate</code> class,
    <code>crypto.Cipheriv.prototype.setAutoPadding</code>,
    <code>crypto.Decipheriv.prototype.setAutoPadding</code>,
    <code>crypto.publicDecrypt</code>,
    <code>crypto.ECDH.prototype.convertKey</code>, <code>x448</code> option for
    <code>generateKeyPair</code>, <code>crypto.KeyObject</code>,
    <code>safe</code>, <code>add</code> and <code>rem</code> options for
    <code>generatePrime</code>, <code>crypto.Sign.prototype.sign</code> and
    <code>crypto.Verify.prototype.verify</code> with non <code>BinaryLike</code>
    input, <code>crypto.secureHeapUsed</code>, <code>crypto.setEngine</code>,
    legacy methods of <code>crypto.X509Certificate</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/crypto/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:dgram</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Some <code>dgram.Socket</code> instance methods are non-functional stubs:
    <ul>
        <li><code>addMembership</code></li>
        <li><code>addSourceSpecificMembership</code></li>
        <li><code>dropMembership</code></li>
        <li><code>dropSourceSpecificMembership</code></li>
        <li><code>setBroadcast</code></li>
        <li><code>setMulticastInterface</code></li>
        <li><code>setMulticastLoopback</code></li>
        <li><code>setMulticastTtl</code></li>
        <li><code>setTtl</code></li>
    </ul>
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/dgram/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:diagnostics_channel</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/diagnostics_channel/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:dns</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>dns.resolve*</code> with <code>ttl</code> option.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/dns/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:domain</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs. This is a deprecated Node module.</p>
  <p>
    <a href="https://docs.deno.com/api/node/domain/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:events</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/events/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:fs</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <h5>
    <code>node:fs</code>
  </h5>
  <p>
    Missing <code>utf16le</code>, <code>latin1</code> and <code>ucs2</code>
    encoding for <code>fs.writeFile</code> and <code>fs.writeFileSync</code>.
  </p>
  <h5>
    <code>node:fs/promises</code>
  </h5>
  <p>
    Missing <code>lchmod</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/fs/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:http</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    <code>createConnection</code> option is currently not supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/http/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:http2</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Partially supported, major work in progress to enable <code>grpc-js</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/http2/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:https</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>https.Server.opts.cert</code> and
    <code>https.Server.opts.key</code> array type.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/https/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:inspector</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>console</code> is supported. Other APIs are stubs and will throw an
    error.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/inspector/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:module</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    The `register()` function is not supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/module/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:net</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>net.Socket.prototype.constructor</code> with <code>fd</code>
    option.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/net/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:os</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/os/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:path</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/path/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:perf_hooks</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>perf_hooks.eventLoopUtilization</code>,
    <code>perf_hooks.timerify</code>,
    <code>perf_hooks.monitorEventLoopDelay</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/perf_hooks/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:punycode</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/punycode/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:process</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>multipleResolves</code>, <code>worker</code> events.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/process/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:querystring</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/querystring/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:readline</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/readline/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:repl</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>builtinModules</code> and <code>_builtinLibs</code> are supported.
    Missing <code>REPLServer.prototype.constructor</code> and
    <code>start()</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/repl/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:stream</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/stream/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:string_decoder</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/string_decoder/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:sys</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/util/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:test</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Currently only <code>test</code> API is supported.
  </p>
  <p>
    <a href="https://nodejs.org/api/test.html">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:timers</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/timers/promises/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:tls</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>createSecurePair</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/tls/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:trace_events</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs.</p>
  <p>
    <a href="https://docs.deno.com/api/node/trace_events/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:tty</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/tty/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:util</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>aborted</code>, <code>transferableAbortSignal</code>, <code>transferableAbortController</code>, <code>MIMEParams</code>, <code>MIMEType</code>and <code>getSystemErrorMap</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/util/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:url</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/url/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:v8</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    <code>cachedDataVersionTag</code> and <code>getHeapStatistics</code> are
    supported. <code>setFlagsFromStrings</code> is a noop. Other APIs are not
    supported and will throw and error.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/v8/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:vm</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Partial support.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/vm/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:wasi</code>
    <div style="float: right">
      <span>❌</span>
    </div>
  </summary>
  <p>All exports are non-functional stubs.</p>
  <p>
    <a href="https://docs.deno.com/api/node/wasi/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:worker_threads</code>
    <div style="float: right">
      <span>ℹ️</span>
    </div>
  </summary>
  <p>
    Missing <code>parentPort.emit</code>,
    <code>parentPort.removeAllListeners</code>,
    <code>markAsUntransferable</code>, <code>moveMessagePortToContext</code>,
    <code>receiveMessageOnPort</code>,
    <code>Worker.prototype.getHeapSnapshot</code>.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/worker_threads/">Reference docs</a>
  </p>
</details>

<details>
  <summary>
    <code>node:zlib</code>
    <div style="float: right">
      <span>✅</span>
    </div>
  </summary>
  <p>
    Fully supported.
  </p>
  <p>
    <a href="https://docs.deno.com/api/node/zlib/~/Zlib">Reference docs</a>
  </p>
</details>

## Globals

This is the list of Node globals that Deno supports. These globals are only
available in the `npm` package scope. In your own code you can use them by
importing them from the relevant `node:` module.

| Global name                                                                                                      | Status                                       |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [`AbortController`](https://nodejs.org/api/globals.html#class-abortcontroller)                                   | ✅                                           |
| [`AbortSignal`](https://nodejs.org/api/globals.html#class-abortsignal)                                           | ✅                                           |
| [`Blob`](https://nodejs.org/api/globals.html#class-blob)                                                         | ✅                                           |
| [`Buffer`](https://nodejs.org/api/globals.html#class-buffer)                                                     | ✅                                           |
| [`ByteLengthQueuingStrategy`](https://nodejs.org/api/globals.html#class-bytelengthqueuingstrategy)               | ✅                                           |
| [`__dirname`](https://nodejs.org/api/globals.html#__dirname)                                                     | ⚠️ [Info](./migrate/#node.js-global-objects) |
| [`__filename`](https://nodejs.org/api/globals.html#__filename)                                                   | ⚠️ [Info](./migrate/#nodejs-global-objects)  |
| [`atob`](https://nodejs.org/api/globals.html#atobdata)                                                           | ✅                                           |
| [`BroadcastChannel`](https://nodejs.org/api/globals.html#broadcastchannel)                                       | ✅                                           |
| [`btoa`](https://nodejs.org/api/globals.html#btoadata)                                                           | ✅                                           |
| [`clearImmediate`](https://nodejs.org/api/globals.html#clearimmediateimmediateobject)                            | ✅                                           |
| [`clearInterval`](https://nodejs.org/api/globals.html#clearintervalintervalobject)                               | ✅                                           |
| [`clearTimeout`](https://nodejs.org/api/globals.html#cleartimeouttimeoutobject)                                  | ✅                                           |
| [`CompressionStream`](https://nodejs.org/api/globals.html#class-compressionstream)                               | ✅                                           |
| [`console`](https://nodejs.org/api/globals.html#console)                                                         | ✅                                           |
| [`CountQueuingStrategy`](https://nodejs.org/api/globals.html#class-countqueuingstrategy)                         | ✅                                           |
| [`Crypto`](https://nodejs.org/api/globals.html#crypto)                                                           | ✅                                           |
| [`CryptoKey`](https://nodejs.org/api/globals.html#cryptokey)                                                     | ✅                                           |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅                                           |
| [`CustomEvent`](https://nodejs.org/api/globals.html#customevent)                                                 | ✅                                           |
| [`DecompressionStream`](https://nodejs.org/api/globals.html#class-decompressionstream)                           | ✅                                           |
| [`Event`](https://nodejs.org/api/globals.html#event)                                                             | ✅                                           |
| [`EventTarget`](https://nodejs.org/api/globals.html#eventtarget)                                                 | ✅                                           |
| [`exports`](https://nodejs.org/api/globals.html#exports)                                                         | ✅                                           |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅                                           |
| [`fetch`](https://nodejs.org/api/globals.html#fetch)                                                             | ✅                                           |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅                                           |
| [`File`](https://nodejs.org/api/globals.html#class-file)                                                         | ✅                                           |
| [`FormData`](https://nodejs.org/api/globals.html#class-formdata)                                                 | ✅                                           |
| [`global`](https://nodejs.org/api/globals.html#global)                                                           | ✅                                           |
| [`Headers`](https://nodejs.org/api/globals.html#class-headers)                                                   | ✅                                           |
| [`MessageChannel`](https://nodejs.org/api/globals.html#messagechannel)                                           | ✅                                           |
| [`MessageEvent`](https://nodejs.org/api/globals.html#messageevent)                                               | ✅                                           |
| [`MessagePort`](https://nodejs.org/api/globals.html#messageport)                                                 | ✅                                           |
| [`module`](https://nodejs.org/api/globals.html#module)                                                           | ✅                                           |
| [`PerformanceEntry`](https://nodejs.org/api/globals.html#performanceentry)                                       | ✅                                           |
| [`PerformanceMark`](https://nodejs.org/api/globals.html#performancemark)                                         | ✅                                           |
| [`PerformanceMeasure`](https://nodejs.org/api/globals.html#performancemeasure)                                   | ✅                                           |
| [`PerformanceObserver`](https://nodejs.org/api/globals.html#performanceobserver)                                 | ✅                                           |
| [`PerformanceObserverEntryList`](https://nodejs.org/api/globals.html#performanceobserverentrylist)               | ❌                                           |
| [`PerformanceResourceTiming`](https://nodejs.org/api/globals.html#performanceresourcetiming)                     | ❌                                           |
| [`performance`](https://nodejs.org/api/globals.html#performance)                                                 | ✅                                           |
| [`process`](https://nodejs.org/api/globals.html#process)                                                         | ✅                                           |
| [`queueMicrotask`](https://nodejs.org/api/globals.html#queuemicrotaskcallback)                                   | ✅                                           |
| [`ReadableByteStreamController`](https://nodejs.org/api/globals.html#class-readablebytestreamcontroller)         | ✅                                           |
| [`ReadableStream`](https://nodejs.org/api/globals.html#class-readablestream)                                     | ✅                                           |
| [`ReadableStreamBYOBReader`](https://nodejs.org/api/globals.html#class-readablestreambyobreader)                 | ✅                                           |
| [`ReadableStreamBYOBRequest`](https://nodejs.org/api/globals.html#class-readablestreambyobrequest)               | ✅                                           |
| [`ReadableStreamDefaultController`](https://nodejs.org/api/globals.html#class-readablestreamdefaultcontroller)   | ✅                                           |
| [`ReadableStreamDefaultReader`](https://nodejs.org/api/globals.html#class-readablestreamdefaultreader)           | ✅                                           |
| [`require`](https://nodejs.org/api/globals.html#require)                                                         | ✅                                           |
| [`Response`](https://nodejs.org/api/globals.html#response)                                                       | ✅                                           |
| [`Request`](https://nodejs.org/api/globals.html#request)                                                         | ✅                                           |
| [`setImmediate`](https://nodejs.org/api/globals.html#setimmediatecallback-args)                                  | ✅                                           |
| [`setInterval`](https://nodejs.org/api/globals.html#setintervalcallback-delay-args)                              | ✅                                           |
| [`setTimeout`](https://nodejs.org/api/globals.html#settimeoutcallback-delay-args)                                | ✅                                           |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅                                           |
| [`structuredClone`](https://nodejs.org/api/globals.html#structuredclonevalue-options)                            | ✅                                           |
| [`SubtleCrypto`](https://nodejs.org/api/globals.html#subtlecrypto)                                               | ✅                                           |
| [`DOMException`](https://nodejs.org/api/globals.html#domexception)                                               | ✅                                           |
| [`TextDecoder`](https://nodejs.org/api/globals.html#textdecoder)                                                 | ✅                                           |
| [`TextDecoderStream`](https://nodejs.org/api/globals.html#class-textdecoderstream)                               | ✅                                           |
| [`TextEncoder`](https://nodejs.org/api/globals.html#textencoder)                                                 | ✅                                           |
| [`TextEncoderStream`](https://nodejs.org/api/globals.html#class-textencoderstream)                               | ✅                                           |
| [`TransformStream`](https://nodejs.org/api/globals.html#class-transformstream)                                   | ✅                                           |
| [`TransformStreamDefaultController`](https://nodejs.org/api/globals.html#class-transformstreamdefaultcontroller) | ✅                                           |
| [`URL`](https://nodejs.org/api/globals.html#url)                                                                 | ✅                                           |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅                                           |
| [`URLSearchParams`](https://nodejs.org/api/globals.html#urlsearchparams)                                         | ✅                                           |
| [`WebAssembly`](https://nodejs.org/api/globals.html#webassembly)                                                 | ✅                                           |
| [`WritableStream`](https://nodejs.org/api/globals.html#class-writablestream)                                     | ✅                                           |
| [`WritableStreamDefaultController`](https://nodejs.org/api/globals.html#class-writablestreamdefaultcontroller)   | ✅                                           |
| [`WritableStreamDefaultWriter`](https://nodejs.org/api/globals.html#class-writablestreamdefaultwriter)           | ✅                                           |

## Unstable compatibility features

Node and npm compatibility is an ongoing project for the Deno team. As such,
there are a number of unstable features aimed at improving compatibility that
you may want to reference. Please check out the
[unstable feature flags](/runtime/reference/cli/unstable_flags) documentation
for options that may improve your project's compatibility with code written for
Node.js.
