---
title: "Security and permissions"
description: "A guide to Deno's security model and permissions system. Learn about secure defaults, permission flags, runtime prompts, and how to safely execute code with granular access controls."

oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
  - /runtime/manual/basics/permissions
  - /runtime/manual/getting_started/permissions
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

## Key Principles

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
- **The initial static module graph can import local files without
  restrictions**: All files that are imported in the initial static module graph
  can be imported without restrictions, so even if an explicit read permission
  is not granted for that file. This does not apply to any dynamic module
  imports.

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

Users can also explicitly disallow access to specific resources by using the
`--deny-read`, `--deny-write`, `--deny-net`, `--deny-env`, and `--deny-run`
flags. These flags take precedence over the allow flags. For example, if you
allow network access but deny access to a specific domain, the deny flag will
take precedence.

Deno also provides a `--allow-all` flag that grants all permissions to the
script. This **disables** the security sandbox entirely, and should be used with
caution. The `--allow-all` has the same security properties as running a script
in Node.js (ie none).

Definition: `-A, --allow-all`

```sh
deno run -A script.ts
deno run --allow-all script.ts
```

### File system access

By default, executing code can not read or write arbitrary files on the file
system. This includes listing the contents of directories, checking for the
existence of a given file, and opening or connecting to Unix sockets.

Access to read files is granted using the `--allow-read` (or `-R`) flag, and
access to write files is granted using the `--allow-write` (or `-W`) flag. These
flags can be specified with a list of paths to allow access to specific files or
directories.

Definition: `--allow-read[=<PATH>...]` or `-R[=<PATH>...]`

```sh
# Allow all reads from file system
deno run -R script.ts
# or 
deno run --allow-read script.ts

# Allow reads from file foo.txt and bar.txt only
deno run --allow-read=foo.txt,bar.txt script.ts
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

### Network access

By default, executing code can not make network requests, open network listeners
or perform DNS resolution. This includes making HTTP requests, opening TCP/UDP
sockets, and listening for incoming connections on TCP or UDP.

Network access is granted using the `--allow-net` flag. This flag can be
specified with a list of IP addresses or hostnames to allow access to specific
network addresses.

Definition: `--allow-net[=<IP_OR_HOSTNAME>...]` or `-N[=<IP_OR_HOSTNAME>...]`

```sh
# Allow network access
deno run -N script.ts
# or
deno run --allow-net script.ts

# Allow network access to github.com and jsr.io
deno run --allow-net=github.com,jsr.io script.ts

# A hostname at port 80:
deno run --allow-net=example.com:80 script.ts

# An IPv4 address on port 443
deno run --allow-net=1.1.1.1:443 script.ts

# An IPv6 address, all ports allowed
deno run --allow-net=[2606:4700:4700::1111] script.ts
```

Definition: `--deny-net[=<IP_OR_HOSTNAME>...]`

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
- `https://raw.githubusercontent.com`
- `https://gist.githubusercontent.com`

These locations are trusted "public good" registries that are not expected to
enable data exfiltration through URL paths. You can add more trusted registries
using the `--allow-imports` flag.

In addition Deno allows importing any NPM package through `npm:` specifiers.

Deno also sends requests to `https://dl.deno.land/` at most once a day to check
for updates to the Deno CLI. This can be disabled using `DENO_NO_UPDATE_CHECK=1`
environment var.

### Environment variables

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

> Note for Windows users: environment variables are case insensitive on Windows,
> so Deno also matches them case insensitively (on Windows only).

Deno reads certain environment variables on startup, such as `DENO_DIR` and
`NO_COLOR` ([see the full list](/runtime/reference/cli/env_variables/)).

The value of the `NO_COLOR` environment variable is visible to all code running
in the Deno runtime, regardless of whether the code has been granted permission
to read environment variables.

### System Information

By default, executing code can not access system information, such as the
operating system release, system uptime, load average, network interfaces, and
system memory information.

Access to system information is granted using the `--allow-sys` flag. This flag
can be specified with a list of allowed interfaces from the following list:
`hostname`, `osRelease`, `osUptime`, `loadavg`, `networkInterfaces`,
`systemMemoryInfo`, `uid`, and `gid`. These strings map to functions in the
`Deno` namespace that provide OS info, like
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

### Subprocesses

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

:::caution

You probably don't ever want to use `--allow-run=deno` unless the parent process
has `--allow-all`, as being able to spawn a `deno` process means the script can
spawn another `deno` process with full permissions.

:::

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

### FFI (Foreign Function Interface)

Deno provides a mechanism for executing code written in other languages, such as
Rust, C, or C++, from within a Deno runtime. This is done using the
`Deno.dlopen` API, which can load shared libraries and call functions from them.

By default, executing code can not use the `Deno.dlopen` API, as this would
constitute a violation of the principle that code can not escalate it's
privileges without user consent.

In addition to `Deno.dlopen`, FFI can also be used via Node-API (NAPI) native
addons. These are also not allowed by default.

Both `Deno.dlopen` and NAPI native addons require explicit permission using the
`--allow-ffi` flag. This flag can be specified with a list of files or
directories to allow access to specific dynamic libraries.

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

### Importing from the Web

Allow importing code from the Web. By default Deno limits hosts you can import
code from. This is true for both static and dynamic imports.

If you want to dynamically import code, either using the `import()` or the
`new Worker()` APIs, additional permissions need to be granted. Importing from
the local file system [requires `--allow-read`](#file-system-read-access), but
Deno also allows to import from `http:` and `https:` URLs. In such case you will
need to specify an explicit `--allow-import` flag:

```
# allow importing code from `https://example.com`
$ deno run --allow-import=example.com main.ts
```

By default Deno allows importing sources from following hosts:

- `deno.land`
- `esm.sh`
- `jsr.io`
- `cdn.jsdelivr.net`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`

**Imports are only allowed using HTTPS**

This allow list is applied by default for static imports, and by default to
dynamic imports if the `--allow-import` flag is specified.

```
# allow dynamically importing code from `https://deno.land`
$ deno run --allow-import main.ts
```

Note that specifying an allow list for `--allow-import` will override the list
of default hosts.

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
- Use OS provided sandboxing mechanisms like `chroot`, `cgroups`, `seccomp`,
  etc.
- Use a sandboxed environment like a VM or MicroVM (gVisor, Firecracker, etc).
