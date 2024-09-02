---
title: "deno.json and package.json"
oldUrl: /runtime/manual/getting_started/configuration_file/
---

You can configure Deno using a `deno.json` file. This file can be used to
configure the TypeScript compiler, linter, formatter, and other Deno tools.

The configuration file supports `.json` and
[`.jsonc`](https://code.visualstudio.com/docs/languages/json#_json-with-comments)
extensions.

Deno will automatically detect a `deno.json` or `deno.jsonc` configuration file
if it's in your current working directory or parent directories. The `--config`
flag can be used to specify a different configuration file.

## package.json support

Deno also supports a `package.json` file for compatibility with Node.js
projects. If you have a Node.js project, it is not necessary to create a
`deno.json` file. Deno will use the `package.json` file to configure the
project. If both a `deno.json` and `package.json` file are present in the same
directory, Deno will import the modules in the `package.json` file and use the
`deno.json` file for Deno-specific configurations. Read more about
[Node compatibility in Deno](TODO:node-compat).

## module imports and scopes

The "imports" field in your `deno.json` allows you to control how Deno resolves
modules. You can use it to map bare specifiers (module specifiers that refer to
the package name or feature) to URLs or file paths making it easier to manage
dependencies and module resolution in your applications.

For example, if you want to use the `assert` module from the standard library in
your project, you could use this import map:

```json
{
  "imports": {
    "std/assert": "jsr:@std/assert@^1.0.0"
  }
}
```

Then your script can use the bare specifier `std`:

```js
import { assertEquals } from "std/assert";

assertEquals(1, 2);
```

The top-level `deno.json` option `importMap` along with the `--importmap` flag
can be used to specify the import map in other files.

If you need to scope an import to a to a specific file or directory, you can use
the "scopes" field. For example:

```json
{
  "importMap": {
    "imports": {
      "lodash": "https://cdn.skypack.dev/lodash@4.17.21"
    },
    "scopes": {
      "/special/": {
        "lodash": "https://cdn.skypack.dev/lodash@4.17.20"
      }
    }
  }
}
```

In this example, the `lodash` module is resolved to version 4.17.21 for all
files except those in the `/special/` directory, where it is resolved to version
4.17.20.

Read more about [module imports](./modules.md)

## tasks

The tasks field in your `deno.json` file is used to define custom commands that
can be executed with the `deno task` command. It is similar to the `scripts`
field in a `package.json` file and allows you to tailor commands and permissions
to the specific needs of your project.

```json
{
  "tasks": {
    "start": "deno run -allow-net --watch=static/,routes/,data/ dev.ts",
    "test": "deno test --allow-net",
    "lint": "deno lint"
  }
}
```

To execute a task, use the `deno task` command followed by the task name. For
example:

```sh
deno task start
deno task test
deno task lint
```

Read more about [`deno task`](TODO:task-link).

## Linting

The `lint` field in the `deno.json` file is used to configure the behavior of
Deno’s built-in linter. This allows you to specify which files to include or
exclude from linting, as well as customize the linting rules to suit your
project’s needs.

For example:

```json
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
- will not lint files in the `src/testdata/` directory or any TypeScript files
  in the `src/fixtures/` directory.
- specifies that the recommended linting rules should be applied,
- adds the `ban-untagged-todo`
- removes the `no-unused-vars` rule excluded.

You can find a full list of available linting rules in the
[Deno lint documentation](https://lint.deno.land/).

Read more about [linting with Deno](TODO:lint-link).

## Formatting

The `fmt` field in the `deno.json` file is used to configure the behavior of
Deno’s built-in code formatter. This allows you to customize how your code is
formatted, ensuring consistency across your project, making it easier to read
and collaborate on. Here are the key options you can configure:

```json
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

Read more about [formatting your code with Deno](TODO:fmt-link).

## lock

The `lock` field in the `deno.json` file is used to specify the location of the
lock file that Deno uses to
[ensure the integrity of your dependencies](TODO:modules#integrity). A lock file
records the exact versions and integrity hashes of the modules your project
depends on, ensuring that the same versions are used every time the project is
run, even if the dependencies are updated or changed remotely.

## Node modules directory

The `nodeModulesDir` field in the `deno.json` file is used to explicitly enable
or disable Deno’s use of the `node_modules` directory when working with npm
packages. This setting is particularly useful for projects that need to
integrate with existing Node.js ecosystems or gradually adopt Deno. It can be
set to `true` or `false` to enable or disable the use of the `node_modules`
directory, respectively.

## npm registry

The `npmRegistry` field in the `deno.json` file is used to specify a custom npm
registry for resolving npm package specifiers. This allows you to direct Deno to
use a different registry instead of the default npm registry. This can be
particularly useful for using [private registries](TODO:private-registries-link)
or mirrors of the npm registry.

## TypeScript compiler options

The `compilerOptions` field in the `deno.json` file is used to configure
[TypeScript compiler settings](https://www.typescriptlang.org/tsconfig) for your
Deno project. This allows you to customize how TypeScript code is compiled,
ensuring it aligns with your project’s requirements and coding standards.

:::info

Deno recommends the default TypeScript configuration. This will help when
sharing code.

:::

See also
[Configuring TypeScript in Deno](TODO:tsconfig-link-prev/manual/advanced/ts/config).

## unstable

The `unstable` field in a `deno.json` file is used to enable specific unstable
feature flags for your Deno project. These features are still in development and
not yet part of the stable API. By listing the desired features in the unstable
array, you can experiment with and use these new capabilities before they are
officially released. [Learn more](TODO:unstable-flags-cli).

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

## Full example

```json
{
  "compilerOptions": {
    "allowJs": true,
    "lib": ["deno.window"],
    "strict": true
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
  "nodeModulesDir": true,
  "unstable": ["webgpu"],
  "npmRegistry": "https://mycompany.net/artifactory/api/npm/virtual-npm",
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

## JSON schema

A JSON schema file is available for editors to provide autocompletion. The file
is versioned and available at:
https://deno.land/x/deno/cli/schemas/config-file.v1.json
