# Helpful Resources

This page contains some further information that is helpful when using and/or
developing WebAssembly modules.

## WebAssembly API

Further information on all parts of the WebAssembly API can be found on
[MDN](https://developer.mozilla.org/en-US/docs/WebAssembly).

## Working with Non-Numeric Types

The code samples in this chapter only used numeric types in the WebAssembly
modules. To run WebAssembly with more complex types (strings, classes) you will
want to use tools that generate type bindings between JavaScript and the
language used to compile to WebAssembly.

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

For production builds it can be a good idea to perform optimizations on
WebAssembly binaries. If you're mainly serving binaries over networks then
optimizing for size can make a real difference, whereas if you're mainly
executing WebAssembly on a server to perform computationally intensive tasks,
optimizing for speed can be beneficial. You can find a good guide on optimizing
(production) builds
[here](https://rustwasm.github.io/docs/book/reference/code-size.html). In
addition, the
[rust-wasm group](https://rustwasm.github.io/docs/book/reference/tools.html) has
a list of tools that can be used to optimize and manipulate WebAssembly
binaries.
