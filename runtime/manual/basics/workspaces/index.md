---
title: "Workspaces"
---

Deno supports workspaces, which is a very powerful tool for managing monorepos,
migrating from Node.js or scoping configuration to particular directories.

A "workspace" is a collection of "members". Members are subdirectories specified in the configuration file:

```js
// deno.json
{
    "workspace": {
        "members": ["foo", "./bar"]
    }
}

// or...
{
    "workspace": ["foo", "bar"]
}
```

The above `deno.json` file configures a workspace with `foo` and `bar` members, these are names
of the directories that are expected to have `deno.json(c)` (or `package.json`) files.

## Monorepo example

Let's see the above workspace in action, in a small and simple 2-package monorepo:


```js
// foo/deno.json
{
  "name": "@scope/foo",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}

// foo/mod.ts
import chalk from "chalk"
import { helloHelper } from "@scope/bar"

export function foo() {
  return chalk.red(helloHelper() + "foo")
}
```

```js
// bar/deno.json
{
  "name": "@scope/bar",
  "version": "0.3.0",
  "exports": "./lib.ts"
}

// bar/lib.ts
import chalk from "chalk";

export function bar() {
  return chalk.green(helloHelper() + "bar");
}

export function helloHelper() {
  return "Hello, from ";
}
```

```js
// deno.json
{
  "workspace": ["./foo", "./bar"],
  "imports": {
    "chalk": "npm:chalk"
  }
}

// main.ts
import { foo } from "@scope/foo";
import { bar } from "@scope/bar";

console.log(foo());
console.log(bar());
```

Let's run it:

```
$ deno run -A main.ts
Hello, from foo
Hello, from bar
```

**TODO: add screenshot to show that colors actually work?**

There's a lot to unpack here, showcasing some of the Deno workspace features:

1. This monorepo consists of two packages, placed in `./foo` and `./bar` directories.

1. By using `name` and `version` options in members' `deno.json` files, it's possible to refer to them
using "bare specifiers" across the whole workspace. In this case, the packages are named `@scope/foo` and `@scope/bar`, where `scope` is the "scope" name you can choose. With these two options, it's not necessary to use long and relative file paths in import statements.

1. `npm:chalk` package is a shared dependency between `foo` and `bar` packages. 
Workspace members "inherit" `imports` of the workspace root, allowing to easily manage
a single version of a dependency across the codebase.

1. `foo` subdirectory specifies in its `deno.json` that `deno fmt` should not apply semicolons
when formatting the code. This makes for a much smoother transition for existing projects, without
a need to change tens or hundreds of files in one go.

--- 

Deno workspaces are a lot more powerful. To make migration for existing Node.js projects easier you can
have both Deno-first and Node-first packages in a single workspace.

### Migrating from `npm` workspaces

Using another example with `fizz` and `buzz` workspace members, where `buzz` is an already existing `npm` package:

```js
// fizz/deno.json
{
  "name": "@deno-workspace/fizz",
  "version": "0.2.0",
  "exports": "./mod.ts"
}

// fizz/mod.ts
export function logProject(project) {
    console.log(project);
}
```

```js
// buzz/package.json
{
  "name": "@deno-workspace/buzz",
  "version": "0.5.0",
  "type": "module",
  "main": "index.js",
  "dependencies": {
    "ts-morph": "*"
  }
}

// buzz/index.js
import { Project } from "ts-morph";
import { createProject } from "@deno-workspace/fizz";

function createProject() {
    return new Project();
}

const project = createProject();
logProject(project);
```

```js
// deno.json
{
  "nodeModulesDir": true,
  "workspace": ["fizz", "buzz"]
}
```

In this example, we mix and match a Deno library called `fizz`, with a Node.js library called `buzz` that we developed a couple years back. It's possible to use Deno-first package from existing npm package. Additionally we specified that we want to keep using `node_modules/` directory.

```
$ deno run -A buzz/main.ts
Project {
  _context: ProjectContext {
    logger: ConsoleLogger {},
    ...
  }
}
```

You can even have both `deno.json` and `package.json` in your existing Node.js package. That allows you to gradually migrate to Deno, without putting a lot of upfront work.

As an example, you can add `buzz/deno.json` like to to configure Deno's linter and formatter:

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

Running `deno fmt` in the workspace, will format `buzz` package to not have any semicolons, and `deno lint`
won't complain if you leave an unused var in one of the source files.

## Configuring built-in Deno tools

Some configuration options only make sense at the root of the workspace, eg. specifying `nodeModuleDir` option in one of the members is not available and Deno will warn if an option needs to be applied at the workspace root.

Here's a full matrix of various `deno.json` options available at the workspace root and its members:


| Option | Workspace | Package | Notes |
| --- | --- | --- | --- |
| compilerOptions | ✅ | ❌ | For now we only allow one set of compilerOptions per workspace this because it will require multiple changes to both deno_graph and the TSC integration to allow it. Also we’d have to determine what compilerOptions apply to remote dependencies. We can revisit this in the future. |
| importMap  | ✅ | ❌ | Exclusive with imports and scopes per config file. It is allowed to have importMap in the workspace config, and imports in the package config. |
| imports  | ✅ | ✅ | Exclusive with importMap per config file. |
| scopes | ✅ | ❌ | Exclusive with importMap per config file. |
| exclude  | ✅ | ✅ |  |
| lint.include | ✅ | ✅ |  |
| lint.exclude | ✅ | ✅ |  |
| lint.files | ⚠️ | ❌ | Deprecated |
| lint.rules.tags  | ✅ | ✅ | Tags are merged by appending package to workspace list. Duplicates are ignored. |
| lint.rules.include
lint.rules.exclude | ✅ | ✅ | Rules are merged per package, with package taking priority over workspace (package include is stronger than workspace exclude). |
| lint.report  | ✅ | ❌ | Only one reporter can be active at a time, so allowing different reporters per workspace would not work in the case where you lint files spanning multiple packages. |
| fmt.include | ✅ | ✅ |  |
| fmt.exclude | ✅ | ✅ |  |
| fmt.files | ⚠️ | ❌ | Deprecated |
| fmt.useTabs  | ✅ | ✅ | Package takes priority over workspace. |
| fmt.indentWidth  | ✅ | ✅ | Package takes priority over workspace. |
| fmt.singleQuote | ✅ | ✅ | Package takes priority over workspace. |
| fmt.proseWrap | ✅ | ✅ | Package takes priority over workspace. |
| fmt.semiColons | ✅ | ✅ | Package takes priority over workspace. |
| fmt.options.*  | ⚠️ | ❌ | Deprecated |
| nodeModulesDir | ✅ | ❌ | Resolution behaviour must be the same in the entire workspace. |
| vendor  | ✅ | ❌ | Resolution behaviour must be the same in the entire workspace. |
| tasks | ✅ | ✅ | Package tasks take priority over workspace. cwd used is the cwd of the config file that the task was inside of. |
| test.include | ✅ | ✅ |  |
| test.exclude | ✅ | ✅ |  |
| test.files | ⚠️ | ❌ | Deprecated |
| publish.include | ✅ | ✅ |  |
| publish.exclude | ✅ | ✅ |  |
| bench.include | ✅ | ✅ |  |
| bench.exclude | ✅ | ✅ |  |
| bench.files | ⚠️ | ❌ | Deprecated |
| lock  | ✅ | ❌ | Only a single lock file may exist per resolver, and only resolver may exist per workspace, so conditional enablement of the lockfile per package does not make sense. |
| unstable  | ✅ | ❌ | For simplicities sake, we do not allow unstable flags, because a lot of the CLI assumes that unstable flags are immutable and global to the entire process. Also weird interaction with DENO_UNSTABLE_* flags. |
| name | ❌ | ✅ |  |
| version | ❌ | ✅ |  |
| exports | ❌ | ✅ |  |
| workspace  | ✅ | ❌ | Nested workspaces are not supported. |

### Specyfing workspace configuration

```
{
    "workspace": {
        "members": ["foo", "bar"]
    }
}
```
