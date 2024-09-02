---
title: "Using modules in Deno"
oldUrl:
  - /runtime/manual/basics/modules/
  - /runtime/manual/basics/modules/integrity_checking/
  - /runtime/manual/basics/modules/module_metadata/
  - /runtime/manual/basics/modules/proxies/
  - /runtime/manual/basics/modules/publishing_modules/
  - /runtime/manual/basics/modules/reloading_modules/
  - /runtime/manual/basics/vendoring/
  - /runtime/manual/advanced/http_imports/
  - /runtime/manual/advanced/publishing/dnt/
  - /runtime/manual/advanced/publishing/
  - /runtime/manual/examples/manage_dependencies
  - /runtime/manual/node/cdns.md
  - /runtime/manual/linking_to_external_code
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/fundamentals/esm.sh
---

Deno uses
[ECMAScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
exclusively.

Since 2015, ES Modules have been an integral part of the JavaScript
specification, enabling seamless module usage directly in the browser. Unlike
CommonJS, which is not natively supported in browsers, ES Modules provide a
standardized way to manage dependencies and modularize code. Deno aims to narrow
the gap between browser and server environments by fully embracing ES Modules,
ensuring a more consistent and streamlined development experience across both
platforms.

## Importing modules

In this example the `add` function is imported from a local `calc.ts` module.

```ts title="calc.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```ts title="main.ts"
import { add } from "./calc.ts";

console.log(add(1, 2)); // 3
```

You can run this example by calling `deno run main.ts` in the directory that
contains `main.ts` and `calc.ts`.

## Adding third party modules and libraries to deno.json

Using remote modules (downloaded from a registry) in Deno uses the same `import`
syntax as your local code.

The modules that you add to your project are tracked as `imports` in
`deno.json` - we call this the import map.

```json title="deno.json"
{
  "imports": {
    "@scopename/mypackage": "jsr:@scopename/mypackage@^16.1.0"
  }
}
```

You can add modules using the `deno add` subcommand:

```sh
# Add the latest version of the module to deno.json
$ deno add @luca/cases
Add @luca/cases - jsr:@luca/cases@^1.0.0
```

```json title="deno.json"
{
  "imports": {
    "@luca/cases": "jsr:@luca/cases@^1.0.0"
  }
}
```

The `deno add` command will automatically add the latest version of the module
you requested to your project imports, unless you specify an exact version:

```sh
# Passing an exact version
$ deno add @luca/cases@1.0.0
Add @luca/cases - jsr:@luca/cases@^1.0.0
```

## Local imports

When importing local modules, use relative paths that start with `./` or `../`
and include the full file extension. This means you need to specify `.ts`,
`.js`, `.tsx`, `.jsx`, or `.mjs` extensions explicitly. This ensures that Deno
correctly resolves the module location relative to the current file. For
example:

```ts
// Always include the file extension
import { add } from "./calc.ts";
```

## Using installed modules

Once a package is added to the import map in `deno.json`, you can import the
module by its name, and Deno will automatically resolve the module. For example:

```ts title="main.ts"
import { camelCase } from "@luca/cases";

camelCase("hello world"); // "helloWorld"
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

Deno supports the following registries:

| Registry | Specifier |
| -------- | --------- |
| JSR      | jsr:      |
| npm      | npm:      |

To import a package from `npm` you need to prefix the package name with the
`npm:` specifier:

```bash
$ deno add npm:uuid
Add uuid - npm:uuid@^10.0.0
```

The resulting `deno.json` will contain the following import:

```json
{
  "imports": {
    "uuid": "npm:uuid@^10.0.0"
  }
}
```

You can then use the npm module by importing it by name from the import map.

```ts title="mod.ts"
import * as uuid from "uuid";

console.log(uuid.v4());
```

## Importing modules from HTTP URLs

Deno supports importing modules from HTTP URLs. Note that npm packages can be
directly imported via the
[`npm:` specifier](/runtime/manual/node/npm_specifiers/).

```typescript
import { render } from "https://esm.sh/preact";
```

You can also import modules from a URL by adding it to your `deno.json` import
map:

```json title="deno.json"
{
  "imports": {
    "preact": "https://esm.sh/preact"
  }
}
```

URL imports should be used with caution, as they can introduce security risks.
When importing modules from a URL, you are trusting the server to serve the
correct code. If the server is compromised, it could serve malicious code to
your application. For this reason, it is recommended to **use URL imports only
from trusted sources**. They can also cause versioning issues if you import
different versions in different files.

## Package Versions

It is possible to specify a version range for the package you are importing.
This is done using the `@` symbol followed by a version range specifier, and
follows the [semver](https://semver.org/) versioning scheme.

For example:

```bash
@scopename/mypackage           # latest version
@scopename/mypackage@16.1.0    # exact version
@scopename/mypackage@^16.1.0   # latest patch version 16.x
@scopename/mypackage@~16.1.0   # latest version that doesn't increment the first non-zero portion
```

### Import symbols

| Symbol    | Description                                                                                                                                                         | Example   |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `1.2.3`   | An exact version. Only this specific version will be used.                                                                                                          | `1.2.3`   |
| `^1.2.3`  | Compatible with version 1.2.3. Allows updates that do not change the leftmost non-zero digit. <br>For example, `1.2.4` and `1.3.0` are allowed, but `2.0.0` is not. | `^1.2.3`  |
| `~1.2.3`  | Approximately equivalent to version 1.2.3. Allows updates to the patch version. <br> For example, `1.2.4` is allowed, but `1.3.0` is not.                           | `~1.2.3`  |
| `>=1.2.3` | Greater than or equal to version 1.2.3. Any version `1.2.3` or higher is allowed.                                                                                   | `>=1.2.3` |
| `<=1.2.3` | Less than or equal to version 1.2.3. Any version `1.2.3` or lower is allowed.                                                                                       | `<=1.2.3` |
| `>1.2.3`  | Greater than version 1.2.3. Only versions higher than `1.2.3` are allowed.                                                                                          | `>1.2.3`  |
| `<1.2.3`  | Less than version 1.2.3. Only versions lower than `1.2.3` are allowed.                                                                                              | `<1.2.3`  |
| `1.2.x`   | Any patch version within the minor version 1.2. For example, `1.2.0`, `1.2.1`, etc.                                                                                 | `1.2.x`   |
| `1.x`     | Any minor and patch version within the major version 1. For example, `1.0.0`, `1.1.0`, `1.2.0`, etc.                                                                | `1.x`     |
| `*`       | Any version is allowed.                                                                                                                                             | `*`       |

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
- [esm.sh](https://esm.sh)
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

### Overriding URL imports

The other situation where import maps can be very useful is to override URL
imports in specific modules.

Let's say you want to override a `https://deno.land/x/my-library@1.0.0/mod.ts`
specifier that is used inside files coming from `https://deno.land/x/example/`
to a local patched version. You can do this by using a scope in the import map
that looks something like this:

```json
{
  "imports": {
    "example/": "https://deno.land/x/example/"
  },
  "scopes": {
    "https://deno.land/x/example/": {
      "https://deno.land/x/my-library@1.0.0/mod.ts": "./patched/mod.ts"
    }
  }
}
```

:::note

URL imports have no notion of packages. Only the import map at the root of your
project is used. Import maps used inside URL dependencies are ignored.

:::

## Proxies

Deno is able to handle network requests through a proxy server, useful for
various reasons such as security, caching, or accessing resources behind a
firewall. The runtime supports supports proxies for module downloads and the Web
standard `fetch` API.

Deno reads proxy configuration from environment variables: `HTTP_PROXY`,
`HTTPS_PROXY` and `NO_PROXY`.

In case of Windows, if environment variables are not found, Deno falls back to
reading proxies from the registry.

## Publishing modules

Any Deno program that defines an export can be published as a module. This
allows other developers to import and use your code in their own projects.
Modules can be published to [JSR](https://jsr.io), the modern JavaScript and
TypeScript registry. Check out the
[JSR documentation on publishing modules](https://jsr.io/docs/publishing-packages)
for more information.

## Publishing for Node.js

You can make your Deno modules available to Node.js users with the
[dnt](https://github.com/denoland/dnt) build tool.

dnt allows you to develop your Deno module mostly as-is and use a single Deno
script to build, type check, and test an npm package in an output directory.
Once built, you only need to `npm publish` the output directory to distribute it
to Node.js users.

For more details, see
[https://github.com/denoland/dnt](https://github.com/denoland/dnt).

## Reloading modules

By default, Deno uses a global cache directory (`DENO_DIR`) for downloaded
dependencies. This cache is shared across all projects.

You can force deno to refetch and recompile modules into the cache using the
`--reload` flag.

```bash
# Reload everything
deno run --reload my_module.ts

# Reload a specific module
deno run --reload=jsr:@std/fs my_module.ts
```

## Vendoring

If your project has external dependencies, you may want to store them locally to
avoid downloading them from the internet every time you build your project. This
is especially useful when building your project on a CI server or in a Docker
container, or patching or otherwise modifying the remote dependencies.

Deno offers this functionality through a setting in your `deno.json` file:

```json
{
  "vendor": true
}
```

Add the above snippet to your `deno.json` file and Deno will cache all
dependencies locally in a `vendor` directory when the project is run, or you can
optionally run the `deno cache` command to cache the dependencies immediately:

```bash
deno cache main.ts
```

You can then run the application as usual with `deno run`:

```bash
deno run main.ts
```

After vendoring, you can run `main.ts` without internet access by using the
`--cached-only` flag, which forces Deno to use only locally available modules.

## Integrity Checking and Lock Files

Imagine your module relies on a remote module located at https://some.url/a.ts.
When you compile your module for the first time, `a.ts` is fetched, compiled,
and cached. This cached version will be used until you either run your module on
a different machine (such as in a production environment) or manually reload the
cache (using a command like `deno cache --reload`).

But what if the content at `https://some.url/a.ts` changes? This could result in
your production module running with different dependency code than your local
module. To prevent this, Deno uses integrity checking and lock files.

Deno uses a `deno.lock` file to check external module integrity. To opt into a
lock file, either:

1. Create a `deno.json` file in the current or an ancestor directory, which will
   automatically create an additive lockfile at `deno.lock`.
2. Use the `--lock=deno.lock` flag to enable and specify lock file checking. To
   update or create a lock use `--lock=deno.lock --frozen=false`. The
   `--lock=deno.lock` tells Deno what the lock file to use is, while the
   `--frozen=false` is used to output dependency hashes to the lock file.

A `deno.lock` might look like this, storing a hash of the file against the
dependency:

```json
{
  "https://deno.land/std@0.224.0/textproto/mod.ts": "3118d7a42c03c242c5a49c2ad91c8396110e14acca1324e7aaefd31a999b71a4",
  "https://deno.land/std@0.224.0/io/util.ts": "ae133d310a0fdcf298cea7bc09a599c49acb616d34e148e263bcb02976f80dee",
  "https://deno.land/std@0.224.0/async/delay.ts": "35957d585a6e3dd87706858fb1d6b551cb278271b03f52c5a2cb70e65e00c26a",
   ...
}
```

### Auto-generated lockfile

As mentioned above, when a Deno configuration file is resolved (ex. `deno.json`)
then an additive lockfile will be automatically generated. By default, the path
of this lockfile will be `deno.lock`. You can change this path by updating your
`deno.json` to specify this:

```jsonc
{
  "lock": "./lock.file"
}
```

Or disable automatically creating and validating a lockfile by specifying:

```jsonc
{
  "lock": false
}
```

### Freezing the lockfile

The `--frozen` (alias `--frozen-lockfile`) flag causes Deno to error whenever an
attempt to update the lockfile is made. You can also enable the same behavior by
specifying the following configuration in your `deno.json` file instead:

```json
{
  "lock": {
    "frozen": true
  }
}
```

For example, say you're importing `npm:chalk@5.3.0` while using `--frozen`, and
you later tried to import `npm:chalk@5.2.0`. Instead of quitely adding a second,
out-of-date version of `chalk` to your dependency tree, Deno would fail, showing
that `npm:chalk@5.2.0` would've otherwise been added to your lockfile.

```
error: The lockfile is out of date. Run `deno cache --frozen=false` or rerun with `--frozen=false` to update it.
changes:
 7 | -      "npm:chalk@5.3.0": "npm:chalk@5.3.0"
 7 | +      "npm:chalk@5.2.0": "npm:chalk@5.2.0",
 8 | +      "npm:chalk@5.3.0": "npm:chalk@5.3.0"
21 | -      "chalk@5.3.0": {
22 | +      "chalk@5.2.0": {
23 | +        "integrity": "sha512-ree3Gqw/nazQAPuJJEy+avdl7QfZMcUvmHIKgEZkGL+xOBzRvup5Hxo6LHuMceSxOabuJLJm5Yp/92R9eMmMvA==",
24 | +        "dependencies": {}
25 | +      },
26 | +      "chalk@5.3.0": {
```

If you intend to instead update you lockfile, you can specify `--frozen=false`,
which will update the lockfile without error. You can also enable the same
functionality through the following `deno.json` configuration:

```json
{
  "lock": {
    "frozen": false
  }
}
```

> [!NOTE] `--lock-write` was replaced by `--frozen=false` was replaced in
> [Deno 1.45](https://deno.com/blog/v1.45#frozen-lockfile).

### Runtime verification

Like caching above, you can also use lock files during use of the `deno run` sub
command, validating the integrity of any locked modules during the run. Remember
that this only validates against dependencies previously added to the lock file.

You can take this a step further as well by using the `--cached-only` flag to
require that remote dependencies are already cached.

```shell
deno run --lock=deno.lock --cached-only mod.ts
```

This will fail if there are any dependencies in the dependency tree for mod.ts
which are not yet cached.
