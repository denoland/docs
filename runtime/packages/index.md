---
title: "Manage packages"
description: "Add dependencies, use npm and Node packages, organize workspaces, and publish your own modules with Deno."
---

Deno is also a package manager. Add dependencies from npm and JSR, manage them in
`deno.json`, organize multi-package workspaces, and publish your own modules — no
separate tool required.

## Guides

- **[Dependency management](/runtime/fundamentals/dependency_management/)** — add,
  version, vendor, and lock dependencies from npm and JSR.

## Concepts

- **[Modules and imports](/runtime/fundamentals/modules/)** — how Deno resolves
  modules, import maps, and HTTPS imports.
- **[Node.js and npm compatibility](/runtime/fundamentals/node/)** — using npm
  packages and `node:` built-ins.
- **[Workspaces](/runtime/fundamentals/workspaces/)** — manage a monorepo of
  related packages.

## Reference

- **[deno add](/runtime/reference/cli/add/)** /
  **[remove](/runtime/reference/cli/remove/)** — add and remove dependencies.
- **[deno install](/runtime/reference/cli/install/)** — install dependencies and
  tools.
- **[deno outdated](/runtime/reference/cli/outdated/)** /
  **[update](/runtime/reference/cli/update/)** — keep dependencies current.
- **[deno publish](/runtime/reference/cli/publish/)** — publish a package to JSR.
- **[deno why](/runtime/reference/cli/why/)** and
  **[audit](/runtime/reference/cli/audit/)** — inspect and audit the dependency tree.

## Related

- **[Migrate to Deno](/runtime/migrate/)** — bringing an npm/Node project across.
