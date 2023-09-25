# Foreign Function Interface

As of Deno 1.13 and later, the FFI (foreign function interface) API allows users
to call libraries written in native languages that support the C ABIs (C/C++,
Rust, Zig, V, etc.) using `Deno.dlopen`.

## Usage

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

## Non-blocking FFI

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

## Callbacks

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

## Supported types

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

## deno_bindgen

[`deno_bindgen`](https://github.com/denoland/deno_bindgen) is the official tool
to simplify glue code generation of Deno FFI libraries written in Rust.

It is similar to [`wasm-bindgen`](https://github.com/rustwasm/wasm-bindgen) in
the Rust WASM ecosystem.

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

```ts, ignore
// mul.ts
import { mul } from "./bindings/bindings.ts";
mul({ a: 10, b: 2 }); // 20
```

Any issues related to `deno_bindgen` should be reported at
https://github.com/denoland/deno_bindgen/issues
