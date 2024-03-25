# Publishing Modules

Deno is not prescriptive about how developers make their modules
available—modules may be imported from any source. To help publish and
distribute modules, separate standalone solutions are provided.

## Publishing on deno.land/x

A common way to publish Deno modules is via the official
[https://deno.land/x](https://deno.land/x) hosting service. It caches releases
of open source modules and serves them at one easy to remember domain.

To use it, modules must be developed and hosted in public repositories on
GitHub. Their source is then published to deno.land/x on tag creation. They can
then be accessed by using a url in the following format:

```console
https://deno.land/x/<module_name>@<tag_name>/<file_path>
```

Module versions are persistent and immutable. It is thus not possible to edit or
delete a module (or version), to prevent breaking programs that rely on this
module. Modules may be removed if there is a legal reason to do so (for example
copyright infringement).

For more details, see [Adding a Module](https://deno.land/add_module).

## Auto-generating documentation for modules

When a module is published, the contents of the module are analyzed. An
automated process identifies modules that contain code that Deno understands and
generates documentation based on the code. For each path, including the root
path, it attempts to identify the default module. In order of preference it
looks for `mod`, `lib`, `main`, or `index` files with an extension that Deno
understands (ts,tsx,js,jsx,mjs, or mts). When viewing the documentation for the
module for a path, the default module will be shown.

If a default module cannot be identified, a list of modules that can be
documented will be provided instead. When generating the documentation, not only
is the actual code parsed to generate it, inline documentation, in the form of
JSDoc (/** */) is used to enrich the documentation. Many JSDoc tags are
supported. To provide module level documentation (which also becomes the path
level documentation when it is included in a default module), use the @module
tag at the end of the first JSDoc block in the module.

## Including version numbers in code and content

import { replacements } from "@site/src/components/Replacement";

Current module version, Deno CLI version, and standard library version can be
dynamically included in content or code samples using following replacement
variables.

- `$MODULE_VERSION`
- `$CLI_VERSION`

For example, to include the current module version in README.md:

```ts
import "https://deno.land/x/<module_name>@$MODULE_VERSION/mod.ts";
```

If the current version of the module is 1.0.0, the above import statement will
be replaced with:

```ts
import "https://deno.land/x/<module_name>@1.0.0/mod.ts";
```

## Publishing Deno modules for Node.js/npm

We have built a tool that assists in the process of taking Deno specific code
and publishing it to npm to work under Node.js or other parts of the JavaScript
ecosystem. See [dnt - Deno to Node.js Transform](./dnt.md).
