---
last_modified: 2026-03-12
title: "deno audit"
command: audit
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno audit"
description: "Audit project dependencies for known security vulnerabilities"
---

The `deno audit` command checks your project's dependencies for known security
vulnerabilities. It reads your lock file and reports any advisories found in
vulnerability databases.

## Examples

Audit all dependencies:

```sh
deno audit
```

Show only high and critical severity vulnerabilities:

```sh
deno audit --level=high
```

Check against the [socket.dev](https://socket.dev/) vulnerability database:

```sh
deno audit --socket
```

Ignore specific CVEs (useful for suppressing false positives or accepted risks):

```sh
deno audit --ignore=CVE-2024-12345,CVE-2024-67890
```

Ignore advisories that have no available fix:

```sh
deno audit --ignore-unfixable
```

Don't error if the audit data can't be retrieved from the registry:

```sh
deno audit --ignore-registry-errors
```

## Auto-fixing vulnerabilities

Starting in Deno 2.8, pass `--fix` to automatically upgrade vulnerable direct
dependencies to a patched, semver-compatible version:

```sh
deno audit --fix
```

`deno audit --fix` updates `package.json` / `deno.json` and regenerates the
lockfile. To keep changes safe, it deliberately **skips**:

- Major-version upgrades (reported as unfixable so you can bump them
  intentionally).
- Unsupported version specifier styles such as `>=1 <2`, `1.x`, dist-tags, or
  aliases — rather than silently rewriting them to a caret range.
- Transitive dependencies that don't have a clean direct-dependency upgrade
  path. These are surfaced as "could not be fixed automatically".

Example output:

```
╭ @denotest/with-vuln1 is susceptible to prototype pollution
│ ...
Found 2 vulnerabilities
Severity: 0 low, 0 moderate, 1 high, 1 critical

Fixed 1 vulnerability:
  @denotest/with-vuln1 1.0.0 -> 1.1.0

1 vulnerability could not be fixed automatically:
  @denotest/with-vuln2 (major upgrade to 2.0.0)
```
