---
title: "Migrate to Deno"
description: "Coming from Node.js or upgrading from Deno 1.x? Everything you need to move to Deno 2, in one place."
---

Most Node projects run on Deno with no changes — Deno supports `package.json`,
`node_modules`, and npm specifiers out of the box. This is the starting point for
moving an existing project over, whether you're coming from Node.js or upgrading
from an older version of Deno.

## Coming from Node.js

- **[Migrating from Node to Deno](/runtime/fundamentals/migrate_from_node/)** —
  the step-by-step guide: run an existing project, use Deno as your package
  manager, and handle the CommonJS edge cases.
- **[Node.js compatibility](/runtime/fundamentals/node/)** — what's supported:
  `node:` built-ins, npm packages, globals, and the known gaps.

## Upgrading from Deno 1.x

- **[Deno 1.x to 2.x migration guide](/runtime/reference/migration_guide/)** —
  the CLI and API changes between Deno 1 and Deno 2, with what to update.

## TypeScript configuration

- **[Migrating your tsconfig.json](/runtime/reference/ts_config_migration/)** —
  map `tsconfig.json` compiler options onto Deno's `deno.json`.

## After you've migrated

- **[Manage packages](/runtime/packages/)** — dependencies, workspaces, publishing.
- **[Run code](/runtime/run/)** — servers, tasks, and the permission model.
