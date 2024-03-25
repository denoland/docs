import { replacements } from "@site/src/components/Replacement";

# Reloading Modules

By default, a module in the cache will be reused without fetching or
re-compiling it. Sometimes this is not desirable and you can force deno to
refetch and recompile modules into the cache. You can invalidate your local
`DENO_DIR` cache using the `--reload` flag of the `deno cache` subcommand. It's
usage is described below:

## To reload everything

```bash
deno cache --reload my_module.ts
```

## To reload specific modules

Sometimes we want to upgrade only some modules. You can control it by passing an
argument to a `--reload` flag.

<p>
  To reload all deno_std's fs module:
</p>

```bash
deno cache --reload=jsr:std/fs@^0 my_module.ts
```

To reload specific modules (in this example - colors and file system copy) use a
comma to separate URLs.

```bash
deno cache --reload=jsr:std/fs@^0/copy.ts,jsr:std/fmt@^0/colors.ts my_module.ts
```

<!-- Should this be part of examples? -->
