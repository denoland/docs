# Using deno-dom with Deno

[deno-dom](https://deno.land/x/deno_dom) is an implementation of DOM and HTML
parser in Deno. It is implemented in Rust (via Wasm) and TypeScript. There is
also a "native" implementation, leveraging the FFI interface.

deno-dom aims for specification compliance, like jsdom and unlike LinkeDOM.
Currently, deno-dom is slower than LinkeDOM for things like parsing data
structures, but faster at some manipulation operations. Both deno-dom and
LinkeDOM are significantly faster than jsdom.

As of deno_dom v0.1.22-alpha supports running on Deno Deploy. So if you want
strict standards alignment, consider using deno-dom over LinkeDOM.

## Basic example

This example will take a test string and parse it as HTML and generate a DOM
structure based on it. It will then query that DOM structure, picking out the
first heading it encounters and print out the text content of that heading:

```ts
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { assert } from "jsr:std/assert@^0";

const document = new DOMParser().parseFromString(
  `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Hello from Deno</title>
    </head>
    <body>
      <h1>Hello from Deno</h1>
      <form>
        <input name="user">
        <button>
          Submit
        </button>
      </form>
    </body>
  </html>`,
  "text/html",
);

assert(document);
const h1 = document.querySelector("h1");
assert(h1);

console.log(h1.textContent);
```

> Note: the example uses an unpinned version from `deno_land/x`, which you
> likely don't want to do, because the version can change and cause unexpected
> outcomes. You should use the latest version of available of
> [deno-dom](https://deno.land/x/deno_dom).

## Faster startup

Just importing the `deno-dom-wasm.ts` file bootstraps the Wasm code via top
level await. The problem is that top level await blocks the module loading
process. Especially with big Wasm projects, it is a lot more performant to
initialize the Wasm after module loading is complete.

_deno-dom_ has the solution for that, they provide an alternative version of the
library that does not automatically init the Wasm, and requires you to do it in
the code:

```ts
import {
  DOMParser,
  initParser,
} from "https://deno.land/x/deno_dom/deno-dom-wasm-noinit.ts";

(async () => {
  // initialize when you need it, but not at the top level
  await initParser();

  const doc = new DOMParser().parseFromString(
    `<h1>Lorem ipsum dolor...</h1>`,
    "text/html",
  );
})();
```

In addition, using the `deno-dom-native.ts` (which requires the `--allow-ffi`
flag) will bypass the Wasm startup penalty as well as will not require the
`init()` startup time. This would only work with the Deno CLI and not Deploy.
