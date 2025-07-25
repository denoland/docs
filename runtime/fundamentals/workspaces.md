---
title: "Workspaces and monorepos"
description: "A guide to managing workspaces and monorepos in Deno. Learn about workspace configuration, package management, dependency resolution, and how to structure multi-package projects effectively."
oldUrl: /runtime/manual/basics/workspaces
---

Deno supports workspaces, also known as "monorepos", which allow you to manage
multiple related and interdependent packages simultaneously.

A "workspace" is a collection of folders containing `deno.json` or
`package.json` configuration files. The root `deno.json` file defines the
workspace:

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"]
}
```

This configures a workspace with `add` and `subtract` members, which are
directories expected to have `deno.json(c)` and/or `package.json` files.

:::info Naming

Deno uses `workspace` rather than npm's `workspaces` to represent a singular
workspace with multiple members.

:::

## Example

Let's expand on the `deno.json` workspace example and see its functionality. The
file hierarchy looks like this:

```sh
/
├── deno.json
├── main.ts
├── add/
│     ├── deno.json
│     └── mod.ts
└── subtract/
      ├── deno.json
      └── mod.ts
```

There are two workspace members (add and subtract), each with `mod.ts` files.
There is also a root `deno.json` and a `main.ts`.

The top-level `deno.json` configuration file defines the workspace and a
top-level import map applied to all members:

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "chalk": "npm:chalk@5"
  }
}
```

The root `main.ts` file uses the `chalk` bare specifier from the import map and
imports the `add` and `subtract` functions from the workspace members. Note that
it imports them using `@scope/add` and `@scope/subtract`, even though these are
not proper URLs and aren't in the import map. How are they resolved?

```ts title="main.ts"
import chalk from "chalk";
import { add } from "@scope/add";
import { subtract } from "@scope/subtract";

console.log("1 + 2 =", chalk.green(add(1, 2)));
console.log("2 - 4 =", chalk.red(subtract(2, 4)));
```

In the `add/` subdirectory, we define a `deno.json` with a `"name"` field, which
is important for referencing the workspace member. The `deno.json` file also
contains example configurations, like turning off semicolons when using
`deno fmt`.

```json title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "fmt": {
    "semiColons": false
  }
}
```

```ts title="add/mod.ts"
export function add(a: number, b: number): number {
  return a + b;
}
```

The `subtract/` subdirectory is similar but does not have the same `deno fmt`
configuration.

```json title="subtract/deno.json"
{
  "name": "@scope/subtract",
  "version": "0.3.0",
  "exports": "./mod.ts"
}
```

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

Let's run it:

```sh
> deno run main.ts
1 + 2 = 3
2 - 4 = -2
```

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

## Workspace path patterns

Deno supports pattern matching for workspace member folders, making it easier to
manage workspaces with many members or with a specific directory structure. You
can use wildcard patterns to include multiple directories at once:

```json title="deno.json"
{
  "workspace": [
    "some-dir/*",
    "other-dir/*/*"
  ]
}
```

The pattern matching syntax follows specific rules regarding folder depth:

`some-path/*` matches files and directories directly within `some-path` (first
level of indentation only). For example, with `packages/*`, this includes
`packages/foo` and `packages/bar` but not `packages/foo/subpackage`.

`some-path/*/*` matches the files and directories located within subdirectories
of `some-path` (second level of indentation). It does not match items directly
within `some-path`. For example, with `examples/*/*`, this includes
`examples/basic/demo` and `examples/advanced/sample` but not `examples/basic`.

Each `/*` segment in the pattern corresponds to a specific folder depth relative
to the base path. This allows for precise targeting of workspace members at
different levels within your directory structure.

## How Deno resolves workspace dependencies

When running a project in a workspace that imports from another workspace
member, Deno follows these steps to resolve the dependencies:

1. Deno starts in the directory of the executing project (e.g., project A)
2. It looks up in the parent directory for a root `deno.json` file
3. If found, it checks for the `workspace` property in that file
4. For each import statement in project A, Deno checks if the import matches a
   package name defined in any workspace member's `deno.json`
5. If a matching package name is found, Deno verifies that the containing
   directory is listed in the root workspace configuration
6. The import is then resolved to the correct file using the `exports` field in
   the workspace member's `deno.json`

For example, given this structure:

```sh
/
├── deno.json         # workspace: ["./project-a", "./project-b"]
├── project-a/
│   ├── deno.json     # name: "@scope/project-a"
│   └── mod.ts        # imports from "@scope/project-b"
└── project-b/
    ├── deno.json     # name: "@scope/project-b"
    └── mod.ts
```

When `project-a/mod.ts` imports from `"@scope/project-b"`, Deno:

1. Sees the import statement
2. Checks parent directory's `deno.json`
3. Finds `project-b` in the workspace array
4. Verifies `project-b/deno.json` exists and has matching package name
5. Resolves the import using `project-b`'s exports

### Important note for containerization

When containerizing a workspace member that depends on other workspace members,
you must include:

1. The root `deno.json` file
2. All dependent workspace packages
3. The same directory structure as your development environment

For example, if dockerizing `project-a` above, your Dockerfile should:

```dockerfile
COPY deno.json /app/deno.json
COPY project-a/ /app/project-a/
COPY project-b/ /app/project-b/
```

This preserves the workspace resolution mechanism that Deno uses to find and
import workspace dependencies.

### Multiple package entries

The `exports` property details the entry points and exposes which modules should
be importable by users of your package.

So far, our package only has a single entry. This is fine for simple packages,
but often you'll want to have multiple entries that group relevant aspects of
your package. This can be done by passing an `object` instead of a `string` to
`exports`:

```json title="my-package/deno.json"
{
  "name": "@scope/my-package",
  "version": "0.3.0",
  "exports": {
    ".": "./mod.ts",
    "./foo": "./foo.ts",
    "./other": "./dir/other.ts"
  }
}
```

The `"."` entry is the default entry that's picked when importing
`@scope/my-package`. Therefore, the above `deno.json` example provides the
following entries:

- `@scope/my-package`
- `@scope/my-package/foo`
- `@scope/my-package/other`

### Publishing workspace packages to registries

Workspaces make it easy to publish packages to registries like JSR or NPM. You
can publish individual workspace members while keeping their development
connected in your monorepo.

#### Publishing to JSR

To publish a workspace package to JSR, follow these steps:

1. Ensure each package has the appropriate metadata in its `deno.json`:

```json title="my-package/deno.json"
{
  "name": "@scope/my-package",
  "version": "1.0.0",
  "exports": "./mod.ts",
  "publish": {
    "exclude": ["tests/", "*.test.ts", "examples/"]
  }
}
```

2. Navigate to the specific package directory and publish:

```sh
cd my-package
deno publish
```

#### Managing interdependent packages

When publishing packages from a workspace with interdependencies, use consistent
versioning schemes across related packages. Publish dependent packages first,
then the packages that depend on them. After publishing, verify the published
packages work as expected:

```sh
# Test a published package
deno add jsr:@scope/my-published-package
deno test integration-test.ts
```

When publishing packages that depend on other workspace members, Deno will
automatically replace workspace references with proper registry references in
the published code.

### Migrating from `npm` workspaces

Deno workspaces support using a Deno-first package from an existing npm package.
In this example, we mix and match a Deno library called `@deno/hi`, with a
Node.js library called `@deno/log` that we developed a couple years back.

We'll need to include a `deno.json` configuration file in the root:

```json title="deno.json"
{
  "workspace": {
    "members": ["hi"]
  }
}
```

Alongside our existing package.json workspace:

```json title="package.json"
{
  "workspaces": ["log"]
}
```

The workspace currently has a log npm package:

```json title="log/package.json"
{
  "name": "@deno/log",
  "version": "0.5.0",
  "type": "module",
  "main": "index.js"
}
```

```js title="log/index.js"
export function log(output) {
  console.log(output);
}
```

Let's create an `@deno/hi` Deno-first package that imports `@deno/log`:

```json title="hi/deno.json"
{
  "name": "@deno/hi",
  "version": "0.2.0",
  "exports": "./mod.ts",
  "imports": {
    "log": "npm:@deno/log@^0.5"
  }
}
```

```ts title="hi/mod.ts"
import { log } from "log";

export function sayHiTo(name: string) {
  log(`Hi, ${name}!`);
}
```

Now, we can write a `main.ts` file that imports and calls `hi`:

```ts title="main.ts"
import { sayHiTo } from "@deno/hi";

sayHiTo("friend");
```

```sh
$ deno run main.ts
Hi, friend!
```

You can even have both `deno.json` and `package.json` in your existing Node.js
package. Additionally, you could remove the package.json in the root and specify
the npm package in the deno.json workspace members. That allows you to gradually
migrate to Deno, without putting a lot of upfront work.

For example, you can add `log/deno.json` to configure Deno's linter and
formatter:

```jsonc
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

Running `deno fmt` in the workspace, will format the `log` package to not have
any semicolons, and `deno lint` won't complain if you leave an unused var in one
of the source files.

## Configuring built-in Deno tools

Some configuration options only make sense at the root of the workspace, eg.
specifying `nodeModulesDir` option in one of the members is not available and
Deno will warn if an option needs to be applied at the workspace root.

Here's a full matrix of various `deno.json` options available at the workspace
root and its members:

| Option             | Workspace | Package | Notes                                                                                                                                                                                                           |
| ------------------ | --------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| compilerOptions    | ✅        | ✅      |                                                                                                                                                                                                                 |
| importMap          | ✅        | ❌      | Exclusive with imports and scopes per config file. Additionally, it is not supported to have importMap in the workspace config, and imports in the package config.                                              |
| imports            | ✅        | ✅      | Exclusive with importMap per config file.                                                                                                                                                                       |
| scopes             | ✅        | ❌      | Exclusive with importMap per config file.                                                                                                                                                                       |
| exclude            | ✅        | ✅      |                                                                                                                                                                                                                 |
| lint.include       | ✅        | ✅      |                                                                                                                                                                                                                 |
| lint.exclude       | ✅        | ✅      |                                                                                                                                                                                                                 |
| lint.files         | ⚠️        | ❌      | Deprecated                                                                                                                                                                                                      |
| lint.rules.tags    | ✅        | ✅      | Tags are merged by appending package to workspace list. Duplicates are ignored.                                                                                                                                 |
| lint.rules.include |           |         |                                                                                                                                                                                                                 |
| lint.rules.exclude | ✅        | ✅      | Rules are merged per package, with package taking priority over workspace (package include is stronger than workspace exclude).                                                                                 |
| lint.report        | ✅        | ❌      | Only one reporter can be active at a time, so allowing different reporters per workspace would not work in the case where you lint files spanning multiple packages.                                            |
| fmt.include        | ✅        | ✅      |                                                                                                                                                                                                                 |
| fmt.exclude        | ✅        | ✅      |                                                                                                                                                                                                                 |
| fmt.files          | ⚠️        | ❌      | Deprecated                                                                                                                                                                                                      |
| fmt.useTabs        | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                          |
| fmt.indentWidth    | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                          |
| fmt.singleQuote    | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                          |
| fmt.proseWrap      | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                          |
| fmt.semiColons     | ✅        | ✅      | Package takes priority over workspace.                                                                                                                                                                          |
| fmt.options.\*     | ⚠️        | ❌      | Deprecated                                                                                                                                                                                                      |
| nodeModulesDir     | ✅        | ❌      | Resolution behaviour must be the same in the entire workspace.                                                                                                                                                  |
| vendor             | ✅        | ❌      | Resolution behaviour must be the same in the entire workspace.                                                                                                                                                  |
| tasks              | ✅        | ✅      | Package tasks take priority over workspace. cwd used is the cwd of the config file that the task was inside of.                                                                                                 |
| test.include       | ✅        | ✅      |                                                                                                                                                                                                                 |
| test.exclude       | ✅        | ✅      |                                                                                                                                                                                                                 |
| test.files         | ⚠️        | ❌      | Deprecated                                                                                                                                                                                                      |
| publish.include    | ✅        | ✅      |                                                                                                                                                                                                                 |
| publish.exclude    | ✅        | ✅      |                                                                                                                                                                                                                 |
| bench.include      | ✅        | ✅      |                                                                                                                                                                                                                 |
| bench.exclude      | ✅        | ✅      |                                                                                                                                                                                                                 |
| bench.files        | ⚠️        | ❌      | Deprecated                                                                                                                                                                                                      |
| lock               | ✅        | ❌      | Only a single lock file may exist per resolver, and only resolver may exist per workspace, so conditional enablement of the lockfile per package does not make sense.                                           |
| unstable           | ✅        | ❌      | For simplicities sake, we do not allow unstable flags, because a lot of the CLI assumes that unstable flags are immutable and global to the entire process. Also weird interaction with DENO_UNSTABLE_\* flags. |
| name               | ❌        | ✅      |                                                                                                                                                                                                                 |
| version            | ❌        | ✅      |                                                                                                                                                                                                                 |
| exports            | ❌        | ✅      |                                                                                                                                                                                                                 |
| workspace          | ✅        | ❌      | Nested workspaces are not supported.                                                                                                                                                                            |

## Running commands across workspaces

Deno provides several ways to run commands across all or specific workspace
members:

### Running tests

To run tests across all workspace members, simply execute `deno test` from the
workspace root:

```sh
deno test
```

This will run tests in all workspace members according to their individual test
configurations.

To run tests for a specific workspace member, you can either:

1. Change to that member's directory and run the test command:

```sh
cd my-directory
deno test
```

2. Or specify the path from the workspace root:

```sh
deno test my-directory/
```

### Formatting and linting

Similar to testing, formatting and linting commands run across all workspace
members by default:

```sh
deno fmt
deno lint
```

Each workspace member follows its own formatting and linting rules as defined in
its `deno.json` file, with some settings inherited from the root configuration
as shown in the table above.

### Using workspace tasks

You can define tasks at both the workspace root and in individual workspace
members:

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "tasks": {
    "build": "echo 'Building all packages'",
    "test:all": "deno test"
  }
}
```

```json title="add/deno.json"
{
  "name": "@scope/add",
  "version": "0.1.0",
  "exports": "./mod.ts",
  "tasks": {
    "build": "echo 'Building add package'",
    "test": "deno test"
  }
}
```

To run a task defined in a specific package:

```sh
deno task --cwd=add build
```

## Sharing and managing dependencies

Workspaces provide powerful ways to share and manage dependencies across
projects:

### Sharing development dependencies

Common development dependencies like testing libraries can be defined at the
workspace root:

```json title="deno.json"
{
  "workspace": ["./add", "./subtract"],
  "imports": {
    "@std/testing/": "jsr:@std/testing@^0.218.0/",
    "chai": "npm:chai@^4.3.7"
  }
}
```

This makes these dependencies available to all workspace members without needing
to redefine them.

### Managing version conflicts

When resolving dependencies, workspace members can override dependencies defined
in the root. If both the root and a member specify different versions of the
same dependency, the member's version will be used when resolving within that
member's folder. This allows individual packages to use specific dependency
versions when needed.

However, member-specific dependencies are scoped only to that member's folder.
Outside of member folders, or when working with files at the workspace root
level, the workspace root's import map will be used for resolving dependencies
(including JSR and HTTPS dependencies).

### Interdependent workspace members

As shown in the earlier example with the `add` and `subtract` modules, workspace
members can depend on each other. This enables a clean separation of concerns
while maintaining the ability to develop and test interdependent modules
together.

The `subtract` module imports functionality from the `add` module, demonstrating
how workspace members can build upon each other:

```ts title="subtract/mod.ts"
import { add } from "@scope/add";

export function subtract(a: number, b: number): number {
  return add(a, b * -1);
}
```

This approach allows you to:

1. Break down complex projects into manageable, single-purpose packages
2. Share code between packages without publishing to a registry
3. Test and develop interdependent modules together
4. Gradually migrate monolithic codebases to modular architecture

## Using workspace protocol in package.json

Deno supports workspace protocol specifiers in `package.json` files. These are
useful when you have npm packages that depend on other packages within the
workspace:

```json title="package.json"
{
  "name": "my-npm-package",
  "dependencies": {
    "another-workspace-package": "workspace:*"
  }
}
```

The following workspace protocol specifiers are supported:

- `workspace:*` - Use the latest version available in the workspace
- `workspace:~` - Use the workspace version with only patch-level changes
- `workspace:^` - Use the workspace version with semver-compatible changes

## npm and pnpm workspace compatibility

Deno works seamlessly with standard npm workspaces defined in `package.json`:

```json title="package.json"
{
  "workspaces": ["packages/*"]
}
```

For pnpm users, Deno supports typical pnpm workspace configurations. However, if
you're using a `pnpm-workspace.yaml` file, you'll need to migrate to a
`deno.json` workspace configuration:

```yaml title="pnpm-workspace.yaml (to be replaced)"
packages:
  - "packages/*"
```

Should be converted to:

```json title="deno.json"
{
  "workspace": ["packages/*"]
}
```

This allows for smooth integration between Deno and npm/pnpm ecosystems during
migration or in hybrid projects.

For more information on configuring your project, check out the
[Configuration with deno.json](/examples/configuration_with_deno_json/)
tutorial.
