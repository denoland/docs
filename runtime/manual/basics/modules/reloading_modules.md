---
title: "Reloading Modules"
oldUrl:
  - /runtime/manual/linking_to_external_code/reloading_modules
  - /runtime/manual/linkingtoexternal_code
---

By default, Deno uses a global cache directory (`DENO_DIR`) for downloaded
dependencies. This cache is shared across all projects.

You can force deno to refetch and recompile modules into the cache using the
`--reload` flag of the `deno cache` or `deno run` subcommand.

```bash
# Reload everything
deno cache --reload my_module.ts
# Reload a specific module
deno cache --reload=jsr:@std/fs my_module.ts
```

## Vendoring

To create a cache directory per project, set `"vendor": true` in your
`deno.json`. [Read more about vendoring](../vendoring/).
