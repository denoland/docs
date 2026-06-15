---
last_modified: 2026-06-13
title: "JSX and React"
description: "Configure JSX in Deno for React, Preact, or Hono: the automatic runtime, server-side rendering and its permission caveat, the precompile transform, and per-file pragmas."
oldUrl:
  - /deploy/manual/using-jsx/
  - /runtime/manual/advanced/jsx_dom/jsx/
  - /runtime/manual/advanced/jsx/
---

Deno runs JSX in `.jsx` and `.tsx` files with no build step. This page covers
how to configure it: which UI library to target, how to render JSX to HTML on
the server, and the options that control the transform. If you are building an
app with a framework, the framework usually sets this up for you. See
[Web development](/runtime/fundamentals/web_dev/) for Fresh, Next.js, and
others.

JSX needs a library to turn tags like `<h1>` into values at runtime. Deno
supports [React](https://react.dev/), [Preact](https://preactjs.com/), and
[Hono](https://hono.dev/), selected through the `jsxImportSource` setting in
`deno.json`.

## Set up JSX

Configure JSX once in your `deno.json` with the automatic runtime. This is the
recommended setup: you write JSX and Deno inserts the right imports for you, so
you never import the JSX factory by hand.

For React:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react@^19",
    "@types/react": "npm:@types/react@^19"
  }
}
```

`@types/react` is what gives you type checking and editor autocomplete for JSX.
After editing the `imports`, run `deno install` to download and cache the
packages.

For Preact, point `jsxImportSource` at `preact` instead. Preact ships its own
types, so no separate `@types` package is needed:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10"
  }
}
```

With either configuration, a component is just a function that returns JSX:

```tsx title="hello.tsx"
export function Hello() {
  return <h1>Hello, world!</h1>;
}
```

:::note Legacy classic runtime

Deno's built-in default predates the automatic runtime: it is the classic
`"react"` transform, which compiles JSX to `React.createElement` calls and
expects a `React` variable to be in scope. Code that relies on the default
throws `ReferenceError: React is not defined` at runtime unless you import React
into every JSX file. Prefer the automatic runtime above for new projects.

:::

## Choose React, Preact, or Hono

All three work in Deno. Which one to pick depends on what you are building:

- **Preact** is a small, fast, React-compatible library. It is a strong choice
  for server-rendered HTML and works with the
  [precompile transform](#speed-up-server-rendering) for maximum speed.
  [Fresh](https://fresh.deno.dev/), Deno's web framework, uses Preact.
- **Hono** brings its own JSX runtime (`hono/jsx`) aimed at server-side
  rendering and edge deployments. Choose it when you are already building an API
  or site with Hono.
- **React** is the right choice when you need the React ecosystem: React-only
  libraries, React Server Components, or an existing React codebase. Its server
  renderer is heavier than Preact's and does not support the precompile
  transform.

You can switch libraries later by changing `jsxImportSource` and the matching
import. The JSX you write stays the same.

## Render JSX to HTML on the server

To send HTML from a server, render your components to a string and return it in
a [`Response`](/api/web/~/Response). The renderer differs per library.

With Preact, use
[`preact-render-to-string`](https://www.npmjs.com/package/preact-render-to-string):

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10",
    "preact-render-to-string": "npm:preact-render-to-string@^6"
  }
}
```

```tsx title="server.tsx"
import { render } from "preact-render-to-string";

function App() {
  return <h1>Hello from Preact</h1>;
}

Deno.serve((_req) => {
  const html = `<!DOCTYPE html>${render(<App />)}`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
```

```sh
deno run -N server.tsx
```

With React, use `react-dom/server`:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react@^19",
    "react-dom": "npm:react-dom@^19",
    "@types/react": "npm:@types/react@^19"
  }
}
```

```tsx title="server.tsx"
import { renderToString } from "react-dom/server";

function App() {
  return <h1>Hello from React</h1>;
}

Deno.serve((_req) => {
  const html = `<!DOCTYPE html>${renderToString(<App />)}`;
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
```

:::caution React's server renderer needs `--allow-env`

`react-dom/server` reads `process.env.NODE_ENV`, so a React server fails with
`NotCapable: Requires env access to "NODE_ENV"` unless you grant environment
access. Run it with `-E` (or `--allow-env`) alongside the network flag:

```sh
deno run -N -E server.tsx
```

Preact's renderer does not read the environment, so it needs no extra
permission.

:::

## Speed up server rendering

Deno ships a
[precompile transform](https://deno.com/blog/v1.38#fastest-jsx-transform) built
for server-side rendering. It analyzes your JSX at build time and turns static
markup into prebuilt HTML strings, so the server skips most of the work of
creating JSX objects on each request. Set `jsx` to `"precompile"`:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "preact"
  },
  "imports": {
    "preact": "npm:preact@^10",
    "preact-render-to-string": "npm:preact-render-to-string@^6"
  }
}
```

The precompile transform works with **Preact and Hono**. It does **not** work
with React: React's `jsx-runtime` does not export the `jsxTemplate` helper the
transform relies on, so a React project configured this way fails to run with
`SyntaxError: ... does not provide an export named 'jsxTemplate'`. Use the
`"react-jsx"` runtime with React instead.

If some elements must not be precompiled into static strings, list their tag
names in `jsxPrecompileSkipElements`:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "preact",
    "jsxPrecompileSkipElements": ["a", "link"]
  },
  "imports": {
    "preact": "npm:preact@^10"
  }
}
```

## Configure JSX per file with pragmas

When most of your project uses one setup but a single file needs another, set
the import source for that file with a pragma comment instead of changing
`deno.json`. This is common for standalone scripts that have no project
configuration. The pragma must appear in the file's leading comments:

```tsx title="snippet.tsx"
/** @jsxImportSource npm:preact */

export function App() {
  return <h1>Hello from a one-off script</h1>;
}
```

If the library does not ship its own types, point Deno at a separate types
package with `@jsxImportSourceTypes`:

```tsx
/** @jsxImportSource npm:react@^19 */
/** @jsxImportSourceTypes npm:@types/react@^19 */

export function Hello() {
  return <div>Hello!</div>;
}
```

The same `jsxImportSourceTypes` is also available as a compiler option in
`deno.json` for projects whose JSX library ships no types.

## Transform options reference

The `jsx` compiler option selects how Deno compiles JSX. Set it in `deno.json`
under `compilerOptions`:

| `jsx` value      | What it does                                                                                 |
| ---------------- | -------------------------------------------------------------------------------------------- |
| `"react-jsx"`    | Automatic runtime. Inserts imports from `<jsxImportSource>/jsx-runtime`. Recommended.        |
| `"react-jsxdev"` | Automatic runtime with debug info (file, line, column) added to each node. Development only. |
| `"precompile"`   | Optimized server-rendering transform for Preact and Hono. Fastest for SSR.                   |
| `"react"`        | Legacy classic transform. Compiles to `React.createElement`; needs `React` in scope.         |

Related settings:

- `jsxImportSource`: the module JSX imports come from (`react`, `preact`,
  `hono/jsx`). Deno appends `/jsx-runtime` automatically.
- `jsxImportSourceTypes`: a types package to use when the JSX library ships
  none.
- `jsxPrecompileSkipElements`: tag names to leave out of the precompile
  transform.

For the full set of TypeScript compiler options Deno supports, see the
[`deno.json` reference](/runtime/reference/deno_json/) and
[Configuring TypeScript](/runtime/reference/ts_config_migration/).

## Next steps

- [Web development](/runtime/fundamentals/web_dev/): build apps with Fresh,
  Next.js, Astro, and other frameworks that configure JSX for you.
- [HTTP server](/runtime/fundamentals/http_server/): serve the HTML your
  components render.
- [Configuration file](/runtime/reference/deno_json/): every `deno.json` field,
  including `compilerOptions`.
