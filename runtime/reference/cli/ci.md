---
last_modified: 2026-05-20
title: "deno ci"
command: ci
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno ci"
description: "Reproducible install for CI environments"
---

`deno ci` performs a reproducible install for CI environments, mirroring
`npm ci`. Use it in CI scripts and Dockerfiles when you want a single, greppable
command that's guaranteed to install exactly what the lockfile records — no
drift, no leftover state, no surprises.

```sh
deno ci
```

## What it does

`deno ci` is roughly equivalent to:

```sh
rm -rf node_modules
deno install --frozen
```

but with stricter error handling and clearer failure modes:

1. **Requires a lockfile.** If `deno.lock` is missing or unreadable, `deno ci`
   errors out instead of generating one. This guarantees that two runs of the
   same commit install the same versions.
2. **Wipes `node_modules` first.** Any stale state from a previous CI step (or a
   leaked development install) is removed before installing, so the final tree
   reflects only what the lockfile resolved to.
3. **Locks resolution with `--frozen`.** If `deno.json` or `package.json` has
   been edited without re-running `deno install` to refresh the lockfile, the
   command fails. This catches "I bumped a version but forgot to commit the
   lockfile" mistakes before they reach production.

If any of those checks fail, the install does not proceed.

## When to use it

| Scenario                               | Use                        |
| -------------------------------------- | -------------------------- |
| CI build / test / lint pipeline        | `deno ci`                  |
| Production Docker image                | `deno ci --prod`           |
| Local development (frequent edits)     | `deno install`             |
| Adding or removing a package           | `deno add` / `deno remove` |
| First-time bootstrap (no lockfile yet) | `deno install`             |

The rule of thumb: pick `deno ci` whenever the install must be reproducible and
there is no expectation that the lockfile should change. Pick `deno install`
whenever you're iterating on dependencies.

## Examples

### GitHub Actions

```yaml title=".github/workflows/test.yml"
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno ci
      - run: deno test
      - run: deno lint
      - run: deno fmt --check
```

### Production Dockerfile

```dockerfile
FROM denoland/deno:2.8.0
WORKDIR /app

# Copy the manifest files first so install caches well
COPY deno.json deno.lock package.json* ./
RUN deno ci --prod

# Then copy the rest of the source
COPY . .
CMD ["deno", "run", "-A", "main.ts"]
```

Splitting the `COPY` into "manifests first, source after" lets Docker reuse the
`deno ci` layer whenever your dependencies are unchanged.

### Production install on the host

```sh
deno ci --prod --skip-types
```

`--prod` skips `devDependencies` from `package.json`. `--skip-types` drops
`@types/*` packages from both `deno.json` imports and `package.json`
dependencies — useful in deployment artifacts where types add weight and aren't
needed at runtime.

## Common failure modes

| Error                                       | Likely cause                                                                                        | Fix                                                                                                                   |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| "deno.lock is missing"                      | No lockfile is committed.                                                                           | Run `deno install` locally and commit the resulting `deno.lock`.                                                      |
| "lockfile is out of date"                   | A dependency was added or bumped in `deno.json` / `package.json` but the lockfile wasn't refreshed. | Run `deno install` locally and commit the updated `deno.lock`.                                                        |
| Build-script approval prompts in non-TTY CI | A new npm package wants to run lifecycle scripts that haven't been approved.                        | Approve them locally with [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) and commit the approvals. |

## See also

- [`deno install`](/runtime/reference/cli/install/) — everyday install, with
  full flag reference
- [Continuous integration](/runtime/reference/continuous_integration/) — guide
  to running Deno in GitHub Actions and other CI providers
- [`deno audit`](/runtime/reference/cli/audit/) — scan dependencies for known
  vulnerabilities, complements `deno ci` in CI
- [`deno approve-scripts`](/runtime/reference/cli/approve_scripts/) — manage
  which npm lifecycle scripts are allowed to run
