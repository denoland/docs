---
last_modified: 2026-05-17
title: "Linting and formatting"
description: "A guide to Deno's built-in code quality tools. Learn how to use deno lint and deno fmt commands, configure rules, integrate with CI/CD pipelines, and maintain consistent code style across your projects."
---

In an ideal world, your code is always clean, consistent, and free of pesky
errors. That's the promise of Deno's built-in linting and formatting tools. By
integrating these features directly into the runtime, Deno eliminates the need
for external dependencies and complex configurations in your projects. These
inbuilt tools are fast and performant, not only saving time but also ensuring
that every line of code adheres to best practices.

With `deno fmt` and `deno lint`, you can focus on writing great code, knowing
that Deno has your back. It's like having a vigilant assistant who keeps your
codebase in top shape, allowing you to concentrate on what truly matters:
building amazing applications.

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

To enable Deno as your formatter in VS Code, you have to set it up as your
default formatter in the settings, and then add a `.vscode/settings.json` file
in the root of your project with the following configuration:

```json
{
  "deno.enablePaths": ["./deno.json"]
}
```

If your `deno.json(c)` file is located in a subdirectory of your project,
provide the correct relative path to it instead.

### Configuration

The formatter is configured with the `fmt` field in your
[`deno.json`](/runtime/reference/deno_json/#formatting) file. See
[all formatting options](/runtime/reference/deno_json/#formatting) for the full
list of settings and their defaults.

## Deno support for other linters and formatters

### ESLint

To use the VSCode ESLint extension in your Deno projects, your project will need
a `node_modules` directory in your project that VSCode extensions can pick up.

In your [`deno.json`](/runtime/fundamentals/configuration/) ensure a
`node_modules` folder is created, so the editor can resolve packages:

```jsonc
{
  "nodeModulesDir": "auto"
}
```

(Optional) Run an ESLint command to download it:

```sh
deno run -A npm:eslint --version
# or
deno run -A npm:eslint --init
```

Create an `eslint.config.js`:

```js
// eslint.config.js
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import"; // example plugin

export default [
  js.configs.recommended,
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: { globals: { Deno: "readonly" } },
    plugins: { import: importPlugin },
    rules: {
      // e.g. "import/order": "warn"
    },
  },
];
```

To run ESLint run:

```sh
deno run -A npm:eslint .
```

Optionally, you can add a task in your `deno.json` to run ESLint:

```json
{
  "tasks": { "eslint": "eslint . --ext .ts,.js" }
}
```

And run it with:

```sh
deno task eslint
```

### Prettier

To use Prettier in your Deno projects, your project will need a `node_modules`
directory in your project that VSCode extensions can pick up.

Then install the Prettier extension for VSCode and configure it to be your
default formatter:

In VSCode:

1. Open the Command Palette (with <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>)
2. Select **Format Document With...**
3. Select **Configure Default Formatter...**
4. Select **Prettier - Code formatter**
