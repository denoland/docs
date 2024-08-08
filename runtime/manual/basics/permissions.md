---
title: "Permissions"
oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
---

Deno is secure by default. Therefore, unless you specifically enable it, a
program run with Deno has no file, network, or environment access. Access to
security sensitive functionality requires that permissions have been granted to
an executing script through command line flags, or a runtime permission prompt.
This is a major difference from Node, where dependencies are automatically
granting full access to everything, introducing hidden vulnerabilities in your
project.

## Run untrusted code with confidence

Since Deno provides no I/O access by default, it's useful for running untrusted
code and auditing third-party code. If you're building or extending a platform
that runs user generated code, you can use Deno for running third-party code
securely and host this code through
[Deno Subhosting](https://deno.com/subhosting) or any other cloud platform of
your choice.

For the following example `mod.ts` has been granted read-only access to the file
system. It cannot write to the file system, or perform any other security
sensitive functions.

```shell
deno run --allow-read mod.ts
```

## Permissions list

The following permissions are available:

### Environment access

Allow or deny environment access for things like getting and setting of
environment variables. You can specify an optional, comma-separated list of
environment variables to provide an allow-list of allowed environment variables
or a deny-list of environment variables.

> Note for Windows users: environment variables are case insensitive on Windows,
> so Deno also matches them case insensitively (on Windows only).

Definition: `--allow-env[=<VARIABLE_NAME>...]`

```sh
# Allow access to all environment variables
deno run --allow-env script.ts
# Allow HOME and FOO environment variable
deno run --allow-env=HOME,FOO script.ts
```

Definition: `--deny-env[=<VARIABLE_NAME>...]`

```sh
# Deny access to all environment variables
deno run --deny-env script.ts
# Deny access to HOME and FOO environment variable
deno run --deny-env=HOME,FOO script.ts
```

_Any environment variables specified in `--deny-env[=<VARIABLE_NAME>...]` will
be denied access, even if they are specified in `--allow-env`._

```sh
# Allow all environment variables except AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.
deno run --allow-env --deny-env=AWS_ACCESS_KEY_ID,AWS_SECRET_ACCESS_KEY script.ts
```

### FFI (Foreign Function Interface)

<a name="ffi"></a>

🚧 This is an unstable feature

Allow or deny loading of dynamic libraries. You can specify an optional,
comma-separated list of directories or files to provide an allow-list of allowed
dynamic libraries to load or a deny-list of libraries to deny loading.

_Dynamic libraries are not run in a sandbox and therefore do not have the same
security restrictions as the Deno process. Therefore, use with caution._

Definition: `--allow-ffi[=<PATH>...]`

```sh
# Allow loading dynamic libraries
deno run --allow-ffi script.ts
# Allow loading dynamic libraries from a specific path
deno run --allow-ffi=./libfoo.so script.ts
```

Definition: `--deny-ffi[=<PATH>...]`

```sh
# Deny loading dynamic libraries
deno run --deny-ffi script.ts
# Deny loading dynamic libraries from a specific path
deno run --deny-ffi=./libfoo.so script.ts
```

_Any libraries specified with `--deny-ffi[=<PATH>...]` will be denied access,
even if they are specified in `--allow-ffi`._

### High Resolution Time

Allow orr deny high resolution time (nanosecond precision time measurement). Can
be used in timing attacks and fingerprinting.

Definition: `--allow-hrtime`

```sh
# Allow high resolution time measurement
deno run --allow-hrtime script.ts
```

Definition: `--deny-hrtime`

```sh
# Deny high resolution time measurement
deno run --deny-hrtime script.ts
```

### Network access

Allow or deny network access. You can specify an optional, comma-separated list
of IP addresses or hostnames (optionally with ports) to provide an allow-list of
allowed network addresses or a deny-list of denied network addresses.

Definition: `--allow-net[=<IP_OR_HOSTNAME>...]`

```sh
# Allow network access
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
# Deny network access
deno run --deny-net script.ts
# Deny network access to github.com and jsr.io
deno run --deny-net=github.com,jsr.io script.ts
```

_Any addresses specified in the deny-list will be denied access, even if they
are specified in `--allow-net`._

### File System Read Access

Allow or deny file system read access. You can specify an optional,
comma-separated list of directories or files to provide an allow-list of allowed
file system access or a deny-list of denied file system access respectively.

Definition: `--allow-read[=<PATH>...]`

```sh
# Allow all reads from file system
deno run --allow-read script.ts
# Allow reads from file foo.txt and bar.txt only
deno run --allow-read=foo.txt,bar.txt script.ts
```

Definition: `--deny-read[=<PATH>...]`

```sh
# Deny reads from file system
deno run --deny-read script.ts
# Deny reads from file foo.txt and bar.txt only
deno run --deny-read=foo.txt,bar.txt script.ts
```

_Any paths specified in the deny-list will be denied access, even if they are
specified in `--allow-read`._

```sh
# Allow reading files in /etc but disallow reading /etc/hosts
deno run --allow-read=/etc --deny-read=/etc/hosts script.ts
```

### Running Subprocesses

Allow or deny running subprocesses. You can specify an optional, comma-separated
list of subprocesses to provide an allow-list of allowed subprocesses or a
deny-list of denied subprocesses.

Any subprocesses you spawn in you program runs independently of the permission
you granted to the parent process. This means the child processes can access
system resources regardless of the permissions you granted to the Deno process
that spawned it. This is often referred to as privilege escalation.

Because of this, make sure you carefully consider if you want to grant a program
`--allow-run` access: it essentially invalidates the Deno security sandbox. If
you really need to spawn a specific executable, you can reduce the risk by
limiting which programs a Deno process can start by passing specific executable
names to the `--allow-run` flag.

Definition: `--allow-run[=<PROGRAM_NAME>...]`

```sh
# Allow running subprocesses
deno run --allow-run script.ts
# Allow running "whoami" and "ps" subprocesses
deno run --allow-run="whoami,ps" script.ts
```

Definition: `--deny-run[=<PROGRAM_NAME>...]`

```sh
# Deny running subprocesses
deno run --deny-run script.ts
# Deny running "whoami" and "ps" subprocesses
deno run --deny-run="whoami,ps" script.ts
```

_Any programs specified with `--deny-run[=<PROGRAM_NAME>...]` will be denied
access, even if they are specified in `--allow-run`._

### System Information

Allow or deny access to APIs that provide information about user's operating
system, eg. `Deno.osRelease()` and `Deno.systemMemoryInfo()`. You can specify a
comma-separated list of allowed interfaces from the following list: `hostname`,
`osRelease`, `osUptime`, `loadavg`, `networkInterfaces`, `systemMemoryInfo`,
`uid`, and `gid`. These strings map to functions in the `Deno` namespace that
provide OS info, like
[Deno.systemMemoryInfo](https://docs.deno.com/api/deno/~/Deno.SystemMemoryInfo).

Definition: `--allow-sys[=<API_NAME>...]`

```sh
# Allow all system information APIs
deno run --allow-sys script.ts
# Allow systemMemoryInfo and osRelease APIs
deno run --allow-sys="systemMemoryInfo,osRelease" script.ts
```

Definition: `--deny-sys[=<API_NAME>...]`

```sh
# Deny all system information APIs
deno run --deny-sys script.ts
# Deny systemMemoryInfo and osRelease APIs
deno run --deny-sys="systemMemoryInfo,osRelease" script.ts
```

### File System Write Access

Allow or deny file system write access. You can specify an optional,
comma-separated list of directories or files to provide an allow-list of allowed
file system access or a deny-list of denied file system access respectively.

Definition: `--allow-write[=<PATH>...]`

```sh
# Allow all writes to file system
deno run --allow-write script.ts
# Allow writes to file foo.txt and bar.txt only
deno run --allow-write=foo.txt,bar.txt script.ts
```

Definition: `--deny-write[=<PATH>...]`

```sh
deno run --deny-write script.ts
# Deny writes to file foo.txt and bar.txt only
deno run --deny-write=foo.txt,bar.txt script.ts
```

_Any paths specified with `--deny-write[=<PATH>...]` will be denied access, even
if they are specified in `--allow-write`.

### Certification errors

Disables verification of TLS certificates. This is a dangerous flag, use it with
caution.

Definition: `--unsafely-ignore-certificate-errors[=<HOSTNAMES>...]`

```sh
deno run --unsafely-ignore-certificate-errors script.ts
```

### All Permissions

Allow all permissions. This enables all security sensitive functions. Use with
caution.

Definition: `-A, --allow-all`

```sh
deno run -A script.s
deno run --allow-all scrip
```
