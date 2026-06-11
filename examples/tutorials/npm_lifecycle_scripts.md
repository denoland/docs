---
title: "Run npm lifecycle scripts"
description: "Allow npm postinstall and other lifecycle scripts in Deno with deno approve-scripts, and persist approvals with the allowScripts field in deno.json."
url: /examples/npm_lifecycle_scripts_tutorial/
---

npm packages can declare lifecycle scripts such as `preinstall` and
`postinstall` that run arbitrary code during installation — a well-known supply
chain attack vector. Unlike npm, Deno does not run these scripts unless you
explicitly approve them. Packages with native addons (like `npm:better-sqlite3`)
need their build scripts to work, so this tutorial walks through approving them.

## Install a package that needs build scripts

In a project with a `package.json`, install a package that declares lifecycle
scripts:

```sh
$ deno install npm:better-sqlite3
...
╭ Warning
│
│  Ignored build scripts for packages:
│  npm:better-sqlite3@12.10.0
│
│  Run "deno approve-scripts" to run build scripts.
╰─
```

The package is installed, but its `install` script was skipped, so the native
binding is missing and the package will fail at runtime.

## Approve the scripts

`deno approve-scripts` is the way to review and run pending scripts. Run it with
no arguments for an interactive prompt listing every package with unapproved
scripts, or name packages directly:

```sh
$ deno approve-scripts npm:better-sqlite3
Approved npm:better-sqlite3
Initialize better-sqlite3@12.10.0: running 'install' script
```

## Persist approvals in deno.json

To make approvals part of the project configuration so every contributor and CI
run gets the same behavior, list the packages in the `allowScripts` field:

```json title="deno.json"
{
  "allowScripts": ["npm:better-sqlite3"]
}
```

Now a plain `deno install` runs the build scripts for the listed packages
without any extra flags. A one-off alternative is passing
`--allow-scripts=npm:better-sqlite3` to `deno install` directly.

:::note

Lifecycle scripts only execute when packages are set up in a local
`node_modules` directory. Projects with a `package.json` get one automatically;
in `deno.json`-only projects, set `"nodeModulesDir": "auto"`.

:::

:::caution

In a workspace, `allowScripts` must be defined at the workspace root, so the
security policy is consistent across all packages.

:::

For more detail, see the
[`deno approve-scripts` reference](/runtime/reference/cli/approve_scripts/) and
the
[native Node.js addons section](/runtime/reference/cli/install/#native-nodejs-addons)
of the `deno install` docs.
