---
title: "Workspaces"
---

Deno supports workspaces, which is a very powerful tool for managing monorepos,
migrating from Node.js or scoping configuration to particular directories.

A "workspace" is a collection of folders that contain configuration files. These
config files may contain directory specific config or define a package.

```jsonc, title="deno.json"
{
  // or shorthand: "workspace": ["./add", "./subtract"]
  "workspace": {
    "members": ["./add", "./subtract"]
  }
}
```

The above `deno.json` file configures a workspace with `add` and `subtract`
members, these are names of the directories that are expected to have a
`deno.json(c)` and/or `package.json` file.

Note that Deno workspaces uses the keyword `workspace` rather than npm's
`workspaces`, since it represents a singular workspace with multiple workspace
members.

## Monorepo example

Let's see the above workspace in action, in a small and simple 2-package
monorepo:

```json, title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}
```

```ts, title="add/mod.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

```json, title="subtract/deno.json"
{
  "name": "@scope/subtract",
  "version": "0.3.0",
  "exports": "./mod.ts"
}
```

```js, title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

```json, title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

```js, title="main.ts"
import chalk from "chalk";
import { add } from "@scope/add";
import { subtract } from "@scope/subtract";

console.log("1 + 2 =", chalk.green(add(1, 2)));
console.log("2 - 4 =", chalk.red(subtract(2, 4)));
```

Let's run it:

![Workspace example](/img/workspace-example.png)

There's a lot to unpack here, showcasing some of the Deno workspace features:

1. This monorepo consists of two packages, placed in `./add` and `./subtract`
   directories.

1. By using `name` and `version` options in members' `deno.json` files, it's
   possible to refer to them using "bare specifiers" across the whole workspace.
   In this case, the packages are named `@scope/add` and `@scope/subtract`,
   where `scope` is the "scope" name you can choose. With these two options,
   it's not necessary to use long and relative file paths in import statements.

1. `npm:chalk@5` package is a shared dependency in the entire workspace.
   Workspace members "inherit" `imports` of the workspace root, allowing to
   easily manage a single version of a dependency across the codebase.

1. `add` subdirectory specifies in its `deno.json` that `deno fmt` should not
   apply semicolons when formatting the code. This makes for a much smoother
   transition for existing projects, without a need to change tens or hundreds
   of files in one go.

---

Deno workspaces are flexible and can work with Node packages. To make migration
for existing Node.js projects easier you can have both Deno-first and Node-first
packages in a single workspace.

### Migrating from `npm` workspaces

Deno workspaces support using a Deno-first package from an existing npm package.
In this example, we mix and match a Deno library called `fizz`, with a Node.js
library called `buzz` that we developed a couple years back.

We'll need to include a `deno.json` configuration file in the root:

```js, title="deno.json"
{
  "nodeModulesDir": true,
  "workspace": ["fizz", "buzz"]
}
```

Note that with `nodeModulesDir` being set to `true`, we specified want to keep
using `node_modules/`.

In `fizz`, our Deno-first package:

```js, title="fizz/deno.json"
{
  "name": "@deno-workspace/fizz",
  "version": "0.2.0",
  "exports": "./mod.ts"
}
```

```js, title="fizz/mod.ts"
export function logProject(project) {
  console.log(project);
}
```

And in `buzz`, our legacy Node.js package:

```js, title="buzz/package.json"
{
  "name": "@deno-workspace/buzz",
  "version": "0.5.0",
  "type": "module",
  "main": "index.js",
  "dependencies": {
    "ts-morph": "*"
  }
}
```

```js, title="buzz/index.json"
import { Project } from "ts-morph";
import { createProject } from "@deno-workspace/fizz";

function createProject() {
  return new Project();
}

const project = createProject();
logProject(project);
```

Now, when we run `buzz/main.ts`, we should see the output:

```
$ deno run -A buzz/main.ts
Project {
  _context: ProjectContext {
    logger: ConsoleLogger {},
    ...
  }
}
```

You can even have both `deno.json` and `package.json` in your existing Node.js
package. That allows you to gradually migrate to Deno, without putting a lot of
upfront work.

For example, you can add `buzz/deno.json` like to to configure Deno's linter and
formatter:

```json
{
  "fmt": {
    "semiColons": false
  },
  "lint": {
    "rules": {
      "exclude": ["no-unused-vars"]
    }
  }
}
```

Running `deno fmt` in the workspace, will format `buzz` package to not have any
semicolons, and `deno lint` won't complain if you leave an unused var in one of
the source files.

## Configuring built-in Deno tools

Some configuration options only make sense at the root of the workspace, eg.
specifying `nodeModuleDir` option in one of the members is not available and
Deno will warn if an option needs to be applied at the workspace root.

Here's a full matrix of various `deno.json` options available at the workspace
root and its members:

| Option             | Workspace | Package | Notes                                                                                                                                                                                                                                                                                  |
| ------------------ | --------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| compilerOptions    | ✅        | ❌      | For now we only allow one set of compilerOptions per workspace this because it will require multiple changes to both deno_graph and the TSC integration to allow it. Also we’d have to determine what compilerOptions apply to remote dependencies. We can revisit this in the future. |
| importMap          | ✅        | ❌      | Exclusive with imports and scopes per config file. It is allowed to have importMap in the workspace config, and imports in the package config.                                                                                                                                         |
| imports            | ✅        | ✅      | Exclusive with importMap per config file.                                                                                                                                                                                                                                              |
| scopes             | ✅        | ❌      | Exclusive with importMap per config file.                                                                                                                                                                                                                                              |
| exclude            | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| lint.include       | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| lint.exclude       | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| lint.files         | ⚠️         | ❌      | Deprecated                                                                                                                                                                                                                                                                             |
| lint.rules.tags    | ✅        | ✅      | Tags are merged by appending package to workspace list. Duplicates are ignored.                                                                                                                                                                                                        |
| lint.rules.include |           |         |                                                                                                                                                                                                                                                                                        |
| lint.rules.exclude | ✅        | ✅      | Rules are merged per package, with package taking priority over workspace (package include is stronger than workspace exclude).                                                                                                                                                        |
| lint.report        | ✅        | ❌      | Only one reporter can be active at a time, so allowing different reporters per workspace would not work in the case where you lint files spanning multiple packages.                                                                                                                   |
| fmt.include        | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| fmt.exclude        | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| fmt.files          | ⚠️         | ❌      | Deprecated                                                                                                                                                                                                                                                                             |
| fmt.useTabs        | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                                                                                                 |
| fmt.indentWidth    | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                                                                                                 |
| fmt.singleQuote    | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                                                                                                 |
| fmt.proseWrap      | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                                                                                                 |
| fmt.semiColons     | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                                                                                                 |
| fmt.options.*      | ⚠️         | ❌      | Deprecated                                                                                                                                                                                                                                                                             |
| nodeModulesDir     | ✅        | ❌      | Resolution behaviour must be the same in the entire workspace.                                                                                                                                                                                                                         |
| vendor             | ✅        | ❌      | Resolution behaviour must be the same in the entire workspace.                                                                                                                                                                                                                         |
| tasks              | ✅        | ✅      | Package tasks take priority over workspace. cwd used is the cwd of the config file that the task was inside of.                                                                                                                                                                        |
| test.include       | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| test.exclude       | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| test.files         | ⚠️         | ❌      | Deprecated                                                                                                                                                                                                                                                                             |
| publish.include    | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| publish.exclude    | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| bench.include      | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| bench.exclude      | ✅        | ✅      |                                                                                                                                                                                                                                                                                        |
| bench.files        | ⚠️         | ❌      | Deprecated                                                                                                                                                                                                                                                                             |
| lock               | ✅        | ❌      | Only a single lock file may exist per resolver, and only resolver may exist per workspace, so conditional enablement of the lockfile per package does not make sense.                                                                                                                  |
| unstable           | ✅        | ❌      | For simplicities sake, we do not allow unstable flags, because a lot of the CLI assumes that unstable flags are immutable and global to the entire process. Also weird interaction with DENO_UNSTABLE_* flags.                                                                         |
| name               | ❌        | ✅      |                                                                                                                                                                                                                                                                                        |
| version            | ❌        | ✅      |                                                                                                                                                                                                                                                                                        |
| exports            | ❌        | ✅      |                                                                                                                                                                                                                                                                                        |
| workspace          | ✅        | ❌      | Nested workspaces are not supported.                                                                                                                                                                                                                                                   |

### Specyfing workspace configuration

```
{
    "workspace": {
        "members": ["foo", "bar"]
    }
}
```
