---
title: "Integrity Checking & Lock Files"
---

## Introduction

Let's say your module depends on remote module `https://some.url/a.ts`. When you
compile your module for the first time `a.ts` is retrieved, compiled and cached.
It will remain this way until you run your module on a new machine (say in
production) or reload the cache (through `deno cache --reload` for example). But
what happens if the content in the remote url `https://some.url/a.ts` is
changed? This could lead to your production module running with different
dependency code than your local module. Deno's solution to avoid this is to use
integrity checking and lock files.

## Caching and lock files

Deno can store and check subresource integrity for modules using a small JSON
file. To opt into a lock file, either:

1. Create a `deno.json` file in the current or an ancestor directory, which will
   automatically create an additive lockfile at `deno.lock`.
2. Use the `--lock=deno.lock` to enable and specify lock file checking. To
   update or create a lock use `--lock=deno.lock --frozen=false`. The
   `--lock=deno.lock` tells Deno what the lock file to use is, while the
   `--frozen=false` is used to output dependency hashes to the lock file.

A `deno.lock` might look like this, storing a hash of the file against the
dependency:

```json
{
  "https://deno.land/std@0.224.0/textproto/mod.ts": "3118d7a42c03c242c5a49c2ad91c8396110e14acca1324e7aaefd31a999b71a4",
  "https://deno.land/std@0.224.0/io/util.ts": "ae133d310a0fdcf298cea7bc09a599c49acb616d34e148e263bcb02976f80dee",
  "https://deno.land/std@0.224.0/async/delay.ts": "35957d585a6e3dd87706858fb1d6b551cb278271b03f52c5a2cb70e65e00c26a",
   ...
}
```

### Auto-generated lockfile

As mentioned above, when a Deno configuration file is resolved (ex. `deno.json`)
then an additive lockfile will be automatically generated. By default, the path
of this lockfile will be `deno.lock`. You can change this path by updating your
`deno.json` to specify this:

```jsonc
{
  "lock": "./lock.file"
}
```

Or disable automatically creating and validating a lockfile by specifying:

```jsonc
{
  "lock": false
}
```

### Freezing the lockfile

The `--frozen` (alias `--frozen-lockfile`) flag causes Deno to error whenever an
attempt to update the lockfile is made. You can also enable the same behavior by
specifying the following configuration in your `deno.json` file instead:

```json
{
  "lock": {
    "frozen": true
  }
}
```

For example, say you're importing `npm:chalk@5.3.0` while using `--frozen`, and
you later tried to import `npm:chalk@5.2.0`. Instead of quitely adding a second,
out-of-date version of `chalk` to your dependency tree, Deno would fail, showing
that `npm:chalk@5.2.0` would've otherwise been added to your lockfile.

```
error: The lockfile is out of date. Run `deno cache --frozen=false` or rerun with `--frozen=false` to update it.
changes:
 7 | -      "npm:chalk@5.3.0": "npm:chalk@5.3.0"
 7 | +      "npm:chalk@5.2.0": "npm:chalk@5.2.0",
 8 | +      "npm:chalk@5.3.0": "npm:chalk@5.3.0"
21 | -      "chalk@5.3.0": {
22 | +      "chalk@5.2.0": {
23 | +        "integrity": "sha512-ree3Gqw/nazQAPuJJEy+avdl7QfZMcUvmHIKgEZkGL+xOBzRvup5Hxo6LHuMceSxOabuJLJm5Yp/92R9eMmMvA==",
24 | +        "dependencies": {}
25 | +      },
26 | +      "chalk@5.3.0": {
```

If you intend to instead update you lockfile, you can specify `--frozen=false`,
which will update the lockfile without error.

> [!NOTE] `--lock-write` was replaced by `--frozen=false` was replaced in
> [Deno 1.45](https://deno.com/blog/v1.45#frozen-lockfile).

## Runtime verification

Like caching above, you can also use lock files during use of the `deno run` sub
command, validating the integrity of any locked modules during the run. Remember
that this only validates against dependencies previously added to the lock file.

You can take this a step further as well by using the `--cached-only` flag to
require that remote dependencies are already cached.

```shell
deno run --lock=deno.lock --cached-only mod.ts
```

This will fail if there are any dependencies in the dependency tree for mod.ts
which are not yet cached.
