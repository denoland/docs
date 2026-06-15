---
last_modified: 2026-06-11
title: "Run Deno in GitHub Actions"
description: "Set up a GitHub Actions workflow for a Deno project: install Deno with setup-deno, cache dependencies, run fmt, lint and test, install with a frozen lockfile, and test across Deno versions."
url: /examples/deno_github_actions_tutorial/
---

Deno ships its formatter, linter, and test runner in the `deno` binary, so a CI
pipeline needs little more than installing Deno and running the corresponding
subcommands.

## A minimal workflow

The [`denoland/setup-deno`](https://github.com/denoland/setup-deno) action
installs Deno on the runner. This workflow checks formatting, lints, and runs
tests on every push and pull request:

```yaml title=".github/workflows/ci.yml"
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x # Latest stable Deno
          cache: true # Cache dependencies between runs

      - run: deno ci # Install dependencies from the lockfile

      - run: deno fmt --check
      - run: deno lint
      - run: deno test --allow-all
```

`deno-version` accepts a semver range like `v2.x`, an exact version, or
`canary`.

## Installing with a frozen lockfile

`deno ci` mirrors `npm ci`: it is roughly equivalent to deleting `node_modules`
and running `deno install --frozen`, but it errors out if `deno.lock` is
missing, and fails if `deno.json` or `package.json` changed without the lockfile
being refreshed. That catches "bumped a version but forgot to commit the
lockfile" mistakes before they reach production.

:::note

`deno ci` requires a committed `deno.lock`. If your repository doesn't have one
yet, run `deno install` locally and commit the resulting lockfile.

:::

## How the cache works

With `cache: true`, the action saves and restores `DENO_DIR`, the directory
where Deno stores downloaded dependencies. The cache key includes the job id,
the runner OS and architecture, and a hash of all `deno.lock` files
(`${{ hashFiles('**/deno.lock') }}`), so the cache is invalidated exactly when
the lockfile changes. The first run downloads everything and saves the cache;
subsequent runs restore it instead of re-downloading.

To key the cache on something else, set `cache-hash` (which implies
`cache: true`):

```yaml
- uses: denoland/setup-deno@v2
  with:
    cache-hash: ${{ hashFiles('**/deno.json') }}
```

## Testing across Deno versions

To spot breaking changes early, run the same job against stable and canary with
a matrix:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    continue-on-error: ${{ matrix.deno-version == 'canary' }}
    strategy:
      matrix:
        deno-version: [v2.x, canary]
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: ${{ matrix.deno-version }}
          cache: true
      - run: deno test --allow-all
```

`continue-on-error` keeps a canary failure from failing the whole workflow.

For cross-platform matrices, coverage uploads, and other CI providers, see
[Continuous integration](/runtime/reference/continuous_integration/).
