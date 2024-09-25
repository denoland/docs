---
title: "Security Model"
---

This document outlines the security model of the Deno runtime. Deno is designed
to be secure by default runtime, however to write secure applications it is
important to understand the security model of Deno.

Deno's security model is based on the following key principles:

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
- **Code can not escalate it's privileges without user consent**: Code executing
  in a Deno runtime can not escalate it's privileges without the user agreeing
  explicitly to an escalation.
- **The initial static module graph can import local files without
  restrictions**: All files that are imported in the initial static module graph
  can be imported without restrictions, so even if a explicit read permission is
  not granted for that file. This does not apply to any dynamic module imports.

These key principles are designed to provide an environment where a user can
execute code with minimal risk of harm to the host machine or network. The
security model is designed to be simple to understand and to provide a clear
separation of concerns between the runtime and the code executing within it. The
security model is enforced by the Deno runtime, and is not dependent on the
underlying operating system.

## Permissions

By default, access to most system I/O is denied. There are some I/O operations
that are allowed in a limited capacity, even by default. These are described
below.

To enable these operations, the user must explicitly grant permission to the
Deno runtime. This is done by passing the `--allow-read`, `--allow-write`,
`--allow-net`, `--allow-env`, and `--allow-run` flags to the `deno` command.

During execution of a script, a user can also explicitly grant permission to
specific files, directories, network addresses, environment variables, and
subprocesses when prompted by the runtime. Prompts are not shown if
stdout/stderr are not a TTY, or when the `--no-prompt` flag is passed to the
`deno` command.

### File system access

By default, executing code can not read or write arbitrary files on the file
system. This includes listing the contents of directories, checking for the
existence of a given file, and opening or connecting to Unix sockets.

Some APIs in Deno are implemented using file system operations under the hood,
even though they do not provide direct read/write access to specific files. Some
examples of these APIs are:

- `localStorage`
- Deno KV
- `caches`
- `Blob`

Because these APIs are implemented using file system operations, users can use
them to consume file system resources like storage space, even if they do not
have direct access to the file system.

During module loading, Deno can load files from disk. This sometimes requires
explicit permissions, and sometimes is allowed by default:

- All files that are imported from the entrypoint module in a way that they can
  be statically analyzed are allowed to be read by default. This includes static
  `import` statements and dynamic `import()` calls where the argument is a
  string literal that points to a specific file or a directory of files. The
  full list of files that are in this list can be printed using
  `deno info <entrypoint>`.
- Files that are dynamically imported in a way that can not be statically
  analyzed require runtime read permissions.
- Files inside of a `node_modules/` directory are allowed to be read by default.

When fetching modules from the network, or when transpiling code from TypeScript
to JavaScript, Deno uses the file system as a cache. This means that file system
resources like storage space can be consumed by Deno even if the user has not
explicitly granted read/write permissions.

### Network access

By default, executing code can not make network requests, open network listeners
or perform DNS resolution. This includes making HTTP requests, opening TCP/UDP
sockets, and listening for incoming connections on TCP or UDP.

During module loading, Deno can load modules from the network. By default Deno
allows loading modules from the following locations using both static and
dynamic imports:

- `https://deno.land/`
- `https://jsr.io/`
- `https://esm.sh/`
- `https://raw.githubusercontent.com`
- `https://gist.githubusercontent.com`

These locations are trusted "public good" registries that are not expected to
enable data exfiltration through URL paths.

In addition Deno allows importing any NPM package through `npm:` specifiers.

Deno also sends requests to `https://dl.deno.land/` at most once a day to check
for updates to the Deno CLI. This can be disabled using
`DENO_NO_UPDATE_CHECK=1`.

### Environment variables

By default, executing code can not read or write environment variables. This
includes reading environment variables, and setting new values.

Deno reads certain environment variables on startup, such as `DENO_DIR` and
`NO_COLOR` (see `deno help` for the full list).

The value of the `NO_COLOR` environment variable is visible to all code running
in the Deno runtime, regardless of whether the code has been granted permission
to read environment variables.

### Subprocesses

Code executing inside of a Deno runtime can not spawn subprocesses by default,
as this would constitute a violation of the principle that code can not escalate
it's privileges without user consent.

Deno provides a mechanism for executing subprocesses, but this requires explicit
permission from the user. This is done by passing the `--allow-run` flag to the
`deno` command.

When running `deno install` with the `--allow-scripts` flag, post-install
scripts for npm packages will be executed as a subprocess.

### FFI

Deno provides a mechanism for executing code written in other languages, such as
Rust, C, or C++, from within a Deno runtime. This is done using the
`Deno.dlopen` API, which can load shared libraries and call functions from them.

By default, executing code can not use the `Deno.dlopen` API, as this would
constitute a violation of the principle that code can not escalate it's
privileges without user consent.

In addition to `Deno.dlopen`, FFI can also be used via Node-API (NAPI) native
addons. These are also not allowed by default.

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
using using all of these when executing arbitrary untrusted code:

- Run `deno` with limited permissions and determine upfront what code actually
  needs to run (and prevent more code with `--frozen` lockfile and
  `--cached-only`).
- Use OS provided sandboxing mechanisms like `chroot`, `cgroups`, `seccomp`,
  etc.
- Use a sandboxed environment like a VM or MicroVM (gVisor, Firecracker, etc).
