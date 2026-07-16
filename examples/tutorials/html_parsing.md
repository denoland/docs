---
last_modified: 2026-07-17
title: "Parse HTML with DOMParser"
description: "Learn why DOMParser is not a Deno global and how to parse and query HTML with LinkeDOM or Deno DOM."
url: /examples/html_parsing_tutorial/
---

Deno supports many Web Platform APIs, but it is a server-side runtime rather
than a browser rendering engine. As a result, browser document APIs such as
`window`, `document`, and `DOMParser` are not available as globals.

When you need to parse and query HTML, use a DOM implementation such as
[LinkeDOM](https://github.com/WebReflection/linkedom) or
[Deno DOM](https://github.com/b-fuze/deno-dom).

## Parse HTML with LinkeDOM

LinkeDOM provides a lightweight DOM-like implementation for server-side HTML
parsing and rendering. Import its `DOMParser` from npm:

```ts title="parse_html.ts"
import { DOMParser } from "npm:linkedom";

const response = await fetch("https://example.com/");
const html = await response.text();

const document = new DOMParser().parseFromString(html, "text/html");
const heading = document.querySelector("h1");

console.log(heading?.textContent); // "Example Domain"
```

Run the script with network access:

```sh
deno run --allow-net parse_html.ts
```

The returned document supports familiar APIs such as `querySelector`,
`querySelectorAll`, `textContent`, and `innerHTML`.

## Parse HTML with Deno DOM

Deno DOM is another option designed specifically for Deno. Its default JSR
package uses a WebAssembly parser:

```ts title="parse_html.ts"
import { DOMParser } from "jsr:@b-fuze/deno-dom";

const html = `
  <main>
    <h1>Hello from Deno</h1>
    <a href="/docs">Read the docs</a>
  </main>
`;

const document = new DOMParser().parseFromString(html, "text/html");
const link = document.querySelector("a");

console.log(link?.textContent); // "Read the docs"
console.log(link?.getAttribute("href")); // "/docs"
```

This example parses an in-memory string, so it does not require additional
runtime permissions:

```sh
deno run parse_html.ts
```

Neither library turns Deno into a full browser or executes scripts embedded in
the parsed document. For pages that require client-side JavaScript before their
content is available, use a browser automation tool instead.
