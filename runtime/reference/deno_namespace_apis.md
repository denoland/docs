---
title: "Deno Namespace APIs"
oldUrl:
- /runtime/manual/runtime/
- /runtime/manual/runtime/builtin_apis/
- /runtime/manual/runtime/permission_apis/
- /runtime/manual/runtime/import_meta_api/
- /runtime/manual/runtime/ffi_api/
- /runtime/manual/runtime/program_lifecycle/
---

The global `Deno` namespace contains APIs that are not web standard, including
APIs for reading from files, opening TCP sockets, serving HTTP, and executing
subprocesses, etc.

<a href="/api/deno/" class="docs-cta runtime-cta">Explore all Deno APIs</a>

Below we highlight some of the most important Deno APIs to know.

## File System

The Deno runtime comes with
[various functions for working with files and directories](/api/deno/file-system).
You will need to use --allow-read and --allow-write permissions to gain access
to the file system.

Refer to the links below for code examples of how to use the file system
functions.

- [Reading files in several different ways](/learn/examples/reading-files/)
- [Reading files in streams](/learn/runtime/tutorials/file_server/)
- [Reading a text file (`Deno.readTextFile`)](/learn/examples/reading-files/)
- [Writing a text file (`Deno.writeTextFile`)](/learn/examples/writing-files/)

## Network

The Deno runtime comes with
[built-in functions for dealing with connections to network ports](/api/deno/network).

Refer to the links below for code examples for common functions.

- [Connect to the hostname and port (`Deno.connect`)](/api/deno/~/Deno.connect)
- [Announcing on the local transport address (`Deno.listen`)](/api/deno/~/Deno.listen)

## Subprocesses

The Deno runtime comes with
[built-in functions for spinning up subprocesses](/api/deno/sub-process).

Refer to the links below for code samples of how to create a subprocess.

- [Creating a subprocess (`Deno.Command`)](/runtime/tutorials/subprocess/)

## Errors

The Deno runtime comes with [20 error classes](/api/deno/errors) that can be
raised in response to a number of conditions.

Some examples are:

```sh
Deno.errors.NotFound;
Deno.errors.WriteZero;
```

They can be used as below:

```ts
try {
  const file = await Deno.open("./some/file.txt");
} catch (error) {
  if (error instanceof Deno.errors.NotFound) {
    console.error("the file was not found");
  } else {
    // otherwise re-throw
    throw error;
  }
}
```

## HTTP Server

Deno has two HTTP Server APIs:

- [`Deno.serve`](/api/deno/~/Deno.serve): native, _higher-level_, supports
  HTTP/1.1 and HTTP2, this is the preferred API to write HTTP servers in Deno.
- [`Deno.serveHttp`](/api/deno/~/Deno.serveHttp): native, _low-level_, supports
  HTTP/1.1 and HTTP2.

To start an HTTP server on a given port, use the `Deno.serve` function. This
function takes a handler function that will be called for each incoming request,
and is expected to return a response (or a promise resolving to a response). For
example:

```ts
Deno.serve((_req) => {
  return new Response("Hello, World!");
});
```

By default `Deno.serve` will listen on port `8000`, but this can be changed by
passing in a port number in options bag as the first or second argument.

You can
[read more about how to use the HTTP server APIs](/runtime/fundamentals/http_server/).

## Permissions

Permissions are granted from the CLI when running the `deno` command. User code
will often assume its own set of required permissions, but there is no guarantee
during execution that the set of **granted** permissions will align with this.

In some cases, ensuring a fault-tolerant program requires a way to interact with
the permission system at runtime.

### Permission descriptors

On the CLI, read permission for `/foo/bar` is represented as
`--allow-read=/foo/bar`. In runtime JS, it is represented as the following:

```ts
const desc = { name: "read", path: "/foo/bar" } as const;
```

Other examples:

```ts
// Global write permission.
const desc1 = { name: "write" } as const;

// Write permission to `$PWD/foo/bar`.
const desc2 = { name: "write", path: "foo/bar" } as const;

// Global net permission.
const desc3 = { name: "net" } as const;

// Net permission to 127.0.0.1:8000.
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;

// High-resolution time permission.
const desc5 = { name: "hrtime" } as const;
```

See [`PermissionDescriptor`](/api/deno/~/Deno.PermissionDescriptor) in API
reference for more details. Synchronous API counterparts (ex.
`Deno.permissions.querySync`) exist for all the APIs described below.

### Query permissions

Check, by descriptor, if a permission is granted or not.

```ts
// deno run --allow-read=/foo main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "granted", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

If `--deny-read` flag was used to restrict some of the filepaths, the result
will contain `partial: true` describing that not all subpaths have permissions
granted:

```ts
// deno run --allow-read=/foo --deny-read=/foo/bar main.ts

const desc1 = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.query(desc1));
// PermissionStatus { state: "granted", partial: true }

const desc2 = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.query(desc2));
// PermissionStatus { state: "denied", partial: false }

const desc3 = { name: "read", path: "/bar" } as const;
console.log(await Deno.permissions.query(desc3));
// PermissionStatus { state: "prompt", partial: false }
```

### Permission states

A permission state can be either "granted", "prompt" or "denied". Permissions
which have been granted from the CLI will query to `{ state: "granted" }`. Those
which have not been granted query to `{ state: "prompt" }` by default, while
`{ state: "denied" }` reserved for those which have been explicitly refused.
This will come up in [Request permissions](#request-permissions).

### Permission strength

The intuitive understanding behind the result of the second query in
[Query permissions](#query-permissions) is that read access was granted to
`/foo` and `/foo/bar` is within `/foo` so `/foo/bar` is allowed to be read. This
hold true, unless the CLI-granted permission is _partial_ to the queried
permissions (as an effect of using a `--deny-*` flag).

We can also say that `desc1` is
_[stronger than](https://www.w3.org/TR/permissions/#ref-for-permissiondescriptor-stronger-than)_
`desc2`. This means that for any set of CLI-granted permissions:

1. If `desc1` queries to `{ state: "granted", partial: false }` then so must
   `desc2`.
2. If `desc2` queries to `{ state: "denied", partial: false }` then so must
   `desc1`.

More examples:

```ts
const desc1 = { name: "write" } as const;
// is stronger than
const desc2 = { name: "write", path: "/foo" } as const;

const desc3 = { name: "net", host: "127.0.0.1" } as const;
// is stronger than
const desc4 = { name: "net", host: "127.0.0.1:8000" } as const;
```

### Request permissions

Request an ungranted permission from the user via CLI prompt.

```ts
// deno run main.ts

const desc1 = { name: "read", path: "/foo" } as const;
const status1 = await Deno.permissions.request(desc1);
// ⚠️ Deno requests read access to "/foo". Grant? [y/n (y = yes allow, n = no deny)] y
console.log(status1);
// PermissionStatus { state: "granted", partial: false }

const desc2 = { name: "read", path: "/bar" } as const;
const status2 = await Deno.permissions.request(desc2);
// ⚠️ Deno requests read access to "/bar". Grant? [y/n (y = yes allow, n = no deny)] n
console.log(status2);
// PermissionStatus { state: "denied", partial: false }
```

If the current permission state is "prompt", a prompt will appear on the user's
terminal asking them if they would like to grant the request. The request for
`desc1` was granted so its new status is returned and execution will continue as
if `--allow-read=/foo` was specified on the CLI. The request for `desc2` was
denied so its permission state is downgraded from "prompt" to "denied".

If the current permission state is already either "granted" or "denied", the
request will behave like a query and just return the current status. This
prevents prompts both for already granted permissions and previously denied
requests.

### Revoke permissions

Downgrade a permission from "granted" to "prompt".

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
```

What happens when you try to revoke a permission which is _partial_ to one
granted on the CLI?

```ts
// deno run --allow-read=/foo main.ts

const desc = { name: "read", path: "/foo/bar" } as const;
console.log(await Deno.permissions.revoke(desc));
// PermissionStatus { state: "prompt", partial: false }
const cliDesc = { name: "read", path: "/foo" } as const;
console.log(await Deno.permissions.revoke(cliDesc));
// PermissionStatus { state: "prompt", partial: false }
```

The CLI-granted permission, which implies the revoked permission, was also
revoked.

To understand this behavior, imagine that Deno stores an internal set of
_explicitly granted permission descriptors_. Specifying `--allow-read=/foo,/bar`
on the CLI initializes this set to:

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
];
```

Granting a runtime request for `{ name: "write", path: "/foo" }` updates the set
to:

```ts
[
  { name: "read", path: "/foo" },
  { name: "read", path: "/bar" },
  { name: "write", path: "/foo" },
];
```

Deno's permission revocation algorithm works by removing every element from this
set which is _stronger than_ the argument permission descriptor.

Deno does not allow "fragmented" permission states, where some strong permission
is granted with exclusions of weak permissions implied by it. Such a system
would prove increasingly complex and unpredictable as you factor in a wider
variety of use cases and the `"denied"` state. This is a calculated trade-off of
granularity for security.

## import.meta

Deno supports a number of properties and methods on the
[`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
API. It can be used to get information about the module, such as the module's
URL.

### import.meta.url

Returns the URL of the current module.

```ts title="main.ts"
console.log(import.meta.url);
```

```sh
$ deno run main.ts
file:///dev/main.ts

$ deno run https:/example.com/main.ts
https://example.com/main.ts
```

### import.meta.main

Returns whether the current module is the entry point to your program.

```ts title="main.ts"
import "./other.ts";

console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```ts title="other.ts"
console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```sh
$ deno run main.ts
Is file:///dev/other.ts the main module? false
Is file:///dev/main.ts the main module? true
```

### import.meta.filename

_This property is only available for local modules (module that have
`file:///...` specifier) and returns `undefined` for remote modules._

Returns the fully resolved path to the current module. The value contains OS
specific path separators.

```ts title="main.ts"
console.log(import.meta.filename);
```

On Unix:

```sh
$ deno run main.ts
/dev/main.ts

$ deno run https://example.com/main.ts
undefined
```

On Windows:

```sh
$ deno run main.ts
C:\dev\main.ts

$ deno run https://example.com/main.ts
undefined
```

### import.meta.dirname

_This property is only available for local modules (module that have
`file:///...` specifier) and returns `undefined` for remote modules._

Returns the fully resolved path to the directory containing the current module.
The value contains OS specific path separators.

```ts title="main.ts"
console.log(import.meta.dirname);
```

On Unix:

```sh
$ deno run main.ts
/dev/

$ deno run https://example.com/main.ts
undefined
```

On Windows:

```sh
$ deno run main.ts
C:\dev\

$ deno run https://example.com/main.ts
undefined
```

### import.meta.resolve

Resolve specifiers relative to the current module.

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

The `import.meta.resolve` API takes into account the currently applied import
map, which gives you the ability to resolve "bare" specifiers as well.

With such import map loaded...

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

...you can now resolve:

```js title="resolve.js"
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```

## FFI

The FFI (foreign function interface) API allows users to call libraries written
in native languages that support the C ABIs (C/C++, Rust, Zig, V, etc.) using
`Deno.dlopen`.

Here's an example showing how to call a Rust function from Deno:

```rust
// add.rs
#[no_mangle]
pub extern "C" fn add(a: isize, b: isize) -> isize {
    a + b
}
```

Compile it to a C dynamic library (`libadd.so` on Linux):

```sh
rustc --crate-type cdylib add.rs
```

In C you can write it as:

```c
// add.c
int add(int a, int b) {
  return a + b;
}
```

And compile it:

```sh
// unix
cc -c -o add.o add.c
cc -shared -W -o libadd.so add.o
// Windows
cl /LD add.c /link /EXPORT:add
```

Calling the library from Deno:

```typescript
// ffi.ts

// Determine library extension based on
// your OS.
let libSuffix = "";
switch (Deno.build.os) {
  case "windows":
    libSuffix = "dll";
    break;
  case "darwin":
    libSuffix = "dylib";
    break;
  default:
    libSuffix = "so";
    break;
}

const libName = `./libadd.${libSuffix}`;
// Open library and define exported symbols
const dylib = Deno.dlopen(
  libName,
  {
    "add": { parameters: ["isize", "isize"], result: "isize" },
  } as const,
);

// Call the symbol `add`
const result = dylib.symbols.add(35, 34); // 69

console.log(`Result from external addition of 35 and 34: ${result}`);
```

Run with `--allow-ffi` and `--unstable` flag:

```sh
deno run --allow-ffi --unstable ffi.ts
```

### Non-blocking FFI

There are many use cases where users might want to run CPU-bound FFI functions
in the background without blocking other tasks on the main thread.

As of Deno 1.15, symbols can be marked `nonblocking` in `Deno.dlopen`. These
function calls will run on a dedicated blocking thread and will return a
`Promise` resolving to the desired `result`.

Example of executing expensive FFI calls with Deno:

```c
// sleep.c
#ifdef _WIN32
#include <Windows.h>
#else
#include <time.h>
#endif

int sleep(unsigned int ms) {
  #ifdef _WIN32
  Sleep(ms);
  #else
  struct timespec ts;
  ts.tv_sec = ms / 1000;
  ts.tv_nsec = (ms % 1000) * 1000000;
  nanosleep(&ts, NULL);
  #endif
}
```

Calling it from Deno:

```typescript
// nonblocking_ffi.ts
const library = Deno.dlopen(
  "./sleep.so",
  {
    sleep: {
      parameters: ["usize"],
      result: "void",
      nonblocking: true,
    },
  } as const,
);

library.symbols.sleep(500).then(() => console.log("After"));
console.log("Before");
```

Result:

```sh
$ deno run --allow-ffi --unstable unblocking_ffi.ts
Before
After
```

### Callbacks

Deno FFI API supports creating C callbacks from JavaScript functions for calling
back into Deno from dynamic libraries. An example of how callbacks are created
and used is as follows:

```typescript
// callback_ffi.ts
const library = Deno.dlopen(
  "./callback.so",
  {
    set_status_callback: {
      parameters: ["function"],
      result: "void",
    },
    start_long_operation: {
      parameters: [],
      result: "void",
    },
    check_status: {
      parameters: [],
      result: "void",
    },
  } as const,
);

const callback = new Deno.UnsafeCallback(
  {
    parameters: ["u8"],
    result: "void",
  } as const,
  (success: number) => {},
);

// Pass the callback pointer to dynamic library
library.symbols.set_status_callback(callback.pointer);
// Start some long operation that does not block the thread
library.symbols.start_long_operation();

// Later, trigger the library to check if the operation is done.
// If it is, this call will trigger the callback.
library.symbols.check_status();
```

If an `UnsafeCallback`'s callback function throws an error, the error will get
propagated up to the function that triggered the callback to be called (above,
that would be `check_status()`) and can be caught there. If a callback returning
a value throws then Deno will return 0 (null pointer for pointers) as the
result.

`UnsafeCallback` is not deallocated by default as it can cause use-after-free
bugs. To properly dispose of an `UnsafeCallback` its `close()` method must be
called.

```typescript
const callback = new Deno.UnsafeCallback(
  { parameters: [], result: "void" } as const,
  () => {},
);

// After callback is no longer needed
callback.close();
// It is no longer safe to pass the callback as a parameter.
```

It is also possible for native libraries to setup interrupt handlers and to have
those directly trigger the callback. However, this is not recommended and may
cause unexpected side-effects and undefined behaviour. Preferably any interrupt
handlers would only set a flag that can later be polled similarly to how
`check_status()` is used above.

### Supported types

Here's a list of types supported currently by the Deno FFI API.

| FFI Type               | Deno                 | C                        | Rust                      |
| ---------------------- | -------------------- | ------------------------ | ------------------------- |
| `i8`                   | `number`             | `char` / `signed char`   | `i8`                      |
| `u8`                   | `number`             | `unsigned char`          | `u8`                      |
| `i16`                  | `number`             | `short int`              | `i16`                     |
| `u16`                  | `number`             | `unsigned short int`     | `u16`                     |
| `i32`                  | `number`             | `int` / `signed int`     | `i32`                     |
| `u32`                  | `number`             | `unsigned int`           | `u32`                     |
| `i64`                  | `number \| bigint`   | `long long int`          | `i64`                     |
| `u64`                  | `number \| bigint`   | `unsigned long long int` | `u64`                     |
| `usize`                | `number \| bigint`   | `size_t`                 | `usize`                   |
| `isize`                | `number \| bigint`   | `size_t`                 | `isize`                   |
| `f32`                  | `number \| bigint`   | `float`                  | `f32`                     |
| `f64`                  | `number \| bigint`   | `double`                 | `f64`                     |
| `void`[1]              | `undefined`          | `void`                   | `()`                      |
| `pointer`              | `{} \| null`         | `void *`                 | `*mut c_void`             |
| `buffer`[2]            | `TypedArray \| null` | `uint8_t *`              | `*mut u8`                 |
| `function`[3]          | `{} \| null`         | `void (*fun)()`          | `Option<extern "C" fn()>` |
| `{ struct: [...] }`[4] | `TypedArray`         | `struct MyStruct`        | `MyStruct`                |

As of Deno 1.25, the `pointer` type has been split into a `pointer` and a
`buffer` type to ensure users take advantage of optimizations for Typed Arrays,
and as of Deno 1.31 the JavaScript representation of `pointer` has become an
opaque pointer object or `null` for null pointers.

- [1] `void` type can only be used as a result type.
- [2] `buffer` type accepts TypedArrays as parameter, but it always returns a
  pointer object or `null` when used as result type like the `pointer` type.
- [3] `function` type works exactly the same as the `pointer` type as a
  parameter and result type.
- [4] `struct` type is for passing and returning C structs by value (copy). The
  `struct` array must enumerate each of the struct's fields' type in order. The
  structs are padded automatically: Packed structs can be defined by using an
  appropriate amount of `u8` fields to avoid padding. Only TypedArrays are
  supported as structs, and structs are always returned as `Uint8Array`s.

### deno_bindgen

[`deno_bindgen`](https://github.com/denoland/deno_bindgen) is the official tool
to simplify glue code generation of Deno FFI libraries written in Rust.

It is similar to [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) in
the Rust Wasm ecosystem.

Here's an example showing its usage:

```rust
// mul.rs
use deno_bindgen::deno_bindgen;

#[deno_bindgen]
struct Input {
  a: i32,
  b: i32,
}

#[deno_bindgen]
fn mul(input: Input) -> i32 {
  input.a * input.b
}
```

Run `deno_bindgen` to generate bindings. You can now directly import them into
Deno:

```ts
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

Any issues related to `deno_bindgen` should be reported at
https://github.com/denoland/deno_bindgen/issues

## Program Lifecycle

Deno supports browser compatible lifecycle events:

- [`load`](https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event#:~:text=The%20load%20event%20is%20fired,for%20resources%20to%20finish%20loading.):
  fired when the whole page has loaded, including all dependent resources such
  as stylesheets and images.
- [`beforeunload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#:~:text=The%20beforeunload%20event%20is%20fired,want%20to%20leave%20the%20page.):
  fired when the event loop has no more work to do and is about to exit.
  Scheduling more asynchronous work (like timers or network requests) will cause
  the program to continue.
- [`unload`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unload_event):
  fired when the document or a child resource is being unloaded.
- [`unhandledrejection`](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event):
  fired when a promise that has no rejection handler is rejected, ie. a promise
  that has no `.catch()` handler or a second argument to `.then()`.
- [`rejectionhandled`](https://developer.mozilla.org/en-US/docs/Web/API/Window/rejectionhandled_event):
  fired when a `.catch()` handler is added to a a promise that has already
  rejected. This event is fired only if there's `unhandledrejection` listener
  installed that prevents propagation of the event (which would result in the
  program terminating with an error).

You can use these events to provide setup and cleanup code in your program.

Listeners for `load` events can be asynchronous and will be awaited, this event
cannot be canceled. Listeners for `beforeunload` need to be synchronous and can
be cancelled to keep the program running. Listeners for `unload` events need to
be synchronous and cannot be cancelled.

**main.ts**

```ts title="main.ts"
import "./imported.ts";

const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (main)`);
};

globalThis.addEventListener("load", handler);

globalThis.addEventListener("beforeunload", handler);

globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (main)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (main)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (main)`);
};

console.log("log from main script");
```

```ts title="imported.ts"
const handler = (e: Event): void => {
  console.log(`got ${e.type} event in event handler (imported)`);
};

globalThis.addEventListener("load", handler);
globalThis.addEventListener("beforeunload", handler);
globalThis.addEventListener("unload", handler);

globalThis.onload = (e: Event): void => {
  console.log(`got ${e.type} event in onload function (imported)`);
};

globalThis.onbeforeunload = (e: Event): void => {
  console.log(`got ${e.type} event in onbeforeunload function (imported)`);
};

globalThis.onunload = (e: Event): void => {
  console.log(`got ${e.type} event in onunload function (imported)`);
};

console.log("log from imported script");
```

A couple notes on this example:

- `addEventListener` and `onload`/`onunload` are prefixed with `globalThis`, but
  you could also use `self` or no prefix at all.
  [It is not recommended to use `window` as a prefix](https://lint.deno.land/#no-window-prefix).
- You can use `addEventListener` and/or `onload`/`onunload` to define handlers
  for events. There is a major difference between them, let's run the example:

```shell
$ deno run main.ts
log from imported script
log from main script
got load event in event handler (imported)
got load event in event handler (main)
got load event in onload function (main)
got onbeforeunload event in event handler (imported)
got onbeforeunload event in event handler (main)
got onbeforeunload event in onbeforeunload function (main)
got unload event in event handler (imported)
got unload event in event handler (main)
got unload event in onunload function (main)
```

All listeners added using `addEventListener` were run, but `onload`,
`onbeforeunload` and `onunload` defined in `main.ts` overrode handlers defined
in `imported.ts`.

In other words, you can use `addEventListener` to register multiple `"load"` or
`"unload"` event handlers, but only the last defined `onload`, `onbeforeunload`,
`onunload` event handlers will be executed. It is preferable to use
`addEventListener` when possible for this reason.

### beforeunload

```js
// beforeunload.js
let count = 0;

console.log(count);

globalThis.addEventListener("beforeunload", (e) => {
  console.log("About to exit...");
  if (count < 4) {
    e.preventDefault();
    console.log("Scheduling more work...");
    setTimeout(() => {
      console.log(count);
    }, 100);
  }

  count++;
});

globalThis.addEventListener("unload", (e) => {
  console.log("Exiting");
});

count++;
console.log(count);

setTimeout(() => {
  count++;
  console.log(count);
}, 100);
```

Running this program will print:

```sh
$ deno run beforeunload.js
0
1
2
About to exit...
Scheduling more work...
3
About to exit...
Scheduling more work...
4
About to exit...
Exiting
```

### unhandledrejection event

This event is fired when a promise that has no rejection handler is rejected,
ie. a promise that has no .catch() handler or a second argument to .then().

```js
// unhandledrejection.js
globalThis.addEventListener("unhandledrejection", (e) => {
  console.log("unhandled rejection at:", e.promise, "reason:", e.reason);
  e.preventDefault();
});

function Foo() {
  this.bar = Promise.reject(new Error("bar not available"));
}

new Foo();
Promise.reject();
```

Running this program will print:

```sh
$ deno run unhandledrejection.js
unhandled rejection at: Promise {
  <rejected> Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
} reason: Error: bar not available
    at new Foo (file:///dev/unhandled_rejection.js:7:29)
    at file:///dev/unhandled_rejection.js:10:1
unhandled rejection at: Promise { <rejected> undefined } reason: undefined
```
