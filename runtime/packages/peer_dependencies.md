---
last_modified: 2026-06-15
title: "Peer dependencies"
description: "Peer dependencies are an npm and package.json feature. deno.json has no peerDependencies field or equivalent. How Deno resolves peer dependencies when you consume npm packages, the node_modules layout caveat, optional peers, and fixing unmet-peer errors."
---

Peer dependencies are an npm feature. A package declares them in its
`package.json` to say it expects the project that installs it to provide a
compatible copy of another package, instead of bundling its own:

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

## `peerDependencies` lives in `package.json`, not `deno.json`

`peerDependencies` is a `package.json` field, and that is the only place Deno
reads peer dependencies from. **`deno.json` has no `peerDependencies` field and
no equivalent.** Its `imports` map resolves module specifiers to locations; it
is an import map, not an npm-style manifest that separates regular, dev, and
peer dependencies.

In practice that means:

- **Authoring a package.** If you publish a package that needs the host project
  to supply a dependency, you declare that in a `package.json` using
  `peerDependencies`. There is no way to express it in `deno.json`.
- **Consuming a package.** When you install an npm package, Deno reads its
  `peerDependencies` and resolves them from your project's dependency graph, the
  same way npm does. You satisfy a peer dependency by making the package
  resolvable in your project, whether your project uses `deno.json` or
  `package.json`.

## Providing a peer dependency

Add the peer dependency alongside the package that needs it. In a `deno.json`
project, list both in `imports`:

```json title="deno.json"
{
  "imports": {
    "react": "npm:react@^19",
    "some-react-plugin": "npm:some-react-plugin@^1"
  }
}
```

`some-react-plugin` then resolves its `react` peer dependency to the same
`npm:react@^19` your application imports. You are not declaring a peer
dependency here, only making `react` available in the graph so the plugin's
declared peer can resolve to it. In a `package.json` project, you list `react`
in `dependencies`, exactly as you would in Node.

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

A package can mark a peer dependency as optional through `peerDependenciesMeta`
in its `package.json`:

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
