---
last_modified: 2026-06-29
title: "Permissions"
description: "Reference for Deno's permission system: how the runtime sandbox works and how to grant or deny file system, network, environment, system, subprocess, FFI, and import access with the --allow and --deny flags."
oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
  - /runtime/manual/basics/permissions
  - /runtime/manual/getting_started/permissions
---

Deno runs code in a secure sandbox: a program has no access to sensitive system
I/O unless you grant it. This page is the reference for every permission and the
`--allow-*` / `--deny-*` flags that control it. For the security model behind it
and guidance on running untrusted code, see
[Security](/runtime/fundamentals/security/).

By default, access to most system I/O is denied. There are some I/O operations
that are allowed in a limited capacity, even by default. These are described
below.

To enable these operations, the user must explicitly grant permission to the
Deno runtime. This is done by passing the `--allow-read`, `--allow-write`,
`--allow-net`, `--allow-env`, `--allow-run`, `--allow-sys`, `--allow-ffi`, and
`--allow-import` flags to the `deno` command.

During execution of a script, a user can also explicitly grant permission to
specific files, directories, network addresses, environment variables, and
subprocesses when prompted by the runtime. Prompts are not shown if
stdout/stderr are not a TTY, or when the `--no-prompt` flag is passed to the
`deno` command.

Users can also explicitly disallow access to specific resources by using the
`--deny-read`, `--deny-write`, `--deny-net`, `--deny-env`, `--deny-run`,
`--deny-sys`, `--deny-ffi`, and `--deny-import` flags. These flags take
precedence over the allow flags. For example, if you allow network access but
deny access to a specific domain, the deny flag will take precedence.

Deno also provides a `--allow-all` flag that grants all permissions to the
script. This **disables** the security sandbox entirely, and should be used with
caution. The `--allow-all` has the same security properties as running a script
in Node.js (ie none).

Definition: `-A, --allow-all`

```sh
deno run -A script.ts
deno run --allow-all script.ts
```

By default, Deno will not generate a stack trace for permission requests as it
comes with a hit to performance. Users can enable stack traces with the
`DENO_TRACE_PERMISSIONS` environment variable to `1`.

Deno can also generate an audit log of all accessed permissions, regardless of
whether the access was allowed or denied.

Set `DENO_AUDIT_PERMISSIONS` to a **file path** to write JSONL — each line is an
object with the following keys:

- `v`: the version of the format
- `datetime`: when the permission was accessed, in RFC 3339 format
- `permission`: the name of the permission
- `value`: the value that the permission was accessed with, or `null` if it was
  accessed with no value

A schema for this can be found in
[permission-audit.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/permission-audit.v1.json).

In addition, this env var can be combined with the above-mentioned
`DENO_TRACE_PERMISSIONS`, which then adds a new `stack` field to the entries
which is an array containing all the stack trace frames.

You can also set `DENO_AUDIT_PERMISSIONS=otel` to emit each access as an
OpenTelemetry **log record** instead of writing to a file. The records are sent
to whichever exporter you have configured via
[`OTEL_DENO`](/runtime/fundamentals/open_telemetry/) and carry these attributes:

- `deno.permission.type`
- `deno.permission.value`
- `deno.permission.stack` (if `DENO_TRACE_PERMISSIONS` is also set)

This is the recommended setup if you already collect OpenTelemetry data — the
permission audit lands next to your traces and metrics so you can correlate it
with request handling.

```sh
OTEL_DENO=true DENO_AUDIT_PERMISSIONS=otel deno run -A main.ts
```

## Configuration file

Deno supports storing permissions in the deno.json/deno.jsonc file. Read more
under [configuration](/runtime/reference/deno_json/#permissions).

## File system access

By default, executing code can not read or write arbitrary files on the file
system. This includes listing the contents of directories, checking for the
existence of a given file, and opening or connecting to Unix sockets.

Access to read files is granted using the `--allow-read` (or `-R`) flag, and
access to write files is granted using the `--allow-write` (or `-W`) flag. These
flags can be specified with a list of paths to allow access to specific files or
directories and any subdirectories in them.

Definition: `--allow-read[=<PATH>...]` or `-R[=<PATH>...]`

PATHs may be separated by comma (`,`) characters. To include a comma character
in the PATH, it must be doubled. (Example: `this file,, contains a comma.txt`)

```sh
# Allow all reads from file system
deno run -R script.ts
# or 
deno run --allow-read script.ts

# Allow reads from file foo.txt and bar.txt only
deno run --allow-read=foo.txt,bar.txt script.ts

# Allow reads from any file in any subdirectory of ./node_modules
deno run --allow-read=node_modules script.ts
```

Definition: `--deny-read[=<PATH>...]`

```sh
# Allow reading files in /etc but disallow reading /etc/hosts
deno run --allow-read=/etc --deny-read=/etc/hosts script.ts

# Deny all read access to disk, disabling permission prompts for reads.
deno run --deny-read script.ts
```

Definition: `--allow-write[=<PATH>...]` or `-W[=<PATH>...]`

```sh
# Allow all writes to file system
deno run -W script.ts
# or 
deno run --allow-write script.ts

# Allow writes to file foo.txt and bar.txt only
deno run --allow-write=foo.txt,bar.txt script.ts
```

Definition: `--deny-write[=<PATH>...]`

```sh
# Allow reading files in current working directory 
# but disallow writing to ./secrets directory.
deno run --allow-write=./ --deny-write=./secrets script.ts

# Deny all write access to disk, disabling permission prompts.
deno run --deny-write script.ts
```

Some APIs in Deno are implemented using file system operations under the hood,
even though they do not provide direct read/write access to specific files.
These APIs read and write to disk but do not require any explicit read/write
permissions. Some examples of these APIs are:

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

### Symbolic links

When reading or writing through a symbolic link, Deno checks permissions based
on the symlink's location, not the target it points to. This means if you have
`--allow-read=/app`, you can read through a symlink at `/app/link` even if it
points to a file outside `/app`.

However, Deno prevents privilege escalation through symlinks. If a symlink
resolves to a sensitive system path, additional permissions are required:

- **`/proc`, `/dev`, `/sys` (Linux)**: Reading or writing through symlinks that
  resolve to these paths requires `--allow-all`, as these paths can expose
  sensitive system information.
- **`/proc/**/environ`**: Requires `--allow-env` since it exposes environment
  variables.
- **`/dev/null`, `/dev/zero`, `/dev/random`, `/dev/urandom`**: These safe device
  files are always accessible without additional permissions.

Creating symlinks with [`Deno.symlink()`](/api/deno/~/Deno.symlink) requires
both `--allow-read` and `--allow-write` with full access (not path-specific),
because symlinks can point to arbitrary locations.

> **Note**: Symlinks that already exist on the filesystem can be read through
> using the permissions for the symlink's location. The full read/write
> permission requirement only applies to _creating_ new symlinks with
> [`Deno.symlink()`](/api/deno/~/Deno.symlink).

## Network access

By default, executing code can not make network requests, open network listeners
or perform DNS resolution. This includes making HTTP requests, opening TCP/UDP
sockets, and listening for incoming connections on TCP or UDP.

Network access is granted using the `--allow-net` flag. This flag can be
specified with a list of hosts to allow access to specific network addresses. A
host can be a hostname or IP address, optionally with a port.

Hostnames do not allow subdomains, unless explicitly listed. To allow any
subdomain for a hostname, `*` can be used as wildcard for any subdomain.

Definition: `--allow-net[=<HOST>...]` or `-N[=<HOST>...]`

```sh
# Allow network access
deno run -N script.ts
# or
deno run --allow-net script.ts

# Allow network access to github.com and jsr.io
deno run --allow-net=github.com,jsr.io script.ts

# Allow all subdomains for example.com
deno run --allow-net="*.example.com" script.ts

# A hostname at port 80:
deno run --allow-net=example.com:80 script.ts

# An IPv4 address on port 443
deno run --allow-net=1.1.1.1:443 script.ts

# An IPv6 address, all ports allowed
deno run --allow-net=[2606:4700:4700::1111] script.ts
```

Definition: `--deny-net[=<HOST>...]`

```sh
# Allow access to network, but deny access 
# to github.com and jsr.io
deno run --allow-net --deny-net=github.com,jsr.io script.ts

# Deny all network access, disabling permission prompts.
deno run --deny-net script.ts
```

During module loading, Deno can load modules from the network. By default Deno
allows loading modules from the following locations using both static and
dynamic imports, without requiring explicit network access:

- `https://deno.land/`
- `https://jsr.io/`
- `https://esm.sh/`
- `https://raw.esm.sh/`
- `https://cdn.jsdelivr.net/`
- `https://raw.githubusercontent.com/`
- `https://gist.githubusercontent.com/`

These locations are trusted "public good" registries that are not expected to
enable data exfiltration through URL paths. You can add more trusted registries
using the `--allow-import` flag.

In addition Deno allows importing any NPM package through `npm:` specifiers.

Deno also sends requests to `https://dl.deno.land/` at most once a day to check
for updates to the Deno CLI. This can be disabled using `DENO_NO_UPDATE_CHECK=1`
environment var.

## Environment variables

By default, executing code can not read or write environment variables. This
includes reading environment variables, and setting new values.

Access to environment variables is granted using the `--allow-env` flag. This
flag can be specified with a list of environment variables to allow access to
specific environment variables. Starting with Deno v2.1, you can now specify
suffix wildcards to allow “scoped” access to environmental variables.

Definition: `--allow-env[=<VARIABLE_NAME>...]` or `-E[=<VARIABLE_NAME>...]`

```sh
# Allow access to all environment variables
deno run -E script.ts
# or
deno run --allow-env script.ts

# Allow HOME and FOO environment variables
deno run --allow-env=HOME,FOO script.ts

# Allow access to all environment variables starting with AWS_
deno run --allow-env="AWS_*" script.ts
```

Definition: `--deny-env[=<VARIABLE_NAME>...]`

```sh
# Allow all environment variables except 
# AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
deno run \
  --allow-env \
  --deny-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY \
  script.ts

# Deny all access to env variables, disabling permission prompts.
deno run --deny-env script.ts
```

The `--ignore-env` flag is similar to `--deny-env`, but instead of denying
access outright, it silently returns `undefined` for any env variable reads.
This is useful when you want code to run without failing on missing permissions,
treating restricted variables as simply unset.

Definition: `--ignore-env[=<VARIABLE_NAME>...]`

```sh
# Ignore all environment variable reads (returns undefined).
deno run --ignore-env script.ts

# Ignore specific environment variables.
deno run --ignore-env=PORT,HOME script.ts
```

> Note for Windows users: environment variables are case insensitive on Windows,
> so Deno also matches them case insensitively (on Windows only).

Deno reads certain environment variables on startup, such as `DENO_DIR` and
`NO_COLOR` ([see the full list](/runtime/reference/env_variables/)).

The value of the `NO_COLOR` environment variable is visible to all code running
in the Deno runtime, regardless of whether the code has been granted permission
to read environment variables.

## System Information

By default, executing code can not access system information, such as the
operating system release, system uptime, load average, network interfaces, and
system memory information.

Access to system information is granted using the `--allow-sys` flag. This flag
can be specified with a list of allowed interfaces from the list defined in
[Deno.SysPermissionDescriptor](/api/deno/~/Deno.SysPermissionDescriptor). These
strings map to functions in the `Deno` namespace that provide OS info, like
[Deno.systemMemoryInfo](https://docs.deno.com/api/deno/~/Deno.SystemMemoryInfo).

Definition: `--allow-sys[=<API_NAME>...]` or `-S[=<API_NAME>...]`

```sh
# Allow all system information APIs
deno run -S script.ts
# or
deno run --allow-sys script.ts

# Allow systemMemoryInfo and osRelease APIs
deno run --allow-sys="systemMemoryInfo,osRelease" script.ts
```

Definition: `--deny-sys[=<API_NAME>...]`

```sh
# Allow accessing all system information but "networkInterfaces"
deno run --allow-sys --deny-sys="networkInterfaces" script.ts

# Deny all access to system information, disabling permission prompts.
deno run --deny-sys script.ts
```

The interface names accepted by `--allow-sys` correspond to the functions in the
`Deno` namespace that expose host information, such as `hostname`, `osRelease`,
`osUptime`, `loadavg`, `networkInterfaces`, `systemMemoryInfo`, `uid`, `gid`,
`username`, `cpus`, and `homedir`. See
[Deno.SysPermissionDescriptor](/api/deno/~/Deno.SysPermissionDescriptor) for the
full set of recognized names.

The same flag gates the equivalent Node-compatibility APIs. Functions in
[`node:os`](/api/node/os/) and [`node:process`](/api/node/process/) that read
system information, such as `os.hostname()`, `os.cpus()`,
`os.networkInterfaces()`, `os.freemem()`, `os.totalmem()`, `os.uptime()`,
`process.getuid()`, and `process.getgid()`, require `--allow-sys` and map onto
the same interface names. For example, calling `os.cpus()` needs
`--allow-sys=cpus`, and `os.networkInterfaces()` needs
`--allow-sys=networkInterfaces`.

## Subprocesses

Code executing inside of a Deno runtime can not spawn subprocesses by default,
as this would constitute a violation of the principle that code can not escalate
its privileges without user consent.

Deno provides a mechanism for executing subprocesses, but this requires explicit
permission from the user. This is done using the `--allow-run` flag.

Any subprocesses you spawn from your program run independently from the
permissions granted to the parent process. This means the child processes can
access system resources regardless of the permissions you granted to the Deno
process that spawned it. This is often referred to as privilege escalation.

Because of this, make sure you carefully consider if you want to grant a program
`--allow-run` access: it essentially invalidates the Deno security sandbox. If
you really need to spawn a specific executable, you can reduce the risk by
limiting which programs a Deno process can start by passing specific executable
names to the `--allow-run` flag.

Definition: `--allow-run[=<PROGRAM_NAME>...]`

```sh
# Allow running all subprocesses
deno run --allow-run script.ts

# Allow running "curl" and "whoami" subprocesses
deno run --allow-run="curl,whoami" script.ts
```

Sending a signal to your own process does not require `--allow-run`, since it is
equivalent to terminating yourself (like [`Deno.exit`](/api/deno/~/Deno.exit)).
`Deno.kill(Deno.pid, ...)` and `process.kill(process.pid, ...)` work without the
flag, so tools that re-raise a signal on their own PID (such as `signal-exit`,
used by Vite) no longer force you to grant blanket run access.

:::caution

You probably don't ever want to use `--allow-run=deno` unless the parent process
has `--allow-all`, as being able to spawn a `deno` process means the script can
spawn another `deno` process with full permissions.

:::

### Subprocesses with `LD_*` and `DYLD_*` environment variables

Spawning a subprocess with an environment variable whose name starts with `LD_`
(such as `LD_LIBRARY_PATH` or `LD_PRELOAD`) or `DYLD_` (such as
`DYLD_LIBRARY_PATH` or `DYLD_INSERT_LIBRARIES`) requires the unscoped
`--allow-run` flag. A scoped allow list like `--allow-run=curl` is _not_
sufficient, even when the value matches the one Deno was started with:

```ts
// Fails under `--allow-run=echo`, succeeds under `--allow-run` or `--allow-all`.
new Deno.Command("echo", {
  args: ["hello"],
  env: { LD_PRELOAD: "/path/to/lib.so" },
}).outputSync();
```

```console
NotCapable: Requires --allow-run permissions to spawn subprocess with LD_PRELOAD
environment variable. Alternatively, spawn with the environment variable unset.
```

These variables instruct the dynamic linker to load arbitrary shared libraries
into the child process, so they can run code in the subprocess regardless of
which executable you allowed. Restricting them to the unscoped `--allow-run`
keeps a scoped allow list from being silently bypassed. If you don't need them,
the simplest fix is to spawn the subprocess with the variable unset.

Definition: `--deny-run[=<PROGRAM_NAME>...]`

```sh
# Allow running running all programs, but "whoami" and "ps".
deno run --allow-run --deny-run="whoami,ps" script.ts

# Deny all access for spawning subprocessing, disabling
# permission prompts.
deno run --deny-run script.ts
```

By default `npm` packages will not have their post-install scripts executed
during installation (like with `deno install`), as this would allow arbitrary
code execution. When running with the `--allow-scripts` flag, post-install
scripts for npm packages will be executed as a subprocess.

## FFI (Foreign Function Interface)

Deno provides an
[FFI mechanism for executing code written in other languages](/runtime/fundamentals/ffi/),
such as Rust, C, or C++, from within a Deno runtime. This is done using the
[`Deno.dlopen`](/api/deno/~/Deno.dlopen) API, which can load shared libraries
and call functions from them.

By default, executing code can not use the
[`Deno.dlopen`](/api/deno/~/Deno.dlopen) API, as this would constitute a
violation of the principle that code can not escalate its privileges without
user consent.

In addition to [`Deno.dlopen`](/api/deno/~/Deno.dlopen), FFI can also be used
via Node-API (NAPI) native addons. These are also not allowed by default.

Both [`Deno.dlopen`](/api/deno/~/Deno.dlopen) and NAPI native addons require
explicit permission using the `--allow-ffi` flag. This flag can be specified
with a list of files or directories to allow access to specific dynamic
libraries.

_Like subprocesses, dynamic libraries are not run in a sandbox and therefore do
not have the same security restrictions as the Deno process they are being
loaded into. Therefore, use with extreme caution._

Definition: `--allow-ffi[=<PATH>...]`

```sh
# Allow loading dynamic all libraries
deno run --allow-ffi script.ts

# Allow loading dynamic libraries from a specific path
deno run --allow-ffi=./libfoo.so script.ts
```

Definition: `--deny-ffi[=<PATH>...]`

```sh
# Allow loading all dynamic libraries, but ./libfoo.so
deno run --allow-ffi --deny-ffi=./libfoo.so script.ts

# Deny loading all dynamic libraries, disabling permission prompts.
deno run --deny-ffi script.ts
```

## Importing from the Web

Allow importing code from the Web. By default Deno limits hosts you can import
code from. This is true for both static and dynamic imports.

If you want to dynamically import code, either using the `import()` or the
`new Worker()` APIs, additional permissions need to be granted. Importing from
the local file system [requires `--allow-read`](#file-system-access), but Deno
also allows to import from `http:` and `https:` URLs. In such case you will need
to specify an explicit `--allow-import` flag:

```sh
# allow importing code from `https://example.com`
$ deno run --allow-import=example.com main.ts
```

By default Deno allows importing sources from following hosts:

- `deno.land`
- `jsr.io`
- `esm.sh`
- `raw.esm.sh`
- `cdn.jsdelivr.net`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`

Imports are only allowed using HTTPS.

This allow list is applied by default for static imports, and by default to
dynamic imports if the `--allow-import` flag is specified.

```sh
# allow dynamically importing code from `https://deno.land`
$ deno run --allow-import main.ts
```

Note that specifying an allow list for `--allow-import` will override the list
of default hosts.

Use `--deny-import` to block importing from specific hosts, even when they would
otherwise be allowed. Deny flags take precedence over allow flags:

```sh
# allow the default import hosts, except esm.sh
$ deno run --deny-import=esm.sh main.ts
```
