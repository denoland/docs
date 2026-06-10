---
title: "Migrate from Node.js"
description: "Most Node projects run on Deno with no changes. Everything you need to move an existing Node.js project to Deno, in one place."
---

Most Node projects run on Deno with no changes — Deno supports `package.json`,
`node_modules`, and npm specifiers out of the box. This is the starting point for
moving an existing Node.js project over.

## Make the move

- **[Migrating from Node to Deno](/runtime/fundamentals/migrate_from_node/)** —
  the step-by-step guide: run an existing project, use Deno as your package
  manager, and handle the CommonJS edge cases.
- **[Node.js compatibility](/runtime/fundamentals/node/)** — what's supported:
  `node:` built-ins, npm packages, globals, and the known gaps.
- **[Migrating your tsconfig.json](/runtime/reference/ts_config_migration/)** —
  map `tsconfig.json` compiler options onto Deno's `deno.json`.

## After you've migrated

- **[Manage packages](/runtime/packages/)** — dependencies, workspaces, publishing.
- **[Run code](/runtime/run/)** — servers, tasks, and the permission model.

> Already on Deno and upgrading a major version? See the
> **[Deno 1.x to 2.x migration guide](/runtime/reference/migration_guide/)**.
