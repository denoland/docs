---
title: "deno check"
oldUrl: /runtime/manual/tools/check/
command: check
---

## Description

Type-check without execution.

```ts title="example.ts"
const x: string = 1 + 1n;
```

```bash
deno check example.ts
```

## Examples

- Type check a local file

  ```bash
  deno check example.ts
  ```
