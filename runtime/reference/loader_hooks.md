---
last_modified: 2026-07-09
title: "Loader hooks"
description: "Customize module resolution and loading in Deno using the Node.js-compatible module.registerHooks() API. Create virtual modules, transpile custom formats, and intercept imports."
oldUrl: /runtime/reference/module_hooks/
---

Deno supports the Node.js
[`module.registerHooks()`](https://nodejs.org/api/module.html#moduleregisterhooksoptions)
API, which lets you intercept and customize how modules are resolved and loaded.
This enables virtual modules, custom transpilation, module aliasing, and similar
use cases without modifying the importing code. The `node:module` API is part of
Deno's broader [Node.js compatibility](/runtime/fundamentals/node/) layer.

The hooks are **synchronous** and run **in the same thread** as your
application. They work for both ES modules (`import`) and CommonJS
(`require()`).

> Deno does not implement the asynchronous `module.register()` API. Use
> `registerHooks()` for both CommonJS and ESM customization.

## Basic example

```js title="main.mjs"
import { registerHooks } from "node:module";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "virtual:greet") {
      return { url: "file:///virtual_greet.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///virtual_greet.js") {
      return {
        source: 'export const msg = "hello from hooks";',
        format: "module",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const { msg } = await import("virtual:greet");
console.log(msg); // "hello from hooks"

// Remove hooks when no longer needed
hooks.deregister();
```

```sh
deno run --allow-all main.mjs
```

## Loading hooks with `--import`

To keep your application code clean — and to make sure the hooks are installed
before anything in your program imports the modules they affect — put the
`registerHooks()` call in its own loader file and preload it with `--import` (an
alias for `--preload`).

```js title="loader.mjs"
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "virtual:greet") {
      return { url: "file:///virtual_greet.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///virtual_greet.js") {
      return {
        source: 'export const msg = "hello from loader";',
        format: "module",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});
```

```js title="main.mjs"
const { msg } = await import("virtual:greet");
console.log(msg); // "hello from loader"
```

Run with `--import` pointing at the loader:

```sh
deno run --import ./loader.mjs main.mjs
```

`--import` accepts multiple values, so you can compose loaders (e.g.
`--import ./aliases.mjs --import ./transpile.mjs`). They register in the order
given, which is the reverse of the order in which they run — see
[Hook chaining](#hook-chaining). The flag is available on
[`deno run`](/runtime/reference/cli/run/),
[`deno test`](/runtime/reference/cli/test/),
[`deno bench`](/runtime/reference/cli/bench/), and
[`deno serve`](/runtime/reference/cli/serve/).

## Use cases

### Custom transpilation

Transform non-standard file formats on the fly:

```js
import { registerHooks } from "node:module";

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".coffee")) {
      const result = nextLoad(url, context);
      const compiled = compileCoffeeScript(result.source);
      return { source: compiled, format: "module", shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
```

### Module aliasing

Redirect imports to different modules:

```js
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    // Redirect lodash to lodash-es
    if (specifier === "lodash") {
      return nextResolve("lodash-es", context);
    }
    return nextResolve(specifier, context);
  },
});
```

### Virtual modules

Create modules that exist only in memory:

```js
import { registerHooks } from "node:module";

const virtualModules = new Map([
  ["virtual:config", 'export default { debug: true, version: "1.0.0" };'],
  ["virtual:env", `export const NODE_ENV = "${process.env.NODE_ENV}";`],
]);

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (virtualModules.has(specifier)) {
      return { url: `file:///virtual/${specifier}`, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    for (const [name, source] of virtualModules) {
      if (url === `file:///virtual/${name}`) {
        return { source, format: "module", shortCircuit: true };
      }
    }
    return nextLoad(url, context);
  },
});
```

### Mocking for tests

Replace modules with mocks during testing:

```js
import { registerHooks } from "node:module";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "./database.js") {
      return { url: "file:///mock_database.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///mock_database.js") {
      return {
        source: 'export const query = () => [{ id: 1, name: "mock" }];',
        format: "module",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

// Run tests...

hooks.deregister(); // Clean up after tests
```

## External dependencies in hook-generated source

:::info

<strong>`jsr:`, `npm:`, and `https:` specifiers are not resolved automatically
when they appear only in source produced by a hook.</strong> This applies to any
`load` hook that returns source Deno did not read from disk itself — custom
transpilation, virtual modules, mocks, and so on.

Deno discovers and installs external dependencies by statically analyzing your
module graph <em>before</em> execution. Source returned from a `load` hook is
generated at load time, after that analysis has completed, so any bare `jsr:`,
`npm:`, or `https:` import that only appears in the emitted source is invisible
to dependency resolution. You will see errors such as
`Could not find constraint 'lodash-es@latest' in the list of packages.`

To use an external dependency from hook-generated code, declare it up front so
it is part of the resolved package set. For example, add it to the `imports` map
in your `deno.json`:

```json title="deno.json"
{
  "imports": {
    "lodash-es": "npm:lodash-es@latest"
  }
}
```

and import it by its mapped name from the generated source. This is working as
designed: dependency resolution is deterministic and lockfile-driven, which
requires the dependency set to be known ahead of execution.

:::

## The `resolve` hook

The `resolve` hook intercepts module resolution, mapping specifiers to URLs.

```js
resolve(specifier, context, nextResolve);
```

**Parameters:**

| Parameter     | Type       | Description                                        |
| ------------- | ---------- | -------------------------------------------------- |
| `specifier`   | `string`   | The module specifier being resolved                |
| `context`     | `object`   | Resolution context (see below)                     |
| `nextResolve` | `function` | Delegates to the next hook or the default resolver |

**Context object:**

| Property           | Type       | Description                                            |
| ------------------ | ---------- | ------------------------------------------------------ |
| `conditions`       | `string[]` | Import conditions (e.g., `["node", "import"]` for ESM) |
| `parentURL`        | `string`   | URL of the importing module                            |
| `importAttributes` | `object`   | Import attributes from the import statement            |

**Return value:**

| Property       | Type      | Description                                  |
| -------------- | --------- | -------------------------------------------- |
| `url`          | `string`  | The resolved URL for the module              |
| `shortCircuit` | `boolean` | If `true`, skip remaining hooks in the chain |

Either call `nextResolve()` to delegate, or return a result with
`shortCircuit: true`. You must do one or the other.

## The `load` hook

The `load` hook intercepts module loading, providing the source code for a
resolved URL.

```js
load(url, context, nextLoad);
```

**Parameters:**

| Parameter  | Type       | Description                                      |
| ---------- | ---------- | ------------------------------------------------ |
| `url`      | `string`   | The resolved module URL                          |
| `context`  | `object`   | Load context (see below)                         |
| `nextLoad` | `function` | Delegates to the next hook or the default loader |

**Context object:**

| Property           | Type       | Description                                         |
| ------------------ | ---------- | --------------------------------------------------- |
| `format`           | `string`   | Module format hint (e.g., `"module"`, `"commonjs"`) |
| `conditions`       | `string[]` | Import conditions                                   |
| `importAttributes` | `object`   | Import attributes                                   |

**Return value:**

| Property       | Type                       | Description                                       |
| -------------- | -------------------------- | ------------------------------------------------- |
| `source`       | `string \| Buffer \| null` | The module source code                            |
| `format`       | `string`                   | Module format: `"module"`, `"commonjs"`, `"json"` |
| `shortCircuit` | `boolean`                  | If `true`, skip remaining hooks in the chain      |

## Deregistering hooks

`registerHooks()` returns an object with a `deregister()` method to remove the
hooks:

```js
const hooks = registerHooks({/* ... */});

// Later, remove hooks
hooks.deregister();
```

## Hook chaining

You can register multiple hooks; they form a chain. Hooks run in LIFO (last
registered, first called) order, and each hook can call `nextResolve()` /
`nextLoad()` to pass control to the previous hook in the chain:

```js
import { registerHooks } from "node:module";

// Hook 1: registered first, runs second
const hook1 = registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url.includes("target.js")) {
      return {
        source: 'export default "from hook1"',
        format: "module",
        shortCircuit: true,
      };
    }
    return result;
  },
});

// Hook 2: registered second, runs first
const hook2 = registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context); // Calls hook1
    if (url.includes("target.js")) {
      return {
        source: 'export default "from hook2"',
        format: "module",
        shortCircuit: true,
      };
    }
    return result;
  },
});

// Result comes from hook2 since it runs first (LIFO)
```

## CommonJS

Hooks also intercept `require()`:

```js title="main.cjs"
const { registerHooks } = require("module");

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "virtual-module") {
      return { url: "file:///virtual.js", shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url === "file:///virtual.js") {
      return {
        source: "module.exports = { value: 42 }",
        format: "commonjs",
        shortCircuit: true,
      };
    }
    return nextLoad(url, context);
  },
});

const mod = require("virtual-module");
console.log(mod.value); // 42

hooks.deregister();
```
