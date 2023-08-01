# Using the Streaming WebAssembly APIs

The
[most efficient](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiateStreaming)
way to fetch, compile and instantiate a WebAssembly module is to use the
streaming variants of the WebAssembly API. For example, you can use
`instantiateStreaming` combined with `fetch` to perform all three steps in one
go:

```ts
const { instance, module } = await WebAssembly.instantiateStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

const increment = instance.exports.increment as (input: number) => number;
console.log(increment(41));
```

Note that the `.wasm` file must be served with the `application/wasm` MIME type.
If you want to do additional work on the module before instantiation you can
instead use `compileStreaming`:

```ts
const module = await WebAssembly.compileStreaming(
  fetch("https://wpt.live/wasm/incrementer.wasm"),
);

/* do some more stuff */

const instance = await WebAssembly.instantiate(module);
instance.exports.increment as (input: number) => number;
```

If for some reason you cannot make use of the streaming methods you can fall
back to the less efficient `compile` and `instantiate` methods. See for example
the
[MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WebAssembly/instantiate).
For a more in-depth look on what makes the streaming methods more performant,
see for example
[this post](https://hacks.mozilla.org/2018/01/making-webassembly-even-faster-firefoxs-new-streaming-and-tiering-compiler/).
