---
title: "deno approve-scripts"
command: approve-scripts
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno approve-scripts"
description: "Manage lifecycle scripts of npm packages in the dependency tree."
---

`deno approve-scripts` lets you review and approve pending npm lifecycle scripts
(such as `postinstall`) in your dependency tree. Unlike npm, Deno does not run
these scripts by default for security reasons.

## Basic usage

Review and approve pending scripts interactively:

```bash
deno approve-scripts
```

This will show you which packages have lifecycle scripts that haven't been
approved yet and let you approve them.

## Why lifecycle scripts are blocked by default

npm lifecycle scripts run arbitrary code during `install`. This is a known
supply chain attack vector — malicious packages can execute code on your machine
just by being installed.

Deno takes a safer approach: lifecycle scripts must be explicitly approved
before they run. See the
[Native Node.js addons](/runtime/reference/cli/install/#native-nodejs-addons)
section for more on how this works with `deno install --allow-scripts`.
