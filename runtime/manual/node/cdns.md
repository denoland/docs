---
title: "npm via CDNs"
---

Most developers currently use npm modules in Deno by importing them using one of
many CDNs. You can reference the CDN URL in your Deno code or directly in your
browser as an ES Module. These CDN URLs are reusable - they also provide
instructions on how to be used in Deno, the browser, etc.

**Starting with Deno release 1.28**, Deno also offers stabilized support for
[`npm:` specifiers](./npm_specifiers.md), which are a new way of using npm
modules in Deno.

**Starting with Deno release 1.31**, Deno supports resolving npm dependencies
[from package.json](./package_json.md) if it exists.

### esm.sh

[esm.sh](https://esm.sh/) is a CDN that was specifically designed for Deno,
though addressing the concerns for Deno also makes it a general purpose CDN for
accessing npm packages as ES Module bundles. esm.sh uses
[esbuild](https://esbuild.github.io/) to take an arbitrary npm package and
ensure that it is consumable as an ES Module. In many cases you can just import
the npm package into your Deno application:

```tsx
import React from "https://esm.sh/react";

export default class A extends React.Component {
  render() {
    return <div></div>;
  }
}
```

esm.sh supports the use of both specific versions of packages, as well as
[semver](https://semver.npmjs.com/) versions of packages, so you can express
your dependency in a similar way you would in a `package.json` file when you
import it. For example, to get a specific version of a package:

```tsx
import React from "https://esm.sh/react@17.0.2";
```

Or to get the latest patch release of a minor release:

```tsx
import React from "https://esm.sh/react@~16.13.0";
```

Or to get a submodule:

```tsx
import { renderToString } from "https://esm.sh/react-dom/server";
```

Or to import regular files:

```tsx
import "https://esm.sh/tailwindcss/dist/tailwind.min.css";
```

esm.sh also automatically sets a header which Deno recognizes that allows Deno
to be able to retrieve type definitions for the package/module. See
[Using `X-TypeScript-Types` header](../advanced/typescript/types.md). in this
manual for more details on how this works.

esm.sh also provides information on
[self hosting the CDN](https://github.com/ije/esm.sh/blob/main/HOSTING.md).

Check out the [esm.sh homepage](https://esm.sh/) for more detailed information
on how the CDN can be used and what features it has.

### UNPKG

[UNPKG](https://unpkg.com/) is the most well known CDN for npm packages. For
packages that include an ES Module distribution for things like the browsers,
many of them can be used directly off of UNPKG. That being said, everything
available on UNPKG is available on more Deno friendly CDNs.

### JSPM

The [jspm.io](https://jspm.io) CDN is specifically designed to provide npm and
other registry packages as ES Modules in a way that works well with import maps.
While it doesn't currently cater to Deno, the fact that Deno can utilize import
maps, allows you to use the [JSPM.io generator](https://generator.jspm.io/) to
generate an import-map of all the packages you want to use and have them served
up from the CDN.
