# Using Remote Modules with Deno

Using remote modules (downloaded from a registry) in Deno uses the same `import`
syntax as your local code.

The modules that you add to your project are tracked as `imports` in
`deno.json` - we call this the import map.

```json
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@scopename/mypackage": "jsr:@scopename/mypackage@^16.1.0"
  }
}
```

You can add modules using the `Deno CLI` subcommand `deno add`

```bash
$ deno add @scopename/mypackage
Add @scopename/mypackage - jsr:@scopename/mypackage@^16.1.0
```

Deno add will automatically add the latest version of the module you requested
to your project imports. If you're coming from the `node` ecosystem, this is
equivalent to `npm install PACKAGE --save`.

## Using Imported Packages

Once a package is added to the import map in `deno.json`, you can import the
module by its name, and Deno will automatically resolve the module.

```ts title="mod.ts"
import { someFunction } from "@scopename/mypackage";

someFunction();
```

## Package Registries

Deno recommends that you use [JSR](https://jsr.io/), the JavaScript registry, to
publish and manage your modules for the best publishing experience. JSR offers
automatic documentation generation, semver resolution and improved performance
for TypeScript code. Deno also supports
[other platforms](https://jsr.io/docs/other-registries) for publishing modules,
such as npm, and JavaScript CDNs like deno.land/x, esm.h and unpkg.com

By default when you use the CLI, the package will be resolved from JSR.

```bash
deno add @scopename/mypackage
```

The resulting import map contains the `jsr:` import specifier in the resulting
`deno.json` file.

```json
{
  "imports": {
    "@scopename/mypackage": "jsr:@scopename/mypackage@^16.1.0"
  }
}
```

## Importing from other package registries

Using existing packages from registries like `npm` is equivalent to the
experience in `node`. To add a package from `npm` you need to prefix the package
name with the `npm:` specifier:

```bash
$ deno add npm:uuid
Add uuid - npm:uuid@^10.0.0
```

The resulting `deno.json` will look like this:

```json
{
  "imports": {
    "uuid": "npm:uuid@^10.0.0"
  }
}
```

You will then be able to use the `npm` module by importing it with the name from
the import map.

```ts title="mod.ts"
import * as uuid from "uuid";

console.log(uuid.v4());
```

### Supported package registries and specifiers

We support the following registries:

| Registry | Specifier |
| -------- | --------- |
| JSR      | jsr:      |
| npm      | npm:      |

## Understanding Package Versions

When using Deno add, you can specify a version range for the package you are
adding. This is done using the `@` symbol followed by a version range specifier,
and follows the [semver](https://semver.org/) versioning scheme.

```bash
deno add @scopename/mypackage           # latest version
deno add @scopename/mypackage@16.1.0    # exact version
deno add @scopename/mypackage@^16.1.0   # latest patch version 16.x
deno add @scopename/mypackage@~16.1.0   # latest version that doesn't increment the first non-zero portion
```

## Importing by URL

Deno also supports import statements that reference URLs, either directly:

```js
import { Application } from "https://deno.land/x/oak/mod.ts";
```

or part of your `deno.json` import map:

```json
{
  "imports": {
    "oak": "https://deno.land/x/oak/mod.ts"
  }
}
```

Supporting URL imports enables us to support the following JavaScript CDNs, as
they provide URL access to JavaScript modules:

- [deno.land/x](https://deno.land/x)
- [esm.h](https://esm.sh)
- [unpkg.com](https://unpkg.com)

URL imports are useful if you have a small, often single file, Deno project that
doesn't require any other configuration because you can avoid having a
`Deno.json` file at all. It's not advised to use this style of import in larger
applications as you may end up with version conflicts (where different files use
different version specifiers).

From a security perspective, the contents of files at URLs can change, so we do
not generally recommend this approach for third-party components.

URL imports remain supported, **but we recommend using a package registry for
the best experience.**

## Proxies

Deno supports proxies for module downloads and the Web standard `fetch` API.

Proxy configuration is read from environmental variables: `HTTP_PROXY`,
`HTTPS_PROXY` and `NO_PROXY`.

In case of Windows, if environment variables are not found Deno falls back to
reading proxies from registry.
