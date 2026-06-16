---
last_modified: 2026-06-14
title: "Security and permissions"
description: "A guide to Deno's security model: secure-by-default execution, the permission sandbox, evaluating and executing untrusted code, and the permission broker. See the Permissions reference for the flags."
---

Deno is secure by default. Unless you specifically enable it, a program run with
Deno has no access to sensitive APIs, such as file system access, network
connectivity, or environment access. You must explicitly grant access to these
resources with command line flags or with a runtime permission prompt. This is a
major difference from Node, where dependencies are automatically granted full
access to all system I/O, potentially introducing hidden vulnerabilities into
your project.

Before using Deno to run completely untrusted code, read the
[section on executing untrusted code](#executing-untrusted-code) below.

## Key principles

Before diving into the specifics of permissions, it's important to understand
the key principles of Deno's security model:

- **No access to I/O by default**: Code executing in a Deno runtime has no
  access to read or write arbitrary files on the file system, to make network
  requests or open network listeners, to access environment variables, or to
  spawn subprocesses.
- **No limits on the execution of code at the same privilege level**: Deno
  allows the execution of any code (JS/TS/Wasm) via multiple means, including
  `eval`, `new Function`, dynamic imports and web workers at the same privilege
  level with little restriction as to where the code originates (network, npm,
  JSR, etc).
- **Multiple invocations of the same application can share data**: Deno provides
  a mechanism for multiple invocations of the same application to share data,
  through built in caching and KV storage APIs. Different applications can not
  see each other's data.
- **All code executing on the same thread shares the same privilege level**: All
  code executing on the same thread shares the same privilege level. It is not
  possible for different modules to have different privilege levels within the
  same thread.
- **Code can not escalate its privileges without user consent**: Code executing
  in a Deno runtime can not escalate its privileges without the user agreeing
  explicitly to an escalation via interactive prompt or a invocation time flag.
- **The initial static module graph can import modules without restrictions**:
  All modules that are imported in the initial static module graph (local files,
  npm packages, jsr packages, and remote URLs) are loaded by the runtime without
  consulting the permission system. No `--allow-read` is required to load local
  files, and no `--allow-net` is required to fetch remote modules. The static
  graph includes static `import` statements and `import()` calls whose specifier
  is a string literal: anything that can be resolved without running code. This
  exemption applies only to loading. Once code runs, anything it does still goes
  through the permission system, and `import()` calls with non-literal
  specifiers (e.g. `import(someVariable)`) are checked against `--allow-read` /
  `--allow-import` at runtime.

These key principles are designed to provide an environment where a user can
execute code with minimal risk of harm to the host machine or network. The
security model is designed to be simple to understand and to provide a clear
separation of concerns between the runtime and the code executing within it. The
security model is enforced by the Deno runtime, and is not dependent on the
underlying operating system.

## Permissions

Deno is sandboxed by default: code cannot touch the file system, network,
environment, or run subprocesses unless you allow it. Permissions are not all or
nothing. You grant them with `--allow-*` flags, and most can be scoped to
specific resources, so a program gets exactly the access it needs and no more.

Run a program with no flags and a sensitive operation is refused:

```sh
deno run main.ts
# error: Requires net access to "example.com", run again with the --allow-net flag
```

Grant access scoped to just the host the program should reach:

```sh
deno run --allow-net=example.com main.ts
```

The same scoping works for the other permissions: `--allow-read=./data` limits
reads to one directory, `--allow-env=API_KEY` to a single variable, and so on. A
bare `--allow-net` with no value grants the whole category, which is broader
than most programs need.

When stdout is a terminal and you have not passed a flag, Deno pauses and asks
instead of failing, so you can grant access interactively as it is requested:

```console
⚠️  Deno requests net access to "example.com". Run again with --allow-net to bypass this prompt.
   Allow? [y/n/A] (y = yes, allow; n = no, deny; A = allow all net permissions) >
```

`--deny-*` flags override their `--allow-*` counterparts, so you can grant a
broad category and carve out the sensitive parts:
`--allow-read --deny-read=/etc` reads anything except `/etc`. At the other
extreme, `-A` (`--allow-all`) grants everything and turns the sandbox off
entirely, giving the same access as running code in Node, so reach for it
sparingly.

See the [Permissions reference](/runtime/reference/permissions/) for every
permission and its flags, and
[`permissions` in deno.json](/runtime/reference/deno_json/#permissions) for
declaring them in your configuration file.

### Permissions that bypass the sandbox

A few permissions grant access to things Deno cannot sandbox, so granting them
is effectively granting full access:

- `--allow-run` lets the program spawn subprocesses. A subprocess runs as a
  separate program with its own permissions, not the restricted set you granted
  the Deno process, so whatever it does happens outside the sandbox. This is why
  `--allow-run=deno` is especially dangerous: a script that can start a new
  `deno` process can start it with `--allow-all`, inheriting none of the
  parent's limits and escaping the sandbox entirely. Grant `--allow-run` only
  for specific, trusted executables where you can (`--allow-run=git`), and avoid
  giving a sandboxed program the ability to launch `deno` or a shell.
- `--allow-ffi` loads native libraries through [FFI](/runtime/fundamentals/ffi/)
  or Node-API addons. Deno enforces permissions in the JavaScript layer, but a
  native library runs as compiled machine code in the same process and can issue
  system calls directly. Once loaded, it can read files, open sockets, or do
  anything the operating system lets the process do, regardless of which
  `--allow-*` flags you passed.

Treat both as equivalent to `--allow-all` when deciding whether to trust the
code you are running.

### Adjusting permissions at runtime

A program can inspect and tighten its own permissions through the
[`Deno.permissions`](/api/deno/#permissions) API.
[`Deno.permissions.query`](/api/deno/#query-permissions) reports whether a
permission is granted,
[`Deno.permissions.request`](/api/deno/#request-permissions) prompts for one on
demand, and [`Deno.permissions.revoke`](/api/deno/#revoke-permissions)
downgrades a granted permission back to the prompt state:

```ts
// Read a config file at startup, then give up read access.
const config = JSON.parse(await Deno.readTextFile("./config.json"));
await Deno.permissions.revoke({ name: "read" });

// Later reads now have to prompt again, and fail outright under --no-prompt.
```

Dropping permissions you no longer need after startup is a simple way to shrink
the attack surface available to the rest of your code, including your
dependencies.

## Evaluation of code

Deno sets no limits on the execution of code at the same privilege level. This
means that code executing in a Deno runtime can use `eval`, `new Function`, or
even dynamic import or web workers to execute **arbitrary** code with the same
privilege level as the code that called `eval`, `new Function`, or the dynamic
import or web worker.

This code can be hosted on the network, be in a local file (if read permissions
are granted), or be stored as plain text in a string inside of the code that
called `eval`, `new Function`, or the dynamic import or web worker.

## Executing untrusted code

While Deno provides security features that are designed to protect the host
machine and network from harm, untrusted code is still scary. When executing
untrusted code, it is important to have more than one layer of defense. Some
suggestions for executing untrusted code are outlined below, and we recommend
using all of these when executing arbitrary untrusted code:

- Run `deno` with limited permissions and determine upfront what code actually
  needs to run (and prevent more code being loaded using `--frozen` lockfile and
  `--cached-only`).
- Isolate the untrusted part in a
  [Web Worker with a reduced permission set](/runtime/reference/web_platform_apis/#specifying-worker-permissions),
  so it cannot inherit everything the main program was granted.
- Use OS provided sandboxing mechanisms like `chroot`, `cgroups`, `seccomp`,
  etc.
- Use a sandboxed environment like a VM or MicroVM (gVisor, Firecracker, etc).

## Auditing dependencies

The permission sandbox controls what code can do at runtime, but it does not
tell you whether your dependencies contain known vulnerabilities. Deno ships
[`deno audit`](/runtime/reference/cli/audit/) to scan your dependencies against
vulnerability databases, which is useful as a CI gate. See
[supply chain management](/runtime/packages/supply_chain/) for keeping
dependencies safe over time.

## Permission broker

:::caution Advanced use only

Using a permission broker changes Deno's decision authority: CLI flags and
prompts no longer apply. Ensure your broker process is resilient, audited, and
available before enabling `DENO_PERMISSION_BROKER_PATH`.

:::

For centralized and policy-driven permission decisions, Deno can delegate all
permission checks to an external broker process. Enable this by setting the
`DENO_PERMISSION_BROKER_PATH` environment variable to a path that Deno will use
to connect to the broker:

- On Unix-like systems: a Unix domain socket path (for example,
  `/tmp/deno-perm.sock`).
- On Windows: a named pipe (for example, `\\.\pipe\deno-perm-broker`).

When a permission broker is active:

- All `--allow-*` and `--deny-*` flags are ignored.
- Interactive permission prompts are not shown (equivalent to non-interactive
  mode).
- Every permission check is sent to the broker; the broker must reply with a
  decision for each request.

If anything goes wrong during brokering (for example: Deno cannot connect to the
socket/pipe, messages are malformed, arrive out of order, IDs do not match, or
the connection closes unexpectedly), Deno immediately terminates the process to
preserve integrity and prevent permission escalation.

The request/response message shapes are versioned and defined by JSON Schemas:

- Request schema:
  [permission-broker-request.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/permission-broker-request.v1.json)
- Response schema:
  [permission-broker-response.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/permission-broker-response.v1.json)

Each request contains a version (`v`), the Deno process ID (`pid`), a unique
monotonic request `id`, a timestamp (`datetime`, RFC 3339), the `permission`
name, and an optional `value` depending on permission type. The response must
echo the `id` and include a `result` of either `"allow"` or `"deny"`. When
denied, a human-readable `reason` may be included.

Example message flow:

```text
-> req {"v":1,"pid":10234,"id":1,"datetime":"2025-01-01T00:00:00.000Z","permission":"read","value":"./run/permission_broker/scratch.txt"}
<- res {"id":1,"result":"allow"}
-> req {"v":1,"pid":10234,"id":2,"datetime":"2025-01-01T00:00:01.000Z","permission":"read","value":"./run/permission_broker/scratch.txt"}
<- res {"id":2,"result":"allow"}
-> req {"v":1,"pid":10234,"id":3,"datetime":"2025-01-01T00:00:02.000Z","permission":"read","value":"./run/permission_broker/log.txt"}
<- res {"id":3,"result":"allow"}
-> req {"v":1,"pid":10234,"id":4,"datetime":"2025-01-01T00:00:03.000Z","permission":"write","value":"./run/permission_broker/log.txt"}
<- res {"id":4,"result":"allow"}
-> req {"v":1,"pid":10234,"id":5,"datetime":"2025-01-01T00:00:04.000Z","permission":"env","value":null}
<- res {"id":5,"result":"deny","reason":"Environment access is denied."}
```
