---
title: "deno fmt"
oldUrl:
  - /runtime/tools/formatter/
  - /runtime/manual/tools/formatter/
  - /runtime/manual/tools/fmt/
  - /runtime/reference/cli/formatter/
command: fmt
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno fmt"
description: "Format your code with Deno's built-in formatter"
---

Deno ships with a built-in code formatter based on [dprint](https://dprint.dev/)
that auto-formats your code to a consistent style. For a broader overview, see
[Linting and Formatting](/runtime/fundamentals/linting_and_formatting/).

## Basic usage

Format all supported files in the current directory:

```sh title=">_"
deno fmt
```

Format specific files or directories:

```sh title=">_"
deno fmt main.ts src/
```

## Watch mode

Automatically re-format files when they change:

```sh title=">_"
deno fmt --watch
```

## Check formatting in CI

Use `--check` to verify files are formatted without modifying them. The command
exits with a non-zero status code if any files are unformatted:

```sh title=">_"
deno fmt --check
```

Add `--fail-fast` to stop on the first unformatted file instead of reporting all
of them, which is useful in large codebases:

```sh title=">_"
deno fmt --check --fail-fast
```

## Formatting stdin

Format code piped through stdin — useful for editor integrations:

```sh title=">_"
cat main.ts | deno fmt -
```

## Configuring the formatter

Customize formatting options in your `deno.json`:

```json title="deno.json"
{
  "fmt": {
    "useTabs": false,
    "lineWidth": 80,
    "indentWidth": 2,
    "semiColons": true,
    "singleQuote": false,
    "proseWrap": "preserve"
  }
}
```

See the [Configuration](/runtime/fundamentals/configuration/#formatting) page
for all available options.

## Including and excluding files

Specify which files to format in `deno.json`:

```json title="deno.json"
{
  "fmt": {
    "include": ["src/"],
    "exclude": ["src/testdata/", "src/generated/**/*.ts"]
  }
}
```

You can also exclude files from the command line:

```sh title=">_"
deno fmt --ignore=dist/,build/
```

## Supported file types

<!-- This list needs to be updated along with https://github.com/denoland/deno/blob/main/cli/tools/fmt.rs -->

| File Type            | Extension                                              | Notes                                                                                  |
| -------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| JavaScript           | `.js`, `.cjs`, `.mjs`                                  |                                                                                        |
| TypeScript           | `.ts`, `.mts`, `.cts`                                  |                                                                                        |
| JSX                  | `.jsx`                                                 |                                                                                        |
| TSX                  | `.tsx`                                                 |                                                                                        |
| Markdown             | `.md`, `.mkd`, `.mkdn`, `.mdwn`, `.mdown`, `.markdown` |                                                                                        |
| JSON                 | `.json`                                                |                                                                                        |
| JSONC                | `.jsonc`                                               |                                                                                        |
| CSS                  | `.css`                                                 |                                                                                        |
| HTML                 | `.html`                                                |                                                                                        |
| [Nunjucks][Nunjucks] | `.njk`                                                 |                                                                                        |
| [Vento][Vento]       | `.vto`                                                 |                                                                                        |
| YAML                 | `.yml`, `.yaml`                                        |                                                                                        |
| Sass                 | `.sass`                                                |                                                                                        |
| SCSS                 | `.scss`                                                |                                                                                        |
| LESS                 | `.less`                                                |                                                                                        |
| Jupyter Notebook     | `.ipynb`                                               |                                                                                        |
| Astro                | `.astro`                                               | Requires `--unstable-component` flag or `"unstable": ["fmt-component"]` config option. |
| Svelte               | `.svelte`                                              | Requires `--unstable-component` flag or `"unstable": ["fmt-component"]` config option. |
| Vue                  | `.vue`                                                 | Requires `--unstable-component` flag or `"unstable": ["fmt-component"]` config option. |
| SQL                  | `.sql`                                                 | Requires `--unstable-sql` flag or `"unstable": ["fmt-sql"]` config option.             |

[Nunjucks]: https://mozilla.github.io/nunjucks/
[Vento]: https://github.com/ventojs/vento

:::note

**`deno fmt` can format code snippets in Markdown files.** Snippets must be
enclosed in triple backticks and have a language attribute.

:::

## Ignoring code

### JavaScript / TypeScript / JSONC

Ignore formatting code by preceding it with a `// deno-fmt-ignore` comment:

```ts
// deno-fmt-ignore
export const identity = [
    1, 0, 0,
    0, 1, 0,
    0, 0, 1,
];
```

Or ignore an entire file by adding a `// deno-fmt-ignore-file` comment at the
top of the file.

### Markdown / HTML / CSS

Ignore formatting next item by preceding it with `<!--- deno-fmt-ignore -->`
comment:

```html title="HTML"
<html>
  <body>
    <p>
      Hello there
      <!-- deno-fmt-ignore -->
    </p>
  </body>
</html>
```

To ignore a section of code, surround the code with
`<!-- deno-fmt-ignore-start -->` and `<!-- deno-fmt-ignore-end -->` comments.

Or ignore an entire file by adding a `<!-- deno-fmt-ignore-file -->` comment at
the top of the file.

### YAML

Ignore formatting next item by preceding it with `# deno-fmt-ignore` comment:

```html title="HTML"
# deno-fmt-ignore aaaaaa: bbbbbbb
```
