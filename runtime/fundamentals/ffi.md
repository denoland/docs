---
last_modified: 2026-05-13
title: "Foreign Function Interface (FFI)"
description: "Learn how to use Deno's Foreign Function Interface (FFI) to call native libraries directly from JavaScript or TypeScript. Includes examples, best practices, and security considerations."
---

Deno's Foreign Function Interface (FFI) allows JavaScript and TypeScript code to
call functions in dynamic libraries written in languages like C, C++, or Rust.
This enables you to integrate native code performance and capabilities directly
into your Deno applications.

<a href="/api/deno/ffi" class="docs-cta runtime-cta">Deno FFI Reference Docs</a>

## Introduction to FFI

FFI provides a bridge between Deno's JavaScript runtime and native code. This
allows you to:

- Use existing native libraries within your Deno applications
- Implement performance-critical code in languages like Rust or C
- Access operating system APIs and hardware features not directly available in
  JavaScript

Deno's FFI implementation is based on the
[`Deno.dlopen`](/api/deno/~/Deno.dlopen) API, which loads dynamic libraries and
creates JavaScript bindings to the functions they export.

## Security considerations

FFI requires explicit permission using the
[`--allow-ffi`](/runtime/fundamentals/security#ffi-foreign-function-interface)
flag, as native code runs outside of Deno's security sandbox:

```sh
deno run --allow-ffi my_ffi_script.ts
```

:::info

<strong>Important security warning</strong>: Unlike JavaScript code running in
the Deno sandbox, native libraries loaded via FFI have the same access level as
the Deno process itself. This means they can:

- Access the filesystem
- Make network connections
- Access environment variables
- Execute system commands

Always ensure you trust the native libraries you're loading through FFI.

:::

## Basic usage

The basic pattern for using FFI in Deno involves:

1. Defining the interface for the native functions you want to call
2. Loading the dynamic library using [`Deno.dlopen()`](/api/deno/~/Deno.dlopen)
3. Calling the loaded functions

Here's a simple example loading a C library:

```ts
const dylib = Deno.dlopen("libexample.so", {
  add: { parameters: ["i32", "i32"], result: "i32" },
});

console.log(dylib.symbols.add(5, 3)); // 8

dylib.close();
```

## Supported types

Deno's FFI supports a variety of data types for parameters and return values:

| FFI Type               | Deno                 | C                        | Rust                      |
| ---------------------- | -------------------- | ------------------------ | ------------------------- |
| `i8`                   | `number`             | `char` / `signed char`   | `i8`                      |
| `u8`                   | `number`             | `unsigned char`          | `u8`                      |
| `i16`                  | `number`             | `short int`              | `i16`                     |
| `u16`                  | `number`             | `unsigned short int`     | `u16`                     |
| `i32`                  | `number`             | `int` / `signed int`     | `i32`                     |
| `u32`                  | `number`             | `unsigned int`           | `u32`                     |
| `i64`                  | `bigint`             | `long long int`          | `i64`                     |
| `u64`                  | `bigint`             | `unsigned long long int` | `u64`                     |
| `usize`                | `bigint`             | `size_t`                 | `usize`                   |
| `isize`                | `bigint`             | `size_t`                 | `isize`                   |
| `f32`                  | `number`             | `float`                  | `f32`                     |
| `f64`                  | `number`             | `double`                 | `f64`                     |
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

## Working with structs

To pass or return a C struct by value, describe its layout with
`{ struct: [...] }` — an array that lists each field's FFI type in declaration
order. Struct values are passed as a `TypedArray` whose bytes match the C
layout, and structs returned by value come back as a `Uint8Array` of the right
length. The `struct` array in the type table earlier on this page is the
authoritative shape.

Suppose you have this small C library that operates on a 2D `Point`:

```c title="point.c"
typedef struct {
  double x;
  double y;
} Point;

double distance(Point a, Point b) {
  double dx = a.x - b.x;
  double dy = a.y - b.y;
  return __builtin_sqrt(dx * dx + dy * dy);
}

Point midpoint(Point a, Point b) {
  Point m;
  m.x = (a.x + b.x) / 2.0;
  m.y = (a.y + b.y) / 2.0;
  return m;
}
```

Build it as a shared library. The compiler flags and output filename vary by
platform:

<deno-tabs group-id="operating-systems">
<deno-tab value="linux" label="Linux" default>

```sh
cc -shared -fPIC -O2 -o libpoint.so point.c
```

</deno-tab>
<deno-tab value="mac" label="macOS">

```sh
cc -dynamiclib -O2 -o libpoint.dylib point.c
```

</deno-tab>
<deno-tab value="windows" label="Windows">

```sh
cl /LD /O2 point.c /Fe:point.dll
```

</deno-tab>
</deno-tabs>

Then call into it from Deno, using the filename for your platform in
[`Deno.dlopen`](/api/deno/~/Deno.dlopen). Note that the `struct` definition is
an _array of field types_ in declaration order, not an object with named fields:

```ts title="point.ts"
// `Point` mirrors the C `struct Point { double x; double y; }`.
const Point = { struct: ["f64", "f64"] } as const;

const lib = Deno.dlopen(
  "./libpoint.so",
  {
    distance: { parameters: [Point, Point], result: "f64" },
    midpoint: { parameters: [Point, Point], result: Point },
  } as const,
);

// Build struct values as a TypedArray whose bytes match the C layout.
// Two f64 fields → two slots in a Float64Array.
const a = new Float64Array([1.0, 2.0]); // Point { x: 1.0, y: 2.0 }
const b = new Float64Array([4.0, 6.0]); // Point { x: 4.0, y: 6.0 }

// FFI reads the underlying bytes, so pass the buffer as a Uint8Array view.
const aBytes = new Uint8Array(a.buffer);
const bBytes = new Uint8Array(b.buffer);

console.log("distance =", lib.symbols.distance(aBytes, bBytes));

// A struct returned by value comes back as a Uint8Array sized to the struct.
// Wrap it in a Float64Array to read the fields back out.
const midBytes = lib.symbols.midpoint(aBytes, bBytes);
const mid = new Float64Array(midBytes.buffer);
console.log("midpoint =", { x: mid[0], y: mid[1] });

lib.close();
```

Run it with the `--allow-ffi` permission:

```sh
deno run --allow-ffi point.ts
```

You should see:

```console
distance = 5
midpoint = { x: 2.5, y: 4 }
```

A few things to keep in mind when working with structs:

- **Layout matches the C compiler.** Deno pads struct fields the same way your C
  compiler does. If you need a packed struct, pad it explicitly with `u8`
  fields, as noted in the type table above.
- **Field order is positional.** The `struct` array is just types, in
  declaration order — there are no field names on the JavaScript side. The
  TypedArray you pass must lay the fields out in the same order.
- **Returned structs are bytes.** A struct result is always a `Uint8Array`; view
  it through the appropriate `TypedArray` (or a `DataView`) to read the fields.

## Working with callbacks

You can pass JavaScript functions as callbacks to native code:

```ts
const signatures = {
  setCallback: {
    parameters: ["function"],
    result: "void",
  },
  runCallback: {
    parameters: [],
    result: "void",
  },
} as const;

// Create a callback function
const callback = new Deno.UnsafeCallback(
  { parameters: ["i32"], result: "void" } as const,
  (value) => {
    console.log("Callback received:", value);
  },
);

// Pass the callback to the native library
dylib.symbols.setCallback(callback.pointer);

// Later, this will trigger our JavaScript function
dylib.symbols.runCallback();

// Always clean up when done
callback.close();
```

## Best practices with FFI

1. Always close resources. Close libraries with `dylib.close()` and callbacks
   with `callback.close()` when done.

2. Prefer TypeScript. Use TypeScript for better type-checking when working with
   FFI.

3. Wrap FFI calls in try/catch blocks to handle errors gracefully.

4. Be extremely careful when using FFI, as native code can bypass Deno's
   security sandbox.

5. Keep the FFI interface as small as possible to reduce the attack surface.

## Examples

### Using a Rust library

Here's an example of creating and using a Rust library with Deno:

First, create a Rust library:

```rust
// lib.rs
#[unsafe(no_mangle)]
pub extern "C" fn fibonacci(n: u32) -> u32 {
  if n <= 1 {
    return n;
  }
  fibonacci(n - 1) + fibonacci(n - 2)
}
```

Compile it as a dynamic library:

```sh
rustc --crate-type cdylib lib.rs
```

Then use it from Deno:

```ts
const libName = {
  windows: "./lib.dll",
  linux: "./liblib.so",
  darwin: "./liblib.dylib",
}[Deno.build.os];

const dylib = Deno.dlopen(
  libName,
  {
    fibonacci: { parameters: ["u32"], result: "u32" },
  } as const,
);

// Calculate the 10th Fibonacci number
const result = dylib.symbols.fibonacci(10);
console.log(`Fibonacci(10) = ${result}`); // 55

dylib.close();
```

### Examples

- [Netsaur](https://github.com/denosaurs/netsaur/blob/c1efc3e2df6e2aaf4a1672590a404143203885a6/packages/core/src/backends/cpu/mod.ts)
- [WebView_deno](https://github.com/webview/webview_deno/blob/main/src/ffi.ts)
- [Deno_sdl2](https://github.com/littledivy/deno_sdl2/blob/main/mod.ts)
- [Deno FFI examples repository](https://github.com/denoffi/denoffi_examples)

These community-maintained repos includes working examples of FFI integrations
with various native libraries across different operating systems.

## Related Approaches to Native Code Integration

While Deno's FFI provides a direct way to call native functions, there are other
approaches to integrate native code:

### Using Node-API (N-API) with Deno

Deno supports [Node-API (N-API)](https://nodejs.org/api/n-api.html) for
compatibility with native Node.js addons. This enables you to use existing
native modules written for Node.js.

Directly loading a Node-API addon:

```ts
import process from "node:process";
process.dlopen(module, "./native_module.node", 0);
```

Using an npm package that uses a Node-API addon:

```ts
import someNativeAddon from "npm:some-native-addon";
console.log(someNativeAddon.doSomething());
```

How is this different from FFI?

| **Aspect**  | **FFI**                | **Node-API Support**                        |
| ----------- | ---------------------- | ------------------------------------------- |
| Setup       | No build step required | Requires precompiled binaries or build step |
| Portability | Tied to library ABI    | ABI-stable across versions                  |
| Use Case    | Direct library calls   | Reuse Node.js addons                        |

Node-API support is ideal for leveraging existing Node.js native modules,
whereas FFI is best for direct, lightweight calls to native libraries.

## Alternatives to FFI

Before using FFI, consider these alternatives:

- [WebAssembly](/runtime/reference/wasm/), for portable native code that runs
  within Deno's sandbox.
- Use [`Deno.command`](/api/deno/~/Deno.command) to execute external binaries
  and subprocesses with controlled permissions.
- Check whether [Deno's native APIs](/api/deno) already provide the
  functionality you need.

Deno's FFI capabilities provide powerful integration with native code, enabling
performance optimizations and access to system-level functionality. However,
this power comes with significant security considerations. Always be cautious
when working with FFI and ensure you trust the native libraries you're using.
