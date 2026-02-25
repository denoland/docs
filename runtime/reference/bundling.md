---
title: "Bundling"
description: "An overview of `deno bundle` subcommand that can be used to produce a single file application created from multiple source files for optimized execution."
---

:::caution

This is an experimental feature and requires Deno `2.4.0` or newer.

:::

The `deno bundle` command outputs a single JavaScript file with all
dependencies.

`deno bundle` is powered by [ESBuild](https://esbuild.github.io/) under the
hood.

This tool is useful for deploying or distributing a project as a single
optimized JS file.

## Supported features

- Resolves and inlines all dependencies
- Supports JSX/TSX, TypeScript, and modern JavaScript, including
  [import attributes](/runtime/fundamentals/modules/#import-attributes) and CSS
- HTML entrypoint support (Deno 2.5+)
- Optional minification (`--minify`) and source maps (`--sourcemap`)
- Code splitting
- Platform targeting (`--platform`, supports Deno and browser)
- JSX support when configured

## Basic example

```ts title="main.ts"
import chalk from "npm:chalk";

console.log(chalk.red("Hello from `deno bundle`!"));
```

```bash
$ deno bundle main.ts > bundle.js

# Or with an explicit output file:

$ deno bundle -o bundle.js main.ts
```

Above invocation produces a single `bundle.js` file that contains all the
dependencies, resulting in a self-contained application file:

```bash
$ deno bundle.js
Hello from `deno bundle`!
```

You can use JSR, npm, http(s) and local imports in the file you are bundling,
`deno bundle` will take care of collecting all the sources and producing a
single output file.

## Options Overview

| Flag                    | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `-o`, `--output <file>` | Write bundled output to a file                       |
| `--outdir <dir>`        | Write bundled output to a directory                  |
| `--minify`              | Minify the output for production                     |
| `--format <format>`     | Output format (`esm` by default)                     |
| `--code-splitting`      | Enable code splitting                                |
| `--platform <platform>` | Bundle for `browser` or `deno` (default: `deno`)     |
| `--sourcemap`           | Include source maps (`linked`, `inline`, `external`) |
| `--watch`               | Automatically rebuild on file changes                |
| `--inline-imports`      | Inline imported modules (`true` or `false`)          |

---

## Runtime API

In addition to the CLI, you can use `Deno.bundle()` to programmatically bundle
your JavaScript or TypeScript files. This allows you to integrate bundling into
your build processes and workflows.

:::note

This API was added in Deno v2.5. The `Deno.bundle()` API is experimental and
must be used with the `--unstable-bundle` flag.

:::

### Basic usage

```ts
const result = await Deno.bundle({
  entrypoints: ["./index.tsx"],
  outputDir: "dist",
  platform: "browser",
  minify: true,
});
console.log(result);
```

### Processing outputs in memory

You can also process the bundled outputs in memory instead of writing them to
disk:

```ts
const result = await Deno.bundle({
  entrypoints: ["./index.tsx"],
  output: "dist",
  platform: "browser",
  minify: true,
  write: false,
});

for (const file of result.outputFiles!) {
  console.log(file.text());
}
```

This approach offers greater flexibility for integrating bundling into various
workflows, such as serving bundled files directly from memory or performing
additional processing on the output.

---

## HTML entrypoint support

Starting with Deno 2.5, `deno bundle` supports HTML files as entrypoints.
Previously, only `.js`/`.ts`/`.jsx`/`.tsx` files could be used as entrypoints.

```bash
deno bundle --outdir dist index.html
```

When you use an HTML file as an entrypoint, `deno bundle` will:

1. Find all script references in the HTML file
2. Bundle those scripts and their dependencies
3. Update the paths in the HTML file to point to the bundled scripts
4. Bundle and inject any imported CSS files into the HTML output

### Example

Given an `index.tsx` file:

```tsx title="index.tsx"
import { render } from "npm:preact";
import "./styles.css";

const app = (
  <div>
    <p>Hello World!</p>
  </div>
);

render(app, document.body);
```

And an HTML file that references it:

```html title="index.html"
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example</title>
    <script src="./index.tsx" type="module"></script>
  </head>
</html>
```

Running `deno bundle --outdir dist index.html` produces:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Example</title>
    <script src="./index-2TFDJWLF.js" type="module" crossorigin></script>
    <link rel="stylesheet" crossorigin href="./index-EWSJYQGA.css">
  </head>
</html>
```

The bundled output includes content-based hashes for cache-busting and
fingerprinting.

HTML entrypoints are fully supported in both the CLI and the runtime API
mentioned above.

### When to use HTML bundling

- **`deno bundle index.html`** - Great for small, static apps where you want a
  quick packaged build
- **Vite** - Better for complex projects that benefit from the wider Vite
  ecosystem

Both approaches work seamlessly on Deno, so you can choose whichever fits your
workflow best.

---

## Bundle a React page for the web

Start with an `app.jsx` and `index.html`:

```jsx
import React from "npm:react";
import { createRoot } from "npm:react-dom/client";

function App() {
  return <h1>Hello, React!</h1>;
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <div id="root"></div>
    <script type="module" src="/bundle.js"></script>
  </body>
</html>
```

Now, let's bundle:

```bash
$ deno bundle --platform=browser app.jsx -o bundle.js
⚠️ deno bundle is experimental and subject to changes
Bundled 9 modules in 99ms
  app.bundle.js 874.67KB
```

At this point, we're ready to serve our page, let's use
[`@std/http/file-server` from JSR](https://jsr.io/@std/http/file-server) to
serve our app:

```bash
$ deno run -ENR jsr:@std/http/file-server
Listening on http://127.0.0.1:8000
```

Visiting the page in your browser should show:

![Image of serving bundled React app](./images/bundled_react.png)
