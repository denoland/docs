---
title: "WebAssembly"
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

Starting in Deno 2.1, WebAssembly modules can be imported and its use type
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
#[no_mangle]
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
