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

```sh title=">_"
deno approve-scripts
```

This will show you which packages have lifecycle scripts that haven't been
approved yet.

## Why lifecycle scripts are blocked by default

npm lifecycle scripts (such as `preinstall` and `postinstall`) run arbitrary
code during the install process. This is a known supply chain attack vector —
malicious packages can execute code on your machine just by being installed.

Deno takes a safer approach: lifecycle scripts must be explicitly approved
before they run.
