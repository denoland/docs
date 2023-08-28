# Using Twind with Deno

[Twind](https://twind.dev/) is a _tailwind-in-js_ solution for using
[Tailwind](https://tailwindcss.com/). Twind is particularly useful in Deno's
server context, where Tailwind and CSS can be easily server side rendered,
generating dynamic, performant and efficient CSS while having the usability of
styling with Tailwind.

## Basic example

In the following example, we will use twind to server side render an HTML page
and log it to the console. It demonstrates using the `tw` function to specify
grouped tailwind classes and have it rendered using only the styles specified in
the document and no client side JavaScript to accomplish the _tailwind-in-js_:

```ts
import { setup, tw } from "https://esm.sh/twind@0.16.16";
import { getStyleTag, virtualSheet } from "https://esm.sh/twind@0.16.16/sheets";

const sheet = virtualSheet();

setup({
  theme: {
    fontFamily: {
      sans: ["Helvetica", "sans-serif"],
      serif: ["Times", "serif"],
    },
  },
  sheet,
});

function renderBody() {
  return `
    <h1 class="${tw`text(3xl blue-500)`}">Hello from Deno</h1>
    <form>
      <input name="user">
      <button class="${tw`text(2xl red-500)`}">
        Submit
      </button>
    </form>
  `;
}

function ssr() {
  sheet.reset();
  const body = renderBody();
  const styleTag = getStyleTag(sheet);

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Hello from Deno</title>
        ${styleTag}
      </head>
      <body>
        ${body}
      </body>
    </html>`;
}

console.log(ssr());
```
