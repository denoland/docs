---
last_modified: 2026-03-09
title: "Configuration file (deno.json)"
description: "Reference for every deno.json field: dependencies and import maps, tasks, lint and fmt, lockfile, node_modules directory, TypeScript compiler options, unstable flags, include/exclude, exports, permissions, compile, and proxies."
oldUrl:
  - /runtime/manual/basics/modules/import_maps/
  - /runtime/basics/import_maps/
  - /runtime/manual/linking_to_external_code/import_maps
  - /manual/linking_to_external_code/proxies
---

This page documents the fields you can set in a `deno.json` (or `deno.jsonc`)
configuration file. For an overview of how Deno discovers and applies
configuration, and how `deno.json` relates to `package.json`, see the
[Configuration](/runtime/fundamentals/configuration/) concept page.

## Dependencies

The `"imports"` field in your `deno.json` allows you to specify dependencies
used in your project. You can use it to map bare specifiers to URLs or file
paths making it easier to manage dependencies and module resolution in your
applications.

For example, if you want to use the `assert` module from the standard library in
your project, you could use this import map:

```json title="deno.json"
{
  "imports": {
    "@std/assert": "jsr:@std/assert@^1.0.0",
    "chalk": "npm:chalk@5"
  }
}
```

Then your script can use the bare specifier `std/assert`:

```js title="script.ts"
import { assertEquals } from "@std/assert";
import chalk from "chalk";

assertEquals(1, 2);
console.log(chalk.yellow("Hello world"));
```

You can also use a `"dependencies"` field in `package.json`:

```json title="package.json"
{
  "dependencies": {
    "express": "^1.0.0"
  }
}
```

```js title="script.ts"
import express from "express";

const app = express();
```

Note that this will require you to run `deno install`.

Read more about
[module imports and dependencies](/runtime/fundamentals/modules/)

### Custom path mappings

The import map in `deno.json` can be used for more general path mapping of
specifiers. You can map an exact specifiers to a third party module or a file
directly, or you can map a part of an import specifier to a directory.

```jsonc title="deno.jsonc"
{
  "imports": {
    // Map to an exact file
    "foo": "./some/long/path/foo.ts",
    // Map to a directory, usage: "bar/file.ts"
    "bar/": "./some/folder/bar/"
  }
}
```

Usage:

```ts
import * as foo from "foo";
import * as bar from "bar/file.ts";
```

Path mapping of import specifies is commonly used in larger code bases for
brevity.

For example:

```json title="deno.json"
{
  "imports": {
    "@/": "./"
  }
}
```

```ts title="main.ts"
import { MyUtil } from "@/util.ts";
```

This causes import specifiers starting with `@/` to be resolved relative to the
import map's URL or file path.

### Overriding packages

The `links` field in `deno.json` allows you to override dependencies with local
packages stored on disk. This is similar to `npm link`.

```json title="deno.json"
{
  "links": [
    "../some-package"
  ]
}
```

This capability addresses several common development challenges:

- Dependency bug fixes
- Private local libraries
- Compatibility issues

The package being referenced doesn't need to be published at all. It just needs
to have the proper package name and metadata in `deno.json` or `package.json`,
so that Deno knows what package it's dealing with. This provides greater
flexibility and modularity, maintaining clean separation between your main code
and external packages.

## Tasks

The `tasks` field in your `deno.json` file is used to define custom commands
that can be executed with the `deno task` command and allows you to tailor
commands and permissions to the specific needs of your project.

It is similar to the `scripts` field in a `package.json` file, which is also
supported.

```json title="deno.json"
{
  "tasks": {
    "start": "deno run --allow-net --watch=static/,routes/,data/ dev.ts",
    "test": "deno test --allow-net",
    "lint": "deno lint"
  }
}
```

```json title="package.json"
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build"
  }
}
```

To execute a task, use the `deno task` command followed by the task name. For
example:

```sh
deno task start
deno task test
deno task lint
deno task dev
deno task build
```

Read more about [`deno task`](/runtime/reference/cli/task/).

## Linting

The `lint` field in the `deno.json` file is used to configure the behavior of
Deno’s built-in linter. This allows you to specify which files to include or
exclude from linting, as well as customize the linting rules to suit your
project’s needs.

For example:

```json title="deno.json"
{
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  }
}
```

This configuration will:

- only lint files in the `src/` directory,
- not lint files in the `src/testdata/` directory or any TypeScript files in the
  `src/fixtures/` directory.
- specify that the recommended linting rules should be applied,
- add the `ban-untagged-todo`, and
- exclude the `no-unused-vars` rule.

You can find a full list of available linting rules in the
[List of rules](/lint/) documentation page.

Read more about [linting with Deno](/runtime/reference/cli/lint/).

## Formatting

The `fmt` field in the `deno.json` file is used to configure the behavior of
Deno’s built-in code formatter. This allows you to customize how your code is
formatted, ensuring consistency across your project, making it easier to read
and collaborate on. Here are the key options you can configure:

```json title="deno.json"
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": true,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  }
}
```

This configuration will:

- use tabs instead of spaces for indentation,
- limit lines to 80 characters,
- use an indentation width of 4 spaces,
- add semicolons to the end of statements,
- use single quotes for strings,
- preserve prose wrapping,
- format files in the `src/` directory,
- exclude files in the `src/testdata/` directory and any TypeScript files in the
  `src/fixtures/` directory.

### Available options

#### `bracePosition`

Define brace position for blocks

- **Default:** `sameLine`
- **Possible values:** `maintain`, `sameLine`, `nextLine`,
  `sameLineUnlessHanging`

#### `jsx.bracketPosition`

Define bracket position for JSX

- **Default:** `nextLine`
- **Possible values:** `maintain`, `sameLine`, `nextLine`

#### `jsx.forceNewLinesSurroundingContent`

Forces newlines surrounding the content of JSX elements

- **Default:** `false`
- **Possible values:** `true`, `false`

#### `jsx.multiLineParens`

Surrounds the top-most JSX element or fragment in parentheses when it spans
multiple lines

- **Default:** `prefer`
- **Possible values:** `never`, `prefer`, `always`

#### `indentWidth`

Define indentation width

- **Default:** `2`
- **Possible values:** `number`

#### `lineWidth`

Define maximum line width

- **Default:** `80`
- **Possible values:** `number`

#### `newLineKind`

The newline character to use

- **Default:** `lf`
- **Possible values:** `auto`, `crlf`, `lf`, `system`

Use `auto` to preserve the file's existing newline style when Deno can detect
one. Use `system` to use the current operating system's default newline style,
which is `crlf` on Windows and `lf` on Unix-like systems.

#### `nextControlFlowPosition`

Define position of next control flow

- **Default:** `sameLine`
- **Possible values:** `sameLine`, `nextLine`, `maintain`

#### `semiColons`

Whether to prefer using semicolons.

- **Default:** `true`
- **Possible values:** `true`, `false`

#### `operatorPosition`

Where to place the operator for expressions that span multiple lines

- **Default:** `sameLine`
- **Possible values:** `sameLine`, `nextLine`, `maintain`

#### `proseWrap`

Define how prose should be wrapped

- **Default:** `always`
- **Possible values:** `always`, `never`, `preserve`

#### `quoteProps`

Control quoting of object properties

- **Default:** `asNeeded`
- **Possible values:** `asNeeded`, `consistent`, `preserve`

#### `singleBodyPosition`

The position of the body in single body blocks

- **Default:** `sameLineUnlessHanging`
- **Possible values:** `sameLine`, `nextLine`, `maintain`,
  `sameLineUnlessHanging`

#### `singleQuote`

Use single quotes

- **Default:** `false`
- **Possible values:** `true`, `false`

#### `spaceAround`

Control spacing around enclosed expressions

- **Default:** `false`
- **Possible values:** `true`, `false`

#### `spaceSurroundingProperties`

Control spacing surrounding single line object-like nodes

- **Default:** `true`
- **Possible values:** `true`, `false`

#### `trailingCommas`

Control trailing commas in multi-line arrays/objects

- **Default:** `always`
- **Possible values:** `always`, `never`

#### `typeLiteral.separatorKind`

Define separator kind for type literals

- **Default:** `semiColon`
- **Possible values:** `comma`, `semiColon`

#### `unstable-component`

Enable formatting Svelte, Vue, Astro and Angular files

#### `unstable-sql`

Enable formatting SQL files

#### `useTabs`

Use tabs instead of spaces for indentation

- **Default:** `false`
- **Possible values:** `true`, `false`

#### `useBraces`

Whether to use braces for if statements, for statements, and while statements

- **Default:** `whenNotSingleLine`
- **Possible values:** `maintain`, `whenNotSingleLine`, `always`, `preferNone`

Read more about
[formatting your code with Deno](/runtime/fundamentals/linting_and_formatting/).

## Lockfile

The `lock` field in the `deno.json` file is used to specify configuration of the
lock file that Deno uses to
[ensure the integrity of your dependencies](/runtime/fundamentals/dependency_management/#integrity-checking-and-lock-files).
A lock file records the exact versions and integrity hashes of the modules your
project depends on, ensuring that the same versions are used every time the
project is run, even if the dependencies are updated or changed remotely.

```json title="deno.json"
{
  "lock": {
    "path": "./deno.lock",
    "frozen": true
  }
}
```

This configuration will:

- specify lockfile location at `./deno.lock` (this is the default and can be
  omitted)
- tell Deno that you want to error out if any dependency changes

Deno uses lockfile by default, you can disable it with following configuration:

```json title="deno.json"
{
  "lock": false
}
```

## Node modules directory

By default Deno uses a local `node_modules` directory if you have a
`package.json` file in your project directory.

You can control this behavior using the `nodeModulesDir` field in the
`deno.json` file.

```json title="deno.json"
{
  "nodeModulesDir": "auto"
}
```

You can set this field to following values:

| Value      | Behavior                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `"none"`   | Don't use a local `node_modules` directory. Instead use global cache in `$DENO_DIR` that is automatically kept up to date by Deno.  |
| `"auto"`   | Use a local `node_modules` directory. The directory is automatically created and kept up to date by Deno.                           |
| `"manual"` | Use a local `node_modules` directory. User must keep this directory up to date manually, eg. using `deno install` or `npm install`. |

It is not required to specify this setting, the following defaults are applied:

- `"none"` if there is no `package.json` file in your project directory
- `"manual"` if there is a `package.json` file in your project directory

When using workspaces, this setting can only be used in the workspace root.
Specifying it in any of the members will result in warnings. The `"manual"`
setting will only be applied automatically if there's a `package.json` file in
the workspace root.

## TypeScript compiler options

The `compilerOptions` field in the `deno.json` file is used to configure
[TypeScript compiler settings](https://www.typescriptlang.org/tsconfig) for your
Deno project. This allows you to customize how TypeScript code is compiled,
ensuring it aligns with your project’s requirements and coding standards.

:::info

Deno recommends the default TypeScript configuration. This will help when
sharing code.

:::

If you’re migrating from Node.js, your existing `tsconfig.json` files work out
of the box with Deno. See
[Using tsconfig.json with Deno](/runtime/fundamentals/typescript/#using-tsconfigjson-with-deno)
for details.

For the full list of supported compiler options, library configuration, and
advanced settings, see
[Configuring TypeScript](/runtime/reference/ts_config_migration/).

## Unstable features

The `unstable` field in a `deno.json` file is used to enable specific unstable
features for your Deno project.

These features are still in development and not yet part of the stable API. By
listing features in the `unstable` array, you can experiment with and use these
new capabilities before they are officially released.

```json title="deno.json"
{
  "unstable": ["cron", "kv", "webgpu"]
}
```

[Learn more](/runtime/reference/cli/unstable_flags/).

## include and exclude

Many configurations (ex. `lint`, `fmt`) have an `include` and `exclude` property
for specifying the files to include.

### include

Only the paths or patterns specified here will be included.

```jsonc
{
  "lint": {
    // only format the src/ directory
    "include": ["src/"]
  }
}
```

### exclude

The paths or patterns specified here will be excluded.

```jsonc
{
  "lint": {
    // don't lint the dist/ folder
    "exclude": ["dist/"]
  }
}
```

This has HIGHER precedence than `include` and will win over `include` if a path
is matched in both `include` and `exclude`.

You may wish to exclude a directory, but include a sub directory. In Deno
1.41.2+, you may un-exclude a more specific path by specifying a negated glob
below the more general exclude:

```jsonc
{
  "fmt": {
    // don't format the "fixtures" directory,
    // but do format "fixtures/scripts"
    "exclude": [
      "fixtures",
      "!fixtures/scripts"
    ]
  }
}
```

### Top level exclude

If there's a directory you never want Deno to fmt, lint, type check, analyze in
the LSP, etc., then specify it in the top level exclude array:

```jsonc
{
  "exclude": [
    // exclude the dist folder from all sub-commands and the LSP
    "dist/"
  ]
}
```

Sometimes you may find that you want to un-exclude a path or pattern that's
excluded in the top level-exclude. In Deno 1.41.2+, you may un-exclude a path by
specifying a negated glob in a more specific config:

```jsonc
{
  "fmt": {
    "exclude": [
      // format the dist folder even though it's
      // excluded at the top level
      "!dist"
    ]
  },
  "exclude": [
    "dist/"
  ]
}
```

### Publish - Override .gitignore

The `.gitignore` is taken into account for the `deno publish` command. In Deno
1.41.2+, you can opt-out of excluded files ignored in the _.gitignore_ by using
a negated exclude glob:

```title=".gitignore"
dist/
.env
```

```jsonc title="deno.json"
{
  "publish": {
    "exclude": [
      // include the .gitignored dist folder
      "!dist/"
    ]
  }
}
```

Alternatively, explicitly specifying the gitignored paths in an `"include"`
works as well:

```json
{
  "publish": {
    "include": [
      "dist/",
      "README.md",
      "deno.json"
    ]
  }
}
```

## Exports

The `exports` field in the `deno.json` file allows you to define which paths of
your package should be publicly accessible. This is particularly useful for
controlling the API surface of your package and ensuring that only the intended
parts of your code are exposed to users.

```jsonc title="deno.json"
{
  "exports": "./src/mod.ts" // A default entry point
}
```

You can also define multiple entry points:

```json title="deno.json"
{
  "exports": {
    "./module1": "./src/module1.ts",
    "./module2": "./src/module2.ts",
    ".": "./src/mod.ts" // Default entry point
  }
}
```

This configuration will:

- expose `module1` and `module2` as entry points for your package,
- allow importing any file from the `utils` directory using a wildcard. This
  means users can import these modules using the specified paths, while other
  files in your package remain private.

To use the exports in your code, you can import them like this:

```ts title="example.ts"
import * as module_1 from "@example/my-package/module1";
import * as module_2 from "@example/my-package/module2";
```

## Permissions

Deno 2.5+ supports storing [permission](/runtime/reference/permissions/) sets in
the config file.

### Named permissions

Permissions can be defined as key-value pairs under arbitrarily-named permission
sets under the `"permissions"` key. Within each set,

- the key is the name of a [permission](/runtime/reference/permissions/) that
  would follow `--allow-` or `--deny-` in the CLI invocation (i.e. `read`,
  `write`, `net`, `env`, `sys`, `run`, `ffi`, `import`)
- the value is a boolean (`true` / `false` correspond to allow / deny), an array
  of strings representing paths, domains etc., or an object with `allow`,
  `deny`, and/or `ignore` boolean key-value pairs.

```jsonc
{
  "permissions": {
    "read-data": {
      "read": "./data"
    },
    "read-and-write": {
      "read": true,
      "write": ["./data"]
    }
  }
}
```

Permission sets can be used by specifying the `--permission-set=<name>` or
`-P=<name>` flag:

```sh
$ deno run -P=read-data main.ts
```

### Default permission

A special `"default"` permission key allows excluding the name when using the
`--permission-set`/`-P` flag:

```jsonc
{
  "permissions": {
    "default": {
      "env": true
    }
  }
}
```

Then run with just `-P`:

```sh
$ deno run -P main.ts
```

### Allow, deny, and ignore

For finer control over permissions, you can use the object form with `allow`,
`deny`, and `ignore` keys. This is especially useful when you need more granular
permission control than simple boolean or array values provide.

#### Object form syntax

Instead of specifying a permission as a boolean or array:

```jsonc
{
  "permissions": {
    "default": {
      "read": true, // Simple boolean form
      "write": ["./data"] // Simple array form
    }
  }
}
```

You can use the object form:

```jsonc
{
  "permissions": {
    "default": {
      "read": {
        "allow": ["./data", "./config"],
        "deny": ["./data/secrets"],
        "ignore": ["./data/cache"]
      },
      "write": {
        "allow": ["./output"],
        "deny": ["./output/system"]
      }
    }
  }
}
```

#### Available permissions

The `allow`, `deny`, and `ignore` keys work differently depending on the
permission type:

- **`read` and `env`**: Support `allow`, `deny`, and `ignore`
- **`write`, `net`, `run`, `ffi`, `sys`, and `import`**: Support `allow` and
  `deny` (but not `ignore`)

#### Behavior

- **`allow`**: Explicitly grant access to specific resources. Can be `true` (to
  allow all), `false` (to allow none), or an array of specific paths/values to
  allow.
- **`deny`**: Explicitly deny access (throw
  [PermissionDenied](https://docs.deno.com/api/deno/~/Deno.errors.PermissionDenied))
  to specific resources, even if they would otherwise be allowed. Can be `true`
  (to deny all), `false` (to deny none), or an array of specific paths/values to
  deny.
- **`ignore`**: (Only for `read` and `env` permissions) Silently ignore access
  attempts to specific resources without throwing errors. Can be `true`,
  `false`, or an array of specific paths/values to ignore.

#### Example

```jsonc
{
  "permissions": {
    "default": {
      // Allow reading from data directory, but deny access to secrets
      // and silently ignore cache files
      "read": {
        "allow": ["./data"],
        "deny": ["./data/secrets"],
        "ignore": ["./data/cache"]
      },
      // Allow all environment variables except API keys
      "env": {
        "allow": true,
        "ignore": ["API_KEY", "SECRET_TOKEN"]
      },
      // Allow all, but deny 'rm', 'sudo'
      "run": {
        "allow": true,
        "deny": ["rm", "sudo"]
      }
    }
  }
}
```

### Test, bench, and compile permissions

Permissions can be optionally specified within the `"test"`, `"bench"`, or
`"compile"` keys.

```jsonc
{
  "test": {
    "permissions": {
      "read": ["./data"]
    }
  }
}
```

Or reference a permission set:

```jsonc
{
  "test": {
    "permissions": "read-data"
  },
  "permissions": {
    "read-data": {
      "read": ["./data"]
    }
  }
}
```

When this is defined, you must run `deno test` with `-P` or a permission flag:

```
> deno test
error: Test permissions were found in the config file. Did you mean to run with `-P`?
    at file:///Users/david/dev/example/deno.json
> deno test -P
...runs...
> deno test --allow-read
...runs...
> deno test -A
...runs...
```

This is to help prevent you waste your time wondering why something is not
working when you forget to run without permissions.

Note that test and bench files in a workspace will use the closest `deno.json`
for determining `test` and `bench` permissions. This allows giving different
permissions to different workspace members.

### Security risk

The threat model for permissions in the config file is similar to `deno task`,
in that a script could modify the `deno.json` to elevate permissions. That's why
this requires an explicit opt-in with `-P` and is not loaded by default.

If you're ok with this risk, then this feature will be useful for you.

## Compile config

The `"compile"` block configures
[`deno compile`](/runtime/reference/cli/compile/) without requiring you to
repeat flags on every invocation. You can declare which extra files or
directories to bundle into the executable, and which paths to exclude:

```jsonc title="deno.json"
{
  "compile": {
    "include": ["names.csv", "data", "worker.ts"],
    "exclude": ["data/secrets", "**/*.test.ts"]
  }
}
```

`--include` and `--exclude` flags on the command line are merged with these
lists rather than replacing them. The `"compile"` block can also carry
`permissions` (see
[Test, bench, and compile permissions](#test-bench-and-compile-permissions)).

## An example `deno.json` file

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
  },
  "permissions": {
    "default": {
      "read": {
        "allow": ["./src/"],
        "deny": ["./src/secrets/"]
      },
      "env": {
        "allow": true,
        "ignore": ["TEMP_*"]
      }
    }
  },
  "lint": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"],
    "rules": {
      "tags": ["recommended"],
      "include": ["ban-untagged-todo"],
      "exclude": ["no-unused-vars"]
    }
  },
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 4,
    "semiColons": false,
    "singleQuote": true,
    "proseWrap": "preserve",
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "lock": false,
  "nodeModulesDir": "auto",
  "unstable": ["webgpu"],
  "test": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/fixtures/**/*.ts"]
  },
  "tasks": {
    "start": "deno run --allow-read main.ts"
  },
  "imports": {
    "oak": "jsr:@oak/oak"
  },
  "exclude": [
    "dist/"
  ]
}
```

This is an example of a `deno.json` file that configures the TypeScript compiler
options, linter, formatter, node modules directory, etc. For a full list of
available fields and configurations, see the
[Deno configuration file schema](#json-schema).

## JSON schema

A JSON schema file is available for editors to provide autocompletion. The file
is versioned and available at:
[https://github.com/denoland/deno/blob/main/cli/schemas/config-file.v1.json](https://github.com/denoland/deno/blob/main/cli/schemas/config-file.v1.json)

## Proxies

Deno supports proxies for module downloads and the fetch API. Proxy
configuration is read from
[environment variables](https://docs.deno.com/runtime/reference/env_variables/#special-environment-variables):
HTTP_PROXY, HTTPS_PROXY and NO_PROXY.

If you are using Windows - if environment variables are not found Deno falls
back to reading proxies from the registry.
