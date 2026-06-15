---
last_modified: 2026-06-15
title: "Peer dependencies"
description: "How Deno resolves npm peer dependencies: what peerDependencies mean, providing them from your own project, how the node_modules layout affects resolution, optional peers, and fixing unmet peer dependency errors."
---

A peer dependency is a package that one of your dependencies expects _your_
project to provide, instead of bundling its own copy. Packages declare them in
the `peerDependencies` field of their `package.json`:

```json title="package.json (inside an npm package)"
{
  "name": "some-react-plugin",
  "peerDependencies": {
    "react": "^19"
  }
}
```

Plugins and extensions use peer dependencies so that the plugin and its host
share a single copy of a package. A React component library, for example,
declares `react` as a peer dependency so it renders with the exact React your
app already uses, rather than pulling in a second, possibly mismatched, copy.

## How Deno resolves peer dependencies

Deno reads the `peerDependencies` of the npm packages you install and resolves
them from your project's dependency graph, the same way npm and other package
managers do. The package that declares the peer dependency uses the version your
project provides.

Because the host project is expected to supply the package, you list the peer
dependency among your own dependencies. Add it to the `imports` in `deno.json`
(or to `dependencies` in `package.json` if you use one) alongside the package
that needs it:

```json title="deno.json"
{
  "imports": {
    "react": "npm:react@^19",
    "some-react-plugin": "npm:some-react-plugin@^1"
  }
}
```

With both listed, `some-react-plugin` resolves its `react` peer dependency to
the same `npm:react@^19` your application imports.

## node_modules layout and peer dependencies

How peer dependencies resolve depends on the
[node_modules layout](/runtime/fundamentals/node/#node_modules) Deno uses.

In the default **isolated** layout, each package only sees the dependencies it
declares, so a peer dependency must be provided by your project (as shown above)
for the package to find it. This catches missing peers early instead of letting
a package accidentally resolve a sibling it never declared.

Some npm tooling assumes the **hoisted** layout that npm and Yarn classic use,
where dependencies are flattened to the top of `node_modules`. If a package
walks `node_modules` looking for a peer dependency as a flat-resolved sibling
and cannot find it, switch to the hoisted linker (which requires a
manually-managed `node_modules` directory):

```json title="deno.json"
{
  "nodeModulesDir": "manual",
  "nodeModulesLinker": "hoisted"
}
```

## Optional peer dependencies

A package can mark a peer dependency as optional through `peerDependenciesMeta`:

```json title="package.json (inside an npm package)"
{
  "peerDependencies": {
    "react": "^19"
  },
  "peerDependenciesMeta": {
    "react": { "optional": true }
  }
}
```

You only need to provide optional peer dependencies if you use the feature that
relies on them. A package that supports several frameworks, for instance, may
list each as an optional peer and use whichever one you have installed.

## Fixing unmet peer dependencies

If a package's peer dependency is not present, importing it fails with a
module-not-found error for the missing package. To fix it, add the peer
dependency to your project's dependencies and run `deno install` so the version
is part of your graph:

```sh
deno install
```

If the package instead expects to find the peer dependency as a hoisted sibling
in `node_modules`, see
[node_modules layout](/runtime/fundamentals/node/#node_modules) and switch to
the hoisted linker as shown above. For more on how Deno works with npm packages
and `node_modules`, see
[Node compatibility](/runtime/fundamentals/node/#using-npm-packages).
