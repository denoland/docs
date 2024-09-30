---
title: "Security and permissions"
oldUrl:
  - /runtime/manual/basics/permissionsDeno/
  - /manual/basics/permissions
  - /runtime/manual/basics/permissions
  - /runtime/manual/getting_started/permissions
---

Deno is secure by default. Unless you specifically enable it, a program run with
Deno has no access to sensitive APIs, such as file system access, network
connectivity, or environment access. You must explicitly grant access to these
resources with command line flags or with the runtime permission prompt. This is
a major difference from Node, where dependencies are automatically granted full
access to everything, potentially introducing hidden vulnerabilities into your
project.

## Granting permissions

To grant a permission to a script, you can use the `--allow-<PERMISSION>` flag
when running the script. For example, to grant read access to the file system,
you can use the `--allow-read` or short`-R` flag:

```shell
deno run --allow-read mod.ts
```

`mod.ts` has been granted read-only access to the file system. It cannot write
to the file system, or perform any other security sensitive functions. For more
examples of what you can do with different permissions, check out
[Deno by Example](/examples/).

## Denying permissions

Although permissions are denied by default, you can explicitly deny permissions
to provide additional security and clarity.

If you use both `--allow-*` and `--deny-*` flags, the deny flags take
precedence. This allows you to fine-tune permissions more precisely. For
example, you might allow network access but deny access to specific domains:

```shell
deno run --allow-net --deny-net=example.com script.ts
```

Explicitly denying permissions can prevent accidental access to sensitive
resources, especially in complex projects where multiple scripts and
dependencies are involved.

```shell
deno run --allow-read --deny-read=secrets.txt script.ts
# or
deno run --allow-read=/Users --deny-read=/Users/baduser script.ts
```

By explicitly denying permissions, you make your intentions clear in the code.
This can be useful for documentation or for other developers who might work on
the project, ensuring they understand which permissions are intentionally
restricted.

## Run untrusted code with confidence

Since Deno provides no I/O access by default, it is a great fit for running
untrusted code and auditing third-party code. If you're building or extending a
platform that runs user generated code, you can use Deno for running third-party
code securely and host this code through
[Deno Subhosting](https://deno.com/subhosting) or any other cloud platform of
your choice.

## Permissions list

The following permissions are available:

### Environment access

Allow or deny environment access for getting and setting of environment
variables. You can specify an optional, comma-separated list of environment
variables to provide an allow-list of allowed environment variables or a
deny-list of environment variables.

> Note for Windows users: environment variables are case insensitive on Windows,
> so Deno also matches them case insensitively (on Windows only).

Definition: `--allow-env[=<VARIABLE_NAME>...]` or `-E[=<VARIABLE_NAME>...]`

```sh
# Allow access to all environment variables
deno run -E script.ts
# or
deno run --allow-env script.ts

# Allow HOME and FOO environment variable
deno run --allow-env=HOME,FOO script.ts
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

_Any environment variables specified in `--deny-env[=<VARIABLE_NAME>...]` will
be denied access, even if they are specified in `--allow-env`._

### File System Read Access

Allow or deny file system read access. You can specify an optional,
comma-separated list of directories or files to provide an allow-list of allowed
file system access or a deny-list of denied file system access respectively.

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

# Deny all read access to disk, disabling permission prompts.
deno run --deny-env script.ts
```

_Any paths specified in the deny-list will be denied access, even if they are
specified in `--allow-read`._

### File System Write Access

Allow or deny file system write access. You can specify an optional,
comma-separated list of directories or files to provide an allow-list of allowed
file system access or a deny-list of denied file system access respectively.

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
deno run --deny-env script.ts
```

_Any paths specified with `--deny-write[=<PATH>...]` will be denied access, even
if they are specified in `--allow-write`._

### Network access

Allow or deny network access. You can specify an optional, comma-separated list
of IP addresses or hostnames (optionally with ports) to provide an allow-list of
allowed network addresses or a deny-list of denied network addresses.

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
deno run --allow-net=1.1.1.1:443 script.

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

_Any addresses specified in the deny-list will be denied access, even if they
are specified in `--allow-net`._

### System Information

Allow or deny access to APIs that provide information about user's operating
system, eg. `Deno.osRelease()` and `Deno.systemMemoryInfo()`. You can specify a
comma-separated list of allowed interfaces from the following list: `hostname`,
`osRelease`, `osUptime`, `loadavg`, `networkInterfaces`, `systemMemoryInfo`,
`uid`, and `gid`. These strings map to functions in the `Deno` namespace that
provide OS info, like
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

_Any values specified in the deny-list will be denied access, even if they are
specified in `--allow-sys`._

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
# Allow running all subprocesses
deno run --allow-run script.ts

# Allow running "curl" and "whoami" subprocesses
deno run --allow-run="curl,whoami" script.ts
```

:::caution

You probably don't ever want to use `--allow-run=deno` as being able to spawn a
`deno` process means the script can spawn another `deno` process with full
permissions.

:::

Definition: `--deny-run[=<PROGRAM_NAME>...]`

```sh
# Allow running running all programs, but "whoami" and "ps".
deno run --allow-run --deny-run="whoami,ps" script.ts

# Deny all access for spawning subprocessing, disabling
# permission prompts.
deno run --deny-run script.ts
```

_Any programs specified with `--deny-run[=<PROGRAM_NAME>...]` will be denied
access, even if they are specified in `--allow-run`._

### FFI (Foreign Function Interface)

Allow or deny loading of dynamic libraries. You can specify an optional,
comma-separated list of directories or files to provide an allow-list of allowed
dynamic libraries to load or a deny-list of libraries to deny loading.

_Dynamic libraries are not run in a sandbox and therefore do not have the same
security restrictions as the Deno process. Therefore, use with caution._

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

_Any libraries specified with `--deny-ffi[=<PATH>...]` will be denied access,
even if they are specified in `--allow-ffi`._

### All Permissions

Allow all permissions. This enables all security sensitive functions. Use with
caution.

Definition: `-A, --allow-all`

```sh
deno run -A script.s
deno run --allow-all scrip
```

### Importing from the Web

Allow importing code from the Web. By default Deno limits hosts you can import
code from. This is true for both static and dynamic imports.

If you want to dynamic import code - either using `import()` or `new Worker()`
API an additional permissions need to be granted. Importing from local file
system [requires `--allow-read`](#file-system-read-access), but Deno also allows
to import from `http:` and `https:` URLs. In such case you will need to specify
an explicit `--allow-import` flag:

```
# allow importing code from `https://example.com`
$ deno run --allow-import=example.com main.ts
```

By default Deno allows to import sources from following hosts:

- `deno.land`
- `esm.sh`
- `jsr.io`
- `raw.githubusercontent.com`
- `gist.githubusercontent.com`

**Imports are only allowed using HTTPS**

This allow list is applied by default for static imports, and by default if
`--allow-import` flag is specified.

```
# allow dynamically importing code from `https://deno.land`
$ deno run --allow-import main.ts
```

Note, that specifying an allow list for `--allow-import` will override the list
of default hosts.

### TLS certificates errors

Disables verification of TLS certificates. This is a dangerous flag, use it with
caution.

Definition: `--unsafely-ignore-certificate-errors[=<HOSTNAMES>...]`

```sh
deno run --unsafely-ignore-certificate-errors script.ts
```
