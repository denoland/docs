# `deno.json` configuration file

Deno supports a configuration file that allows you to customize the built-in
TypeScript compiler, formatter, and linter.

The configuration file supports `.json` and `.jsonc` extensions.
[Since v1.18](https://deno.com/blog/v1.18#auto-discovery-of-the-config-file),
Deno will automatically detect a `deno.json` or `deno.jsonc` configuration file
if it's in your current working directory or parent directories. The `--config`
flag can be used to specify a different configuration file.

:::info Version notes

- Before Deno v1.23, you needed to supply an explicit `--config` flag.
- Starting with Deno v1.34, globs are supported in `include` and `exclude`
  fields. You can use `*` to match any number of characters, `?` to match a
  single character, and `**` to match any number of directories.

:::

## `imports` and `scopes`

Since version 1.30, the `deno.json` configuration file acts as an
[import map](../basics/import_maps.md) for resolving bare specifiers.

```jsonc
{
  "imports": {
    "@std/assert": "jsr:std/assert@^0"
  },
  "tasks": {
    "dev": "deno run --watch main.ts"
  }
}
```

See [the import map section](../basics/import_maps.md) for more information on
import maps.

Then your script can use the bare specifier `@std/assert`:

```js
import { assertEquals } from "@std/assert/mod.ts";

assertEquals(1, 2);
```

The top-level `deno.json` option `importMap` along with the `--importmap` flag
can be used to specify the import map in other files.

## `tasks`

Similar to `package.json`'s `script` field. Essentially shortcuts for command
line invocations.

```json
{
  "tasks": {
    "start": "deno run -A --watch=static/,routes/,data/ dev.ts"
  }
}
```

Using `deno task start` will run the command. See also
[`deno task`](../tools/task_runner.md).

## `lint`

Configuration for [`deno lint`](../tools/linter.md).

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

## `fmt`

Configuration for [`deno fmt`](../tools/formatter.md)

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

## `lock`

Used to specify a different file name for the lockfile. By default deno will use
`deno.lock` and place it alongside the configuration file.

## `nodeModulesDir`

Used to enable or disable the `node_modules` directory when using npm packages.

## `npmRegistry`

Used to specify a custom npm registry for npm specifiers.

## `compilerOptions`

`deno.json` can also act as a TypeScript configuration file and supports
[most of the TS compiler options](https://www.typescriptlang.org/tsconfig).

Deno encourages users to use the default TypeScript configuration to help
sharing code.

See also
[Configuring TypeScript in Deno](../advanced/typescript/configuration.md).

## `unstable`

The `unstable` property is an array of strings used to configure which unstable
feature flags should be enabled for your program.
[Learn more](../tools/unstable_flags.md).

## `include` and `exclude`

Many configurations (ex. `lint`, `fmt`) have an `include` and `exclude` property
for specifying the files to include.

### `include`

Only the paths or patterns specified here will be included.

```jsonc
{
  "lint": {
    // only format the src/ directory
    "include": ["src/"]
  }
}
```

### `exclude`

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

```jsonc
{
  "lint": {
    // only lint .js files in the src directory
    "include": ["src/**/*.js"],
    // js files in the src/fixtures folder will not be linted
    "exclude": ["src/fixtures"]
  }
}
```

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

### Top level `exclude`

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

The _.gitignore_ is taken into account for the unstable `deno publish` command.
In Deno 1.41.2+, you can opt-out of excluded files ignored in the _.gitignore_
by using a negated exclude glob:

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
    "oak": "https://deno.land/x/oak@v12.4.0/mod.ts"
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
