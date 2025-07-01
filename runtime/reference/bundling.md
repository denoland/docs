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
- Optional minification (`--minify`) and source maps (`--sourcemap`)
- Code splitting
- Platform targeting (`--platform`, supports Deno and browser)
- JSX support when configured

## Basic example

```ts, title="main.ts"
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
single ooutput file.

## Options Overview

| Flag                    | Description                                          |
| ----------------------- | ---------------------------------------------------- |
| `-o`, `--output <file>` | Write bundled output to a file                       |
| `--minify`              | Minify the output for production                     |
| `--format <format>`     | Output format (`esm` by default)                     |
| `--code-splitting`      | Enable code splitting                                |
| `--platform <platform>` | Bundle for `browser` or `deno` (default: `deno`)     |
| `--sourcemap`           | Include source maps (`linked`, `inline`, `external`) |
| `--watch`               | Automatically rebuild on file changes                |
| `--inline-imports`      | Inline imported modules (`true` or `false`)          |

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
