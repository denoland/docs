# Using LinkeDOM with Deno

[LinkeDOM](https://github.com/WebReflection/linkedom) is a DOM-like namespace to
be used in environments, like Deno, which don't implement the DOM.

LinkeDOM focuses on being fast and implementing features useful for server side
rendering. It may allow you to do things that are invalid DOM operations.
[deno-dom](./deno_dom.md) and [jsdom](./jsdom.md) focus on correctness. While
currently deno-dom is slower than LinkeDOM in some cases, both are significantly
faster than jsdom, so if you require correctness or features not related to
server side rendering, consider deno-dom.

While LinkeDOM works under the Deno CLI, it does not type check. While the
provided types work well when using an editor like VSCode, attempting to
strictly type check them, like Deno does by default, at runtime, it will fail.
This is the same if you were to use `tsc` to type check the code. The maintainer
has indicated they aren't interested in
[fixing this issue](https://github.com/WebReflection/linkedom/issues/87). This
means for Deno, you need to use the `--no-check=remote` to avoid diagnostics
stopping the execution of your programme.

LinkedDOM runs under Deno Deploy, along with deno_dom, but jsdom does not.

## Basic example

This example will take a test string and parse it as HTML and generate a DOM
structure based on it. It will then query that DOM structure, picking out the
first heading it encounters and print out the text content of that heading:

```ts
import { DOMParser } from "https://esm.sh/linkedom";
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

## Alternative API

For the `parseHTML()` can be better suited for certain SSR workloads. This is
similar to jsdom's `JSDOM()` function, in the sense it gives you a "sandbox" of
a `window` scope you can use to access API's outside of the scope of the
`document`. For example:

```ts
import { parseHTML } from "https://esm.sh/linkedom";

const { document, customElements, HTMLElement } = parseHTML(`<!DOCTYPE html>
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
  </html>`);

customElements.define(
  "custom-element",
  class extends HTMLElement {
    connectedCallback() {
      console.log("it works 🥳");
    }
  },
);

document.body.appendChild(document.createElement("custom-element"));

document.toString(); // the string of the document, ready to send to a client
```
