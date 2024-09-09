---
title: "JSX"
oldUrl:
  - /deploy/manual/using-jsx/
  - /runtime/manual/advanced/jsx_dom/jsx/
  - /runtime/manual/advanced/jsx/
---

Deno has built-in support for JSX in both `.jsx` files and `.tsx` files. JSX in
Deno can be handy for server-side rendering or generating code browser
consumption.

## Default configuration

The Deno CLI has a default configuration for JSX that is different than the
defaults for `tsc`. Effectively Deno uses the following
[TypeScript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
options by default:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment"
  }
}
```

## JSX automatic runtime (recommended)

In React 17, the React team added what they called
[the _new_ JSX transforms](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).
This enhanced and modernized the API for JSX transforms as well as provided a
mechanism to automatically add relevant JSX imports so that you don't have to do
this yourself. This is the recommended way to use JSX.

To use the newer JSX runtime transform change the compiler options in your
`deno.json`.

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "imports": {
    "react": "npm:react"
  }
}
```

Behind the scenes the `jsxImportSource` setting will always append a
`/jsx-runtime` to the import specifier.

```js
// This import will be inserted automatically
import { jsx as _jsx } from "react/jsx-runtime";
```

If you want to use [Preact](https://preactjs.com/) instead of React you can
update the `jsxImportSource` value accordingly.

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "react-jsx",
-     "jsxImportSource": "react"
+     "jsxImportSource": "preact"
    },
    "imports": {
-     "react": "npm:react"
+     "preact": "npm:preact"
    }
  }
```

### Using the JSX import source pragma

Whether you have a JSX import source configured for your project, or if you are
using the default "legacy" configuration, you can add the JSX import source
pragma to a `.jsx` or `.tsx` module, and Deno will respect it.

The `@jsxImportSource` pragma needs to be in the leading comments of the module.
For example to use Preact from esm.sh, you would do something like this:

```jsx
/** @jsxImportSource https://esm.sh/preact */

export function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
```

### `jsxImportSourceTypes`

In certain cases, a library may not provide types. To specify the types, you can
use the `@jsxImportSourceTypes` pragma:

```jsx
/** @jsxImportSource npm:react@^18.3 */
/** @jsxImportSourceTypes npm:@types/react@^18.3 */

export function Hello() {
  return <div>Hello!</div>;
}
```

Or specify via the `jsxImportSourceTypes` compiler option in a _deno.json_:

```json title="deno.json"
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:react@^18.3",
    "jsxImportSourceTypes": "npm:@types/react@^18.3"
  }
}
```

## JSX precompile transform

Deno ships with a
[new JSX transform](https://deno.com/blog/v1.38#fastest-jsx-transform) that is
optimized for server-side rendering. It can be up to **7-20x faster** than the
other JSX transform options. The difference is that the precompile transform
analyses your JSX statically and stores precompiled HTML strings if possible.
That way a lot of time creating JSX objects can be avoided.

To use the precompile transform, set the `jsx` option to `"precompile"`.

```diff title="deno.json"
  {
    "compilerOptions": {
+     "jsx": "precompile",
      "jsxImportSource": "preact"
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

To prevent JSX nodes representing HTML elements from being precompiled, you can
add them to the `jsxPrecompileSkipElements` setting.

```diff title="deno.json"
  {
    "compilerOptions": {
      "jsx": "precompile",
      "jsxImportSource": "preact",
+     "jsxPrecompileSkipElements": ["a", "link"]
    },
    "imports": {
      "preact": "npm:preact"
    }
  }
```

:::note

The `precompile` transform works best with [Preact](https://preactjs.com/) or
[Hono](https://hono.dev/). It is not supported in React.

:::
