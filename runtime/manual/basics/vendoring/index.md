---
title: "Caching dependencies locally (Vendoring)"
---

If your project has external dependencies, you may want to store them locally to
avoid downloading them from the internet every time you build your project. This
is especially useful when building your project on a CI server or in a Docker
container, or patching or otherwise modifying the remote dependencies.

Deno offers this functionality through a setting in your `deno.json` file.
Simply add

```json
{
  "vendor": true
}
```

to your `deno.json` file. This will cache all dependencies locally in a `vendor`
directory when the project is run, or you can optionally run the `deno cache`
command to cache the dependencies immediately:

```bash
deno cache main.ts
```

You can then run the application as usual with `deno run`:

```bash
deno run main.ts
```

## Running the Vendored Application

After vendoring, you can run `main.ts` without internet access by using the
`--cached-only` flag, which forces Deno to use only locally available modules.
