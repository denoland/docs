---
last_modified: 2026-06-18
title: "WebAssembly"
description: "A guide to using WebAssembly (Wasm) in Deno. Learn about module imports, type checking, streaming APIs, optimization techniques, and how to work with various programming languages that compile to Wasm."
oldUrl:
  - /runtime/manual/getting_started/webassembly/
  - /runtime/manual/runtime/webassembly/
  - /runtime/manual/runtime/webassembly/using_wasm/
  - /runtime/manual/runtime/webassembly/using_streaming_wasm/
  - /runtime/manual/runtime/webassembly/wasm_resources/
---

Designed to be used alongside JavaScript to speed up key application components,
[WebAssembly](https://webassembly.org/) (Wasm) can have much higher, and more
consistent execution speed than JavaScript - similar to C, C++, or Rust. Deno
can execute WebAssembly modules with the same interfaces that
[browsers provide](https://developer.mozilla.org/en-US/docs/WebAssembly) and by
importing them as modules.

## Wasm modules

Starting in Deno 2.1, WebAssembly modules can be imported and their use is type
checked.

Say we have a
[WebAssembly text format](https://developer.mozilla.org/en-US/docs/WebAssembly/Understanding_the_text_format)
file that exports an `add` function that adds two numbers and returns the
result:

```wat title="add.wat"
(module
  (func (export "add") (param $a i32) (param $b i32) (result i32)
    local.get $a
    local.get $b
    i32.add
  )
)
```

We can compile this to `add.wasm` via
[wat2wasm](https://github.com/webassembly/wabt):

```sh
wat2wasm add.wat
```

Then use this WebAssembly module via an import statement:

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, 2));
```

```shellsession
> deno run main.ts
3
```

### Type Checking

Deno understands the exports of Wasm modules and type checks their use. If we
call the `add` function incorrectly in the previous example, we'll see a type
checking error.

```ts title="main.ts"
import { add } from "./add.wasm";

console.log(add(1, ""));
```

```shellsession
> deno check main.ts   
Check file:///.../main.ts
error: TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(add(1, ""));
                   ~~
    at file:///.../main.ts:3:20
```

### Imports

Like JavaScript, Wasm modules can also import other modules.

For example, we can create a Wasm module that imports the `"./values.js"`
specifier and calls the `getValue` export:

```wat title="toolkit.wat"
(module
  (import "./time.ts" "getTimeInSeconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="time.ts"
export function getTimeInSeconds() {
  return Date.now() / 1000;
}
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

Now running:

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
1732147633
V:\scratch
> deno run main.ts
1732147637
```

#### Overriding import specifiers

Often Wasm modules don't use a relative specifier to make importing another
JavaScript module convenient. Say we have the following similar setup to before,
but notice that the Wasm module is importing via the "env" specifier.

```wat title="toolkit.wat"
(module
  (import "env" "get_time_in_seconds" (func $get_time (result i32)))

  (func (export "getValue") (result i32)
    call $get_time
  )
)
```

```js title="env.ts"
function getTimeInSeconds() {
  return Date.now() / 1000;
}

export { getTimeInSeconds as get_time_in_seconds };
```

```js title="main.ts"
import { getValue } from "./toolkit.wasm";

console.log(getValue());
```

```shellsession
> wat2wasm toolkit.wat
> deno run main.ts
error: Relative import path "env" not prefixed with / or ./ or ../
    at file:///.../toolkit.wasm
```

That's not super convenient because we want it to import `"./env.ts"`.

Luckily, it's pretty simple to make this work by mapping the specifier in an
[import map](https://github.com/WICG/import-maps) via the _deno.json_:

```json title="deno.json"
{
  "imports": {
    "env": "./env.ts"
  }
}
```

Now it works:

```shellsession
> deno run main.ts
1732148355
```

## Using WebAssembly via the WebAssembly API

To run WebAssembly in Deno, all you need is a Wasm module to run. The following
module exports a `main` function that just returns `42` upon invocation:

```ts
// deno-fmt-ignore
const wasmCode = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 133, 128, 128, 128, 0, 1, 96, 0, 1, 127,
  3, 130, 128, 128, 128, 0, 1, 0, 4, 132, 128, 128, 128, 0, 1, 112, 0, 0,
  5, 131, 128, 128, 128, 0, 1, 0, 1, 6, 129, 128, 128, 128, 0, 0, 7, 145,
  128, 128, 128, 0, 2, 6, 109, 101, 109, 111, 114, 121, 2, 0, 4, 109, 97,
  105, 110, 0, 0, 10, 138, 128, 128, 128, 0, 1, 132, 128, 128, 128, 0, 0,
  65, 42, 11
]);

const wasmModule = new WebAssembly.Module(wasmCode);

const wasmInstance = new WebAssembly.Instance(wasmModule);

const main = wasmInstance.exports.main as CallableFunction;
console.log(main().toString());
```

In order to load WebAssembly via the WebAssembly API, the following steps need
to be performed:

1. Fetching the binary (usually in the form of a `.wasm` file, though we are
   using a simple byte array for now)
2. Compiling the binary into a `WebAssembly.Module` object
3. Instantiating the WebAssembly module

WebAssembly is a binary data format, not intended to be human readable, nor to
be written by hand. Your `.wasm` files should be generated by a compiler for a
language such as [Rust](https://www.rust-lang.org/), [Go](https://golang.org/)
or [AssemblyScript](https://www.assemblyscript.org/).

As an example, a Rust program that compiles to the aforementioned bytes would
look something like this:

```rust
#[unsafe(no_mangle)]
pub fn main() -> u32 { // u32 stands for an unsigned integer using 32 bits of memory.
  42
}
```

## Using the Streaming WebAssembly APIs

The [most efficient](/api/web/~/WebAssembly.instantiateStreaming) way to fetch,
compile and instantiate a WebAssembly module is to use the streaming variants of
the WebAssembly API. For example, you can use `instantiateStreaming` combined
with `fetch` to perform all three steps in one go:

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

Note that the `.wasm` file must be served with the `application/wasm` MIME type.
If you want to do additional work on the module before instantiation you can
instead use [`compileStreaming`](/api/web/~/WebAssembly.compileStreaming):

```ts
const module = await WebAssembly.compileStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

/* do some more stuff */

const instance = await WebAssembly.instantiate(module);
instance.exports.increment as (input: number) => number;
```

If for some reason you cannot make use of the streaming methods you can fall
back to the less efficient [`compile`](/api/web/~/WebAssembly.compile) and
[`instantiate`](/api/web/~/WebAssembly.instantiate) methods.

For a more in-depth look on what makes the streaming methods more performant,
[check out this post](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/).

## WebAssembly API

Further information on all parts of the WebAssembly API can be found on in the
[Deno Reference Guide](/api/web/~/WebAssembly) and on
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly).

## Working with Non-Numeric Types

The code samples in this document only used numeric types in the WebAssembly
modules. To run WebAssembly with more complex types (such as strings or classes)
you will need to use tools that generate type bindings between JavaScript and
the language used to compile to WebAssembly.

An example on how to create type bindings between JavaScript and Rust, compiling
it into a binary and calling it from a JavaScript program can be found on
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly/Rust_to_wasm).

If you plan to do a lot of work with Web APIs in Rust+WebAssembly, you may find
the [web_sys](https://rustwasm.github.io/wasm-bindgen/web-sys/index.html) and
[js_sys](https://rustwasm.github.io/wasm-bindgen/contributing/js-sys/index.html)
Rust crates useful. `web_sys` contains bindings to most of the Web APIs that are
available in Deno, while `js_sys` provides bindings to JavaScript's standard,
built-in objects.

## Using wasmbuild for Rust WebAssembly in Deno

[wasmbuild](https://github.com/denoland/wasmbuild) is an official Deno tool that
simplifies working with Rust and WebAssembly in Deno projects. It automates the
process of compiling Rust code to WebAssembly and generating TypeScript
bindings, making it easy to call Rust functions from JavaScript.

wasmbuild generates TypeScript definitions for your Rust functions, providing
full type checking. The generated JavaScript can be used with bundlers like
esbuild. Generated files can be committed directly to source control for easy
deployment.

## WebAssembly System Interface (WASI)

The examples above instantiate Wasm modules that only exchange numbers and
memory with JavaScript. The
[WebAssembly System Interface (WASI)](https://wasi.dev/) is a standard set of
imports that give a Wasm module access to operating-system-like capabilities,
such as reading command-line arguments and environment variables, the clock, and
(when you grant it) the file system. It is what lets a program written in Rust,
C, or another language and compiled to Wasm run outside the browser, the same
way it would as a native command-line binary.

Deno supports both generations of WASI:

- **WASI Preview 1** (`wasip1`) modules run through the
  [`node:wasi`](https://nodejs.org/api/wasi.html) module.
- **WASI Preview 2** (`wasip2`) components, built on the
  [component model](https://component-model.bytecodealliance.org/), run with the
  Bytecode Alliance's [`jco`](https://github.com/bytecodealliance/jco) tool,
  which can also transpile a component to JavaScript you import like any module.

### Running a WASI Preview 1 module

Compile a program to the `wasm32-wasip1` target. Any toolchain that targets WASI
works; with Rust:

```sh
rustc --target wasm32-wasip1 -O hello.rs -o hello.wasm
```

Run it from Deno with the `node:wasi` module. Construct a `WASI` instance with
the arguments and environment variables the guest should see, instantiate the
module with the WASI imports, and call `start`:

```ts title="run.ts"
import { WASI } from "node:wasi";

const wasi = new WASI({
  version: "preview1",
  args: ["hello", "alpha", "beta"],
  env: { GREETING: "hello-wasi" },
});

const bytes = await Deno.readFile(new URL("./hello.wasm", import.meta.url));
const module = await WebAssembly.compile(bytes);
const instance = await WebAssembly.instantiate(module, wasi.getImportObject());

wasi.start(instance);
```

```sh
deno run --allow-read run.ts
```

A WASI instance starts with no access to the real file system. To expose
directories to the guest, pass a `preopens` map from the paths the module sees
to real paths on disk, for example `preopens: { "/data": "./data" }`. The module
can then read and write within `./data` (and your Deno process needs the
matching `--allow-read` and `--allow-write` permissions).

:::note

`node:wasi` is an experimental Node.js API, so Deno prints an experimental
warning when you use it.

:::

### Running a WASI Preview 2 component

Preview 2 components are compiled to the `wasm32-wasip2` target:

```sh
rustc --target wasm32-wasip2 -O hello.rs -o hello.wasm
```

A component is not a plain Wasm module, so it does not load through the
`WebAssembly` API or `node:wasi`. Run it directly with `jco`:

```sh
deno run -A npm:@bytecodealliance/jco run hello.wasm alpha beta
```

To call a component from your own code instead of running it as a command,
transpile it to JavaScript with bindings:

```sh
deno run -A npm:@bytecodealliance/jco transpile hello.wasm -o out
```

This writes an ES module to `out/` that you can import like any other JavaScript
module.

## Optimization

For production builds you can perform optimizations on WebAssembly binaries. If
you're serving binaries over a network then optimizing for size can make a real
difference. If you're mainly executing WebAssembly on a server to perform
computationally intensive tasks, optimizing for speed can be beneficial. You can
find a good guide on optimizing (production) builds
[here](https://rustwasm.github.io/docs/book/reference/code-size.html). In
addition, the
[rust-wasm group](https://rustwasm.github.io/docs/book/reference/tools.html) has
a list of tools that can be used to optimize and manipulate WebAssembly
binaries.
