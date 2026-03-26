---
tags: [workspace]
---

Ensure that all dependencies are declared in either `deno.json` or
`package.json`.

This promotes better dependency management and makes it easier to track and
update dependencies. It also helps Deno purge the lockfile when removing a
dependency.

### Invalid:

```ts
import foo from "https://deno.land/std/path/mod.ts";
import foo from "jsr:@std/path@1";
import foo from "npm:preact@10";
```

### Valid:

```ts
import foo from "@std/path";
```

With a corresponding entry in the `deno.json` or `package.json` file:

```jsonc title="deno.json"
{
  "imports": {
    "@std/path": "jsr:@std/path@1"
  }
}
```
