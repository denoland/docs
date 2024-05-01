# Configuring JSX in Deno

Deno has built-in support for JSX in both `.jsx` files and `.tsx` files. JSX in
Deno can be handy for server-side rendering or generating code for consumption
in a browser.

## Default configuration

The Deno CLI has a default configuration for JSX that is different than the
defaults for `tsc`. Effectively Deno uses the following
[TypeScript compiler](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
options by default:

```json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "React.createElement",
    "jsxFragmentFactory": "React.Fragment"
  }
}
```

## JSX import source

In React 17, the React team added what they called
[the _new_ JSX transforms](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html).
This enhanced and modernized the API for JSX transforms as well as provided a
mechanism to automatically import a JSX library into a module, instead of having
to explicitly import it or make it part of the global scope. Generally this
makes it easier to use JSX in your application.

As of Deno 1.16, initial support for these transforms was added. Deno supports
both the JSX import source pragma as well as configuring a JSX import source in
a [configuration file](../../getting_started/configuration_file.md).

### JSX runtime

When using the automatic transforms, Deno will try to import a JSX runtime
module that is expected to conform to the _new_ JSX API and is located at either
`jsx-runtime` or `jsx-dev-runtime`. For example if a JSX import source is
configured to `react`, then the emitted code will add this to the emitted file:

```jsx
import { jsx as _jsx } from "react/jsx-runtime";
```

Deno generally works off explicit specifiers, which means it will not try any
other specifier at runtime than the one that is emitted. Which means to
successfully load the JSX runtime, `"react/jsx-runtime"` would need to resolve
to a module. Saying that, Deno supports remote modules, and most CDNs resolve
the specifier easily.

For example, if you wanted to use [Preact](https://preactjs.com/) from the
[esm.sh](https://esm.sh/) CDN, you would use `https://esm.sh/preact` as the JSX
import source, and esm.sh will resolve `https://esm.sh/preact/jsx-runtime` as a
module, including providing a header in the response that tells Deno where to
find the type definitions for Preact.

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

### Using JSX import source in a configuration file

If you want to configure a JSX import source for a whole project, so you don't
need to insert the pragma on each module, you can use the `"compilerOptions"` in
a [configuration file](../../getting_started/configuration_file.md) to specify
this. For example if you were using Preact as your JSX library from esm.sh, you
would configure the following, in the configuration file:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "https://esm.sh/preact"
  }
}
```

### Using an import map

In situations where the import source plus `/jsx-runtime` or `/jsx-dev-runtime`
is not resolvable to the correct module, an import map can be used to instruct
Deno where to find the module. An import map can also be used to make the import
source "cleaner". For example, if you wanted to use Preact from skypack.dev and
have skypack.dev include all the type information, you could setup an import map
like this:

```json
{
  "imports": {
    "preact/jsx-runtime": "https://cdn.skypack.dev/preact/jsx-runtime?dts",
    "preact/jsx-dev-runtime": "https://cdn.skypack.dev/preact/jsx-dev-runtime?dts"
  }
}
```

And then you could use the following pragma:

```jsx
/** @jsxImportSource preact */
```

Or you could configure it in the compiler options:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "preact"
  }
}
```

You would then need to pass the `--import-map` option on the command line (along
with the `--config` option is using a config file) or set the `deno.importMap`
option (and `deno.config` option) in your IDE.

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

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "npm:react@^18.3",
    "jsxImportSourceTypes": "npm:@types/react@^18.3"
  }
}
```

### Current limitations

There are two current limitations of the support of the JSX import source:

- A JSX module that does not have any imports or exports is not transpiled
  properly when type checking (see:
  [microsoft/TypeScript#46723](https://github.com/microsoft/TypeScript/issues/46723)).
  Errors will be seen at runtime about `_jsx` not being defined. To work around
  the issue, add `export {}` to the file or use the `--no-check` flag which will
  cause the module to be emitted properly.
- Using `"jsx-reactdev"` compiler option is not supported with
  `--no-emit`/bundling/compiling (see:
  [swc-project/swc#2656](https://github.com/swc-project/swc/issues/2656)).
  Various runtime errors will occur about not being able to load `jsx-runtime`
  modules. To work around the issue, use the `"jsx-react"` compiler option
  instead, or don't use `--no-emit`, bundling or compiling.
