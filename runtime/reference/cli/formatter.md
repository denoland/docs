---
title: "`deno fmt`, code formatting"
oldUrl:
 - /runtime/tools/formatter/
 - /runtime/manual/tools/formatter/
command: fmt
---

## Supported File Types

Deno ships with a built-in code formatter that will auto-format the following
files:

| File Type  | Extension          | Notes                                                                                  |
| ---------- | ------------------ | -------------------------------------------------------------------------------------- |
| JavaScript | `.js`              |                                                                                        |
| TypeScript | `.ts`              |                                                                                        |
| JSX        | `.jsx`             |                                                                                        |
| TSX        | `.tsx`             |                                                                                        |
| Markdown   | `.md`, `.markdown` |                                                                                        |
| JSON       | `.json`            |                                                                                        |
| JSONC      | `.jsonc`           |                                                                                        |
| CSS        | `.css`             |                                                                                        |
| HTML       | `.html`            |                                                                                        |
| YAML       | `.yml`, `.yaml`    |                                                                                        |
| Sass       | `.sass`            |                                                                                        |
| SCSS       | `.scss`            |                                                                                        |
| LESS       | `.less`            |                                                                                        |
| Astro      | `.astro`           | Requires `--unstable-component` flag or `"unstable": ["fmt-component"]` config option. |
| Svelte     | `.svelte`          | Requires `--unstable-component` flag or `"unstable": ["fmt-component"]` config option. |
| Vue        | `.vue`             | Requires `--unstable-component` flag or `"unstable": ["fmt-component"]` config option. |

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
