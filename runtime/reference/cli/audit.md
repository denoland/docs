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
