---
title: "Using jsdom with Deno"
---

[jsdom](https://github.com/jsdom/jsdom) is a pure JavaScript implementation of
many web standards, notably the WHATWG DOM and HTML Standards. It's main goal is
to be comprehensive and standards compliant and does not specifically consider
performance.

If you are interested in server side rendering, then both
[deno-dom](./deno_dom.md) and [LinkeDOM](./linkedom.md) are better choices. If
you are trying to run code in a "virtual" browser that needs to be standards
based, then it is possible that jsdom is suitable for you.

While jsdom works under the Deno CLI, it does not type check. This means you
have to use the `--no-check=remote` option on the command line to avoid
diagnostics stopping the execution of your programme.

Having sound typing in an editor requires some changes to the workflow as well,
as the way jsdom types are provided are declared as a global type definition
with a globally named module, as well as leveraging the built in types from the
built-in DOM libraries.

This means if you want strong typing and intelligent auto-completion in your
editor while using the Deno language server, you have to perform some extra
steps.

### Setting up a configuration file

You will want to set up a `deno.jsonc` configuration file in the root of your
workspace with both TypeScript library information as well as specifying the
dependencies we'll be using:

```jsonc
{
  "compilerOptions": {
    "lib": [
      "deno.ns",
      "dom",
      "dom.iterable",
      "dom.asynciterable"
    ]
  },
  "imports": {
    "jsdom": "npm:jsdom",
    "@std/assert": "jsr:@std/assert@1"
  }
}
```

> Note: we are using an unpinned version of jsdom above. You should consider
> pinning the version to the version you know you want to use.

## Basic example

This example will take a test string and parse it as HTML and generate a DOM
structure based on it. It will then query that DOM structure, picking out the
first heading it encounters and print out the text content of that heading:

```ts
import { JSDOM } from "jsdom";
import { assert } from "@std/assert";

const { window: { document } } = new JSDOM(
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
  {
    url: "https://example.com/",
    referrer: "https://example.org/",
    contentType: "text/html",
    storageQuota: 10000000,
  },
);

const h1 = document.querySelector("h1");
assert(h1);

console.log(h1.textContent);
```
