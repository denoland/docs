---
title: "Using Twind with Deno"
---

[Twind](https://twind.style/) is a _tailwind-in-js_ solution for using
[Tailwind](https://tailwindcss.com/). Twind is particularly useful in Deno's
server context, where Tailwind and CSS can be easily server side rendered,
generating dynamic, performant and efficient CSS while having the usability of
styling with Tailwind.

## Basic example

In the following example, we will use twind to server side render an HTML page
and log it to the console. It demonstrates using grouped tailwind classes and
have it rendered using only the styles specified in the document and no client
side JavaScript to accomplish the _tailwind-in-js_:

```ts
import { extract, install } from "https://esm.sh/@twind/core@1.1.3";
import presetTailwind from "https://esm.sh/@twind/preset-tailwind@1.1.4";

install({
  presets: [
    presetTailwind(),
    {
      theme: {
        fontFamily: {
          sans: ["Helvetica", "sans-serif"],
          serif: ["Times", "serif"],
        },
      },
    },
  ],
});

function renderBody() {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Hello from Deno</title>
      </head>
      <body class="font-sans">
        <h1 class="text(3xl blue-500)">Hello from Deno</h1>
        <form>
          <input name="user">
          <button class="text(2xl red-500)">
            Submit
          </button>
        </form>
      </body>
    </html>
  `;
}

function ssr() {
  const body = renderBody();
  const { html, css } = extract(body);
  return html.replace("</head>", `<style data-twind>${css}</style></head>`);
}

console.log(ssr());
```

https://twind.style/packages/@twind/core#extract
