# Using WebAssembly in Deno

To run WebAssembly in Deno, all you need is a binary to run. WebAssembly is a
binary data format. This means that `.wasm` files are not directly human
readable, and not intended to be written by hand. Instead a compiler for a
language like Rust, C++, or Go _emits_ `.wasm` files.

The following binary exports a `main` function that just returns `42` upon
invocation:

<!-- deno-fmt-ignore -->
```ts
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

As the code above shows, the following steps need to be performed in order to
load WebAssembly in a JavaScript program:

1. Fetching the binary (usually in the form of a `.wasm` file, though we are
   using a simple byte array for now)
2. Compiling the binary into a `WebAssembly.Module` object
3. Instantiating the WebAssembly module

For more complex scenarios you will probably want to write in a programming
language that compiles down to WebAssembly instead of hand writing instructions.
A number of languages exist that can do this, such as
[Rust](https://www.rust-lang.org/), [Go](https://golang.org/) or
[AssemblyScript](https://www.assemblyscript.org/). As an example, a Rust program
that compiles to the aforementioned bytes would look something like this:

```rust
pub fn main() -> u32 {  // u32 stands for an unsigned integer using 32 bits of memory.
  42
}
```

Aside from the methods shown in the preceding example, it is also possible to
use the streaming methods of the WebAssembly API, as will be shown on the next
page.
