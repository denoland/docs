---
last_modified: 2026-05-17
title: "Linting and formatting"
description: "A guide to Deno's built-in code quality tools. Learn how to use deno lint and deno fmt commands, configure rules, integrate with CI/CD pipelines, and maintain consistent code style across your projects."
oldUrl:
  - /runtime/fundamentals/linting_and_formatting/
---

Deno ships a linter and a formatter in the `deno` binary. No packages to
install, no config files required:

```sh
deno lint    # catch bugs and anti-patterns
deno fmt     # format code, markdown, and JSON
```

Both are fast, run the same way locally and in CI, and are configured (when you
need to configure anything at all) in the same `deno.json` as the rest of your
project.

## Linting

<a href="/lint/" type="docs-cta runtime-cta">Explore all the lint rules</a>

Linting is the process of analyzing your code for potential errors, bugs, and
stylistic issues. Deno's built-in linter,
[`deno lint`](/runtime/reference/cli/lint/), supports recommended set of rules
from [ESLint](https://eslint.org/) to provide comprehensive feedback on your
code. This includes identifying syntax errors, enforcing coding conventions, and
highlighting potential issues that could lead to bugs.

To run the linter, use the following command in your terminal:

```bash
deno lint
```

By default, `deno lint` analyzes all TypeScript and JavaScript files in the
current directory and its subdirectories. If you want to lint specific files or
directories, you can pass them as arguments to the command. For example:

```bash
deno lint src/
```

This command will lint all files in the `src/` directory.

A finding shows the rule name, the offending code, and a hint:

```console
$ deno lint main.ts
error[require-await]: Async function 'fetchData' has no 'await' expression
 --> /project/main.ts:1:1
  |
1 | async function fetchData() {
  | ^^^^^
  = hint: Remove 'async' keyword from the function or use 'await' expression inside.

  docs: https://docs.deno.com/lint/rules/require-await

Found 1 problem
Checked 1 file
```

Some rules can fix the problem for you: run `deno lint --fix` to apply those
fixes automatically. To silence a rule for one line, add an ignore directive
naming the rule above it:

```ts
// deno-lint-ignore require-await
async function fetchData() {
  return "data";
}
```

See the [`deno lint` reference](/runtime/reference/cli/lint/) for all flags and
directive forms.

The linter can be configured in a
[`deno.json`](/runtime/reference/deno_json/#linting) file. You can specify
custom rules, plugins, and settings to tailor the linting process to your needs.

### Linting rules

You can view and search the list of available rules and their usage on the
[List of rules](/lint/) documentation page.

## Formatting

Formatting is the process of automatically adjusting the layout of your code to
adhere to a consistent style. Deno's built-in formatter, `deno fmt`, uses the
powerful [dprint](https://dprint.dev/) engine to ensure that your code is always
clean, readable, and consistent.

To format your code, simply execute the following command in your terminal:

```bash
deno fmt
```

By default, `deno fmt` formats all TypeScript and JavaScript files in the
current directory and its subdirectories. If you want to format specific files
or directories, you can pass them as arguments to the command. For example:

```bash
deno fmt src/
```

This command will format all files in the `src/` directory.

### Checking your formatting

The `deno fmt --check` command is used to verify if your code is properly
formatted according to Deno's default formatting rules. Instead of modifying the
files, it checks them and reports any formatting issues. This is particularly
useful for integrating into continuous integration (CI) pipelines or pre-commit
hooks to ensure code consistency across your project.

If there are formatting issues, `deno fmt --check` will list the files that need
formatting. If all files are correctly formatted, it will simply exit without
any output.

### Integration in CI

You can add `deno fmt --check` to your CI pipeline to automatically check for
formatting issues. For example, in a GitHub Actions workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
```

This ensures that any code changes adhere to the project's formatting standards
before being merged.

### Integration in VS Code

To enable Deno as your formatter in VS Code, install the
[Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno)
and add a `.vscode/settings.json` file in the root of your project that sets it
as the default formatter and enables the extension for your project:

```json
{
  "deno.enablePaths": ["./deno.json"],
  "editor.defaultFormatter": "denoland.vscode-deno",
  "editor.formatOnSave": true
}
```

If your `deno.json(c)` file is located in a subdirectory of your project,
provide the correct relative path to it instead.

### Configuration

The formatter is configured with the `fmt` field in your
[`deno.json`](/runtime/reference/deno_json/#formatting) file. See
[all formatting options](/runtime/reference/deno_json/#formatting) for the full
list of settings and their defaults.

## Using other linters and formatters

Deno's built-in [`deno lint`](#linting) and [`deno fmt`](#formatting) cover most
projects, but you can also run popular third-party tools without installing them
globally. Because Deno runs npm packages directly, `deno run -A npm:<tool>` runs
any of them with no separate `npm install` step. To save typing, add the command
as a [task](/runtime/reference/deno_json/#tasks) in your `deno.json` and run it
with `deno task`.

### ESLint

[ESLint](https://eslint.org/) needs a flat config file, `eslint.config.js`.
Reference its packages with `npm:` specifiers so Deno can resolve them:

```js title="eslint.config.js"
import js from "npm:@eslint/js";
import globals from "npm:globals";

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      globals: { ...globals.node, Deno: "readonly" },
    },
  },
];
```

Then run it over your project:

```sh
deno run -A npm:eslint .
```

Declaring the Node and `Deno` globals prevents false `no-undef` errors for
globals such as `console`. For type-aware linting of TypeScript, add
[typescript-eslint](https://typescript-eslint.io/) to the config.

:::note

The VS Code ESLint extension needs a real `node_modules` directory to resolve
ESLint and its plugins. Set `"nodeModulesDir": "auto"` in your `deno.json` and
run `deno install` so the packages are materialized on disk.

:::

### oxlint

[oxlint](https://oxc.rs) is a fast Rust-based linter that runs with no
configuration:

```sh
deno run -A npm:oxlint@latest
```

It lints the current directory and prints any problems it finds:

```console
sample.ts:3:5: warning eslint(no-unused-vars): Variable 'unused' is declared but never used.
```

### Prettier

[Prettier](https://prettier.io/) formats your code with no configuration
required:

```sh
# report files that need formatting
deno run -A npm:prettier --check .

# format files in place
deno run -A npm:prettier --write .
```

### Biome

[Biome](https://biomejs.dev/) is a fast Rust-based linter and formatter in one,
and also works with zero configuration:

```sh
# lint and check formatting
deno run -A npm:@biomejs/biome check .

# format files in place
deno run -A npm:@biomejs/biome format --write .

# lint only
deno run -A npm:@biomejs/biome lint .
```

To customize Biome, generate a `biome.json` with
`deno run -A npm:@biomejs/biome init`.
