---
last_modified: 2026-05-05
title: "Module Customization Hooks"
description: "Customize module resolution and loading in Deno using Node.js-compatible module.register() and module.registerHooks() APIs. Create virtual modules, transpile custom formats, and intercept imports."
---

Deno supports Node.js module customization hooks, allowing you to intercept and
customize how modules are resolved and loaded. This enables powerful use cases
like virtual modules, custom transpilation, module aliasing, and more.

Two APIs are available:

- **`module.registerHooks()`** - Synchronous, in-thread hooks for both CommonJS
  and ESM
- **`module.register()`** - Asynchronous hook modules for ESM

## module.registerHooks()

The `registerHooks()` API lets you register synchronous hooks that run in the
same thread as your application code. It works with both CommonJS (`require()`)
and ES modules (`import`).

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

### resolve hook

The `resolve` hook intercepts module resolution, allowing you to map specifiers
to URLs.

```js
resolve(specifier, context, nextResolve)
```

**Parameters:**

| Parameter     | Type     | Description                                       |
| ------------- | -------- | ------------------------------------------------- |
| `specifier`   | `string` | The module specifier being resolved                |
| `context`     | `object` | Resolution context (see below)                     |
| `nextResolve` | `function` | Call to delegate to the next hook or default resolver |

**Context object:**

| Property           | Type       | Description                                                 |
| ------------------ | ---------- | ----------------------------------------------------------- |
| `conditions`       | `string[]` | Import conditions (e.g., `["node", "import"]` for ESM)      |
| `parentURL`        | `string`   | URL of the importing module                                  |
| `importAttributes` | `object`   | Import attributes from the import statement                  |

**Return value:**

Must return an object with:

| Property       | Type      | Description                                     |
| -------------- | --------- | ----------------------------------------------- |
| `url`          | `string`  | The resolved URL for the module                  |
| `shortCircuit` | `boolean` | If `true`, skip remaining hooks in the chain     |

Either call `nextResolve()` to delegate, or return with `shortCircuit: true` to
provide the final result. You must do one or the other.

### load hook

The `load` hook intercepts module loading, allowing you to provide custom source
code.

```js
load(url, context, nextLoad)
```

**Parameters:**

| Parameter  | Type     | Description                                       |
| ---------- | -------- | ------------------------------------------------- |
| `url`      | `string` | The resolved module URL                            |
| `context`  | `object` | Load context (see below)                           |
| `nextLoad` | `function` | Call to delegate to the next hook or default loader |

**Context object:**

| Property           | Type       | Description                                       |
| ------------------ | ---------- | ------------------------------------------------- |
| `format`           | `string`   | Module format hint (e.g., `"module"`, `"commonjs"`) |
| `conditions`       | `string[]` | Import conditions                                  |
| `importAttributes` | `object`   | Import attributes                                  |

**Return value:**

Must return an object with:

| Property       | Type                       | Description                                |
| -------------- | -------------------------- | ------------------------------------------ |
| `source`       | `string \| Buffer \| null` | The module source code                      |
| `format`       | `string`                   | Module format: `"module"`, `"commonjs"`, `"json"` |
| `shortCircuit` | `boolean`                  | If `true`, skip remaining hooks in the chain |

### Deregistering hooks

`registerHooks()` returns an object with a `deregister()` method to remove the
hooks:

```js
const hooks = registerHooks({ /* ... */ });

// Later, remove hooks
hooks.deregister();
```

### Hook chaining

Multiple hooks can be registered and form a chain. Hooks run in LIFO (last
registered, first called) order. Each hook can call `nextResolve()`/`nextLoad()`
to pass control to the previous hook in the chain:

```js
import { registerHooks } from "node:module";

// Hook 1: registered first, runs second
const hook1 = registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context);
    if (url.includes("target.js")) {
      return { source: 'export default "from hook1"', format: "module", shortCircuit: true };
    }
    return result;
  },
});

// Hook 2: registered second, runs first
const hook2 = registerHooks({
  load(url, context, nextLoad) {
    const result = nextLoad(url, context); // Calls hook1
    if (url.includes("target.js")) {
      return { source: 'export default "from hook2"', format: "module", shortCircuit: true };
    }
    return result;
  },
});

// Result comes from hook2 since it runs first (LIFO)
```

### CommonJS example

Hooks also work with `require()`:

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
        source: 'module.exports = { value: 42 }',
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

## module.register()

The `register()` API loads a hook module that exports async `resolve` and `load`
functions. This follows the Node.js customization hooks specification and is
suitable for ESM.

```js title="main.mjs"
import { register } from "node:module";

register("./hooks.mjs", import.meta.url);

// Allow the hook module to initialize
await new Promise((resolve) => setTimeout(resolve, 50));

const { greeting } = await import("virtual:hello");
console.log(greeting); // "hello from register hooks"
```

```js title="hooks.mjs"
export async function resolve(specifier, context, nextResolve) {
  if (specifier === "virtual:hello") {
    return { url: "file:///virtual_hello.js", shortCircuit: true };
  }
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url === "file:///virtual_hello.js") {
    return {
      source: 'export const greeting = "hello from register hooks";',
      format: "module",
      shortCircuit: true,
    };
  }
  return nextLoad(url, context);
}
```

### Passing data to hooks

You can pass initialization data to hook modules using the `data` option and an
`initialize` export:

```js title="main.mjs"
import { register } from "node:module";
import { MessageChannel } from "node:worker_threads";

const { port1, port2 } = new MessageChannel();

register("./hooks.mjs", {
  parentURL: import.meta.url,
  data: { port: port2 },
  transferList: [port2],
});
```

```js title="hooks.mjs"
let port;

export async function initialize(data) {
  port = data.port;
  port.postMessage("hooks initialized");
}

export async function resolve(specifier, context, nextResolve) {
  port.postMessage(`resolving: ${specifier}`);
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url, context);
}
```

### Options

```js
register(specifier, parentURL)
register(specifier, options)
register(specifier, parentURL, options)
```

| Option         | Type     | Description                                       |
| -------------- | -------- | ------------------------------------------------- |
| `parentURL`    | `string \| URL` | Base URL for resolving relative hook module specifiers |
| `data`         | `any`    | Data passed to the hook module's `initialize()` function |
| `transferList` | `any[]`  | Objects to transfer to the hook module             |

### Hook execution order

When both `registerHooks()` and `register()` are used, synchronous hooks
(`registerHooks`) always run before async hooks (`register`). Within each
category, hooks run in LIFO order (last registered runs first).

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

## Compatibility with Node.js

Deno's implementation follows the Node.js module customization hooks
specification. Key implementation details:

- Both sync and async hooks run in the same thread (Node.js runs `register()`
  hooks in a separate loader thread)
- `registerHooks()` works with both CommonJS and ESM
- `register()` works with ESM only
- The `transferList` option passes items by reference (same-thread model)
