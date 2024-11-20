---
title: "Linting and formatting"
---

In an ideal world, your code is always clean, consistent, and free of pesky
errors. That’s the promise of Deno’s built-in linting and formatting tools. By
integrating these features directly into the runtime, Deno eliminates the need
for external dependencies and complex configurations in your projects. These
inbuilt tools are fast and performant, not only saving time but also ensuring
that every line of code adheres to best practices.

With `deno fmt` and `deno lint`, you can focus on writing great code, knowing
that Deno has your back. It’s like having a vigilant assistant who keeps your
codebase in top shape, allowing you to concentrate on what truly matters:
building amazing applications.

## Linting

Linting is the process of analyzing your code for potential errors, bugs, and
stylistic issues. Deno’s built-in linter,
[`deno lint`](/runtime/reference/cli/linter/), supports recommended set of rules
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
[`deno.json`](/runtime/fundamentals/configuration/) file. You can specify custom
rules, plugins, and settings to tailor the linting process to your needs.

## Formatting

Formatting is the process of automatically adjusting the layout of your code to
adhere to a consistent style. Deno’s built-in formatter, `deno fmt`, uses the
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
formatted according to Deno’s default formatting rules. Instead of modifying the
files, it checks them and reports any formatting issues. This is particularly
useful for integrating into continuous integration (CI) pipelines or pre-commit
hooks to ensure code consistency across your project.

If there are formatting issues, `deno fmt --check` will list the files that need
formatting. If all files are correctly formatted, it will simply exit without
any output.

### Integration in CI

You can add deno fmt --check to your CI pipeline to automatically check for
formatting issues. For example, in a GitHub Actions workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: denoland/setup-deno@v2
        with:
          deno-version: v2.x
      - run: deno fmt --check
```

This ensures that any code changes adhere to the project’s formatting standards
before being merged.

### Available options

| Rule               | Description                                            | Default    | possible values         |
| ------------------ | ------------------------------------------------------ | ---------- | ----------------------- |
| indent-width       | Define indentation width                               | **2**      | number                  |
| line-width         | Define maximum line width                              | **80**     | number                  |
| no-semicolons      | Don't use semicolons except where necessary            | **false**  | true, false             |
| prose-wrap         | Define how prose should be wrapped                     | **always** | always, never, preserve |
| single-quote       | Use single quotes                                      | **false**  | true, false             |
| unstable-component | Enable formatting Svelte, Vue, Astro and Angular files |            |                         |
| unstable-css       | Enable formatting CSS, SCSS, Sass and Less files       |            |                         |
| unstable-html      | Enable formatting HTML files                           |            |                         |
| unstable-yaml      | Enable formatting YAML files                           |            |                         |
| use-tabs           | Use tabs instead of spaces for indentation             | **false**  | true, false             |

The formatter can be configured in a
[`deno.json`](/runtime/fundamentals/configuration/#formatting) file. You can
specify custom setting to tailor the formatting process to your needs.
