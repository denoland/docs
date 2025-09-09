---
tags: [workspace]
---

Ensure that all dependencies are declared in either `deno.json` or
`package.json`.

### Invalid:

```ts
import foo from "https://deno.land/std/path/mod.ts";
import foo from "jsr:@std/path@1";
import foo from "npm:preact@10";
```

### Valid:

```ts
// Mapped in `deno.json` or `package.json`
import foo from "@std/path";
```
