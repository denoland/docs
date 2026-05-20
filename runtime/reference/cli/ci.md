---
last_modified: 2026-05-20
title: "deno ci"
command: ci
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno ci"
description: "Reproducible install for CI environments"
---

`deno ci` performs a reproducible install for CI environments, mirroring
`npm ci`. Use it in CI scripts and Dockerfiles when you want an obvious,
greppable signal that the install must exactly match the lockfile.

```sh
deno ci
```

Compared to `deno install`, `deno ci`:

- Errors out if `deno.lock` is missing instead of generating one.
- Removes any existing `node_modules` directory before installing, so leftover
  state from a previous run can't leak in.
- Runs the install with `--frozen` so the lockfile must match the configuration
  file exactly; if `deno.json` or `package.json` has been edited without
  updating the lockfile, the command fails.

The intent is to give CI a single command that produces the same install every
time, without having to remember which combination of flags on `deno install`
adds up to "reproducible."

## Flags

`deno ci` accepts a subset of the flags that `deno install` accepts:

- `--prod` — skip dev dependencies, matching the same flag on `deno install`.
- `--skip-types` — skip downloading TypeScript declaration files for npm
  packages.

## Examples

Install in a GitHub Actions job:

```yaml title=".github/workflows/test.yml"
- uses: denoland/setup-deno@v2
  with:
    deno-version: v2.x
- run: deno ci
- run: deno test
```

Install in a Dockerfile:

```dockerfile
FROM denoland/deno:2.8.0
WORKDIR /app
COPY deno.json deno.lock package.json* ./
RUN deno ci --prod
COPY . .
CMD ["deno", "run", "-A", "main.ts"]
```

See also [`deno install`](/runtime/reference/cli/install/) for the everyday
install command.
