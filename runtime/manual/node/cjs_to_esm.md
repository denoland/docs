---
title: "Updating from CommonJS to ESM"
---

If your Node.js project uses CommonJS modules (e.g. it uses `require`), you'll
need to update your code to use
[ECMAScript modules (ESM)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
to run it in Deno. This guide will help you update your code to use ESM syntax.

## Module imports and exports

Deno supports [ECMAScript modules](../basics/modules/index.md) exclusively. If
your Node.js code uses
[`require`](https://nodejs.org/api/modules.html#modules-commonjs-modules), you
should update it to use `import` statements instead. If your internal code uses
CommonJS-style exports, those will also need to be updated.

A typical CommonJS-style project might look similar to this:

```js title="add_numbers.js"
module.exports = function addNumbers(num1, num2) {
  return num1 + num2;
};
```

```js title="index.js"
const addNumbers = require("./add_numbers");
console.log(addNumbers(2, 2));
```

To convert these to [ECMAScript modules](../basics/modules/index.md), we'll make
a few minor changes:

```js title="add_numbers.js"
export function addNumbers(num1, num2) {
  return num1 + num2;
}
```

```js title="index.js"
import { addNumbers } from "./add_numbers.js";
console.log(addNumbers(2, 2));
```

Exports:

| CommonJS                             | ECMAScript modules                 |
| ------------------------------------ | ---------------------------------- |
| `module.exports = function add() {}` | `export default function add() {}` |
| `exports.add = function add() {}`    | `export function add() {}`         |

Imports:

| CommonJS                                   | ECMAScript modules                       |
| ------------------------------------------ | ---------------------------------------- |
| `const add = require("./add_numbers");`    | `import add from "./add_numbers.js";`    |
| `const { add } = require("./add_numbers")` | `import { add } from "./add_numbers.js"` |

### Quick fix with VS Code

If you are using VS Code, you can use its built-in feature to convert CommonJS
to ES6 modules. Right-click on the `require` statement, or the lightbulb icon
and select `Quick Fix` and then `Convert to ES module`.

![Quick Fix](../images/quick-fix.png)

### CommonJS vs ECMAScript resolution

An important distinction between the two module systems is that ECMAScript
resolution requires the full specifier **including the file extension**.
Omitting the file extension, and special handling of `index.js`, are features
unique to CommonJS. The benefit of the ECMAScript resolution is that it works
the same across the browser, Deno, and other runtimes.

| CommonJS             | ECMAScript modules            |
| -------------------- | ----------------------------- |
| `"./add_numbers"`    | `"./add_numbers.js"`          |
| `"./some/directory"` | `"./some/directory/index.js"` |

:::tip

Deno can add all the missing file extensions for you by running
`deno lint --fix`. Deno's linter comes with a `no-sloppy-imports` rule that will
show a linting error when an import path doesn't contain the file extension.

:::
