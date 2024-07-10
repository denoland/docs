---
title: "Workspaces"
---

You can now create and work with existing monorepos with Deno - let's consider
the simplest monorepo with two packages `foo` and `bar`:

```js
// foo/deno.json
{
  "name": "@my-scope/foo",
  "version": "0.1.0",
  "exports": "./mod.ts"
}

// foo/mod.ts
import chalk from "chalk";
import { helloHelper } from "@my-scope/bar";

export function foo() {
  return chalk.red(helloHelper() + "foo");
}
```

```js
// bar/deno.json
{
  "name": "@my-scope/bar",
  "version": "0.3.0",
  "exports": "./lib.ts"
}

// bar/lib.ts
import chalk from "chalk";

export function bar() {
  return chalk.green(helloHelper() + "bar");
}

export function helloHelper() {
  return "Hello, from ";
}
```

```js
// deno.json
{
  "workspace": ["./foo", "./bar"],
  "imports": {
    "chalk": "npm:chalk"
  }
}

// main.ts
import { foo } from "@my-scope/foo";
import { bar } from "@my-scope/bar";

console.log(foo());
console.log(bar());
```

Let's run it:

```
$ deno run -A main.ts
Hello, from foo
Hello, from bar
```

**TODO: add screenshot to show that colors actually work?**

There's a lot to unpack here:

1. We have two packages `foo` and `bar` that share dependency on `chalk`
2. We only specified `chalk` in the import map in the workspace root
3. We are able to use "bare-specifiers" to refer to workspace members
