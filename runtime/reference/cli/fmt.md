---
title: "`deno fmt`, code formatting"
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

## Supported File Types

Deno ships with a built-in code formatter that will auto-format the following
files:

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

## Ignoring Code

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

```html
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

```html
# deno-fmt-ignore aaaaaa: bbbbbbb
```

## More about linting and formatting

For more information about linting and formating in Deno, and the differences
between these two utilities, visit the
[Linting and Formatting](/runtime/fundamentals/linting_and_formatting/) page in
our Fundamentals section.
