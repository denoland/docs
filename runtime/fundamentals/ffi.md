---
title: "Foreign Function Interface (FFI)"
description: "Learn how to use Deno's Foreign Function Interface (FFI) to call native libraries directly from JavaScript or TypeScript. Includes examples, best practices, and security considerations."
---

Deno's [Foreign Function Interface](https://docs.deno.com/api/deno/ffi) (FFI)
allows JavaScript and TypeScript code to call functions in dynamic libraries
written in languages like C, C++, or Rust. This enables you to integrate native
code performance and capabilities directly into your Deno applications.

## Introduction to FFI

FFI (Foreign Function Interface) provides a bridge between Deno's JavaScript
runtime and native code. This allows you to:

- Use existing native libraries within your Deno applications
- Implement performance-critical code in languages like Rust or C
- Access operating system APIs and hardware features not directly available in
  JavaScript

Deno's FFI implementation is based on the `Deno.dlopen` API, which loads dynamic
libraries and creates JavaScript bindings to the functions they export.

## Security Considerations

FFI requires explicit permission using the `--allow-ffi` flag, as native code
runs outside of Deno's security sandbox:

```sh
deno run --allow-ffi my_ffi_script.ts
```

:::info

⚠️ **Important security warning**: Unlike JavaScript code running in the Deno
sandbox, native libraries loaded via FFI have the same access level as the Deno
process itself. This means they can:

- Access the filesystem
- Make network connections
- Access environment variables
- Execute system commands

Always ensure you trust the native libraries you're loading through FFI.

:::

## Basic Usage

The basic pattern for using FFI in Deno involves:

1. Defining the interface for the native functions you want to call
2. Loading the dynamic library using `Deno.dlopen()`
3. Calling the loaded functions

Here's a simple example loading a C library:

```ts
// Define the symbols (functions) we want to use from the library
const libName = {
  windows: "example.dll",
  linux: "libexample.so",
  darwin: "libexample.dylib",
}[Deno.build.os];

// Define the function signatures
const signatures = {
  add: { parameters: ["i32", "i32"], result: "i32" },
} as const;

// Open the library
const dylib = Deno.dlopen(libName, signatures);

// Use the function
const result = dylib.symbols.add(5, 3);
console.log(result); // 8

// Close the library when done
dylib.close();
```

## Supported Types

Deno's FFI supports a variety of data types for parameters and return values:

| Type                                                               | Description                              |
| ------------------------------------------------------------------ | ---------------------------------------- |
| `i8`, `u8`, `i16`, `u16`, `i32`, `u32`, `i64`, `u64`, `f32`, `f64` | Integer and float types of various sizes |
| `pointer`                                                          | Raw memory pointer                       |
| `function`                                                         | Function pointer                         |
| `buffer`                                                           | Pointer to a buffer (typed array)        |
| `struct`                                                           | C struct representation                  |

## Working with Structs

You can define and use C structures in your FFI code:

```ts
// Define a struct type for a Point
const pointStruct = {
  fields: {
    x: "f64",
    y: "f64",
  },
} as const;

// Define the library interface
const signatures = {
  distance: {
    parameters: [
      { struct: pointStruct },
      { struct: pointStruct },
    ],
    result: "f64",
  },
} as const;

// Create struct instances
const point1 = new Deno.UnsafePointer(
  new BigUint64Array([
    BigInt(Float64Array.of(1.0).buffer),
    BigInt(Float64Array.of(2.0).buffer),
  ]).buffer,
);

const point2 = new Deno.UnsafePointer(
  new BigUint64Array([
    BigInt(Float64Array.of(4.0).buffer),
    BigInt(Float64Array.of(6.0).buffer),
  ]).buffer,
);

// Call the function with structs
const dist = dylib.symbols.distance(point1, point2);
```

## Working with Callbacks

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

## Example: Using a Rust Library

Here's an example of creating and using a Rust library with Deno:

First, create a Rust library:

```rust
// lib.rs
#[no_mangle]
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

## Best Practices

1. **Always close resources**: Close libraries with `dylib.close()` and
   callbacks with `callback.close()` when done.

2. **Prefer TypeScript**: Use TypeScript for better type-checking when working
   with FFI.

3. **Error handling**: Wrap FFI calls in try/catch blocks to handle errors
   gracefully.

4. **Security**: Be extremely careful when using FFI, as native code can bypass
   Deno's security sandbox.

5. **Minimal surface**: Keep the FFI interface as small as possible to reduce
   the attack surface.

## Examples Repository

For more examples of using FFI with Deno, check out the
[DenOFFI Examples Repository](https://github.com/denoffi/denoffi_examples). This
community-maintained collection includes working examples of FFI integrations
with various native libraries across different operating systems.

## Alternatives to FFI

Before using FFI, consider these alternatives:

1. **WebAssembly**: For portable native code that runs within Deno's sandbox.
2. **Deno subprocesses**: Use `Deno.run` to execute external binaries with
   controlled permissions.
3. **Native Deno APIs**: Check if Deno's built-in APIs already provide what you
   need.

Deno's FFI capabilities provide powerful integration with native code, enabling
performance optimizations and access to system-level functionality. However,
this power comes with significant security considerations. Always be cautious
when working with FFI and ensure you trust the native libraries you're using.
