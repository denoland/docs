---
title: "`deno fmt`, code formatting"
oldUrl:
 - /runtime/tools/formatter/
 - /runtime/manual/tools/formatter/
---

Deno ships with a built-in code formatter that will auto-format the following
files:

| File Type  | Extension          | Notes               |
| ---------- | ------------------ | ------------------- |
| JavaScript | `.js`              |                     |
| TypeScript | `.ts`              |                     |
| JSX        | `.jsx`             |                     |
| TSX        | `.tsx`             |                     |
| Markdown   | `.md`, `.markdown` |                     |
| JSON       | `.json`            |                     |
| JSONC      | `.jsonc`           |                     |
| CSS        | `.css`             |                     |
| HTML       | `.html`            |                     |
| YAML       | `.yml`, `.yaml`    |                     |
| Sass       | `.sass`            |                     |
| SCSS       | `.scss`            |                     |
| LESS       | `.less`            |                     |
| Astro      | `.astro`           | unstable, see below |
| Svelte     | `.svelte`          | unstable, see below |
| Vue        | `.vue`             | unstable, see below |

:::note

**`deno fmt` can format code snippets in Markdown files.** Snippets must be
enclosed in triple backticks and have a language attribute.

:::

## Examples

Format all supported files in the current directory and subdirectories

```shell
deno fmt
```

Format specific files

```shell
deno fmt myfile1.ts myfile2.ts

deno fmt index.html styles.css
```

Format all supported files in specified directory and subdirectories

```shell
deno fmt src/
```

Check if all the supported files in the current directory and subdirectories are
formatted

```shell
deno fmt --check
```

Format stdin and write to stdout

```shell
cat file.ts | deno fmt -
```

## Ignoring Code

// TODO(bartlomieju): show examples in all supported langs

Ignore formatting code by preceding it with a `// deno-fmt-ignore` comment in
TS/JS/JSONC:

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

In markdown you may use a `<!-- deno-fmt-ignore -->` comment or ignore a whole
file with a `<!-- deno-fmt-ignore-file -->` comment. To ignore a section of
markdown, surround the code with `<!-- deno-fmt-ignore-start -->` and
`<!-- deno-fmt-ignore-end -->` comments.

## Configuration

// TODO(bartlomieju): update

> ℹ️ It is recommended to stick with default options.

Starting with Deno v1.14 a formatter can be customized using either
[a configuration file](/runtime/fundamentals/configuration/#formatting) or
following CLI flags:

- `--use-tabs` - Whether to use tabs. Defaults to false (using spaces).

- `--line-width` - The width of a line the printer will try to stay under. Note
  that the printer may exceed this width in certain cases. Defaults to 80.

- `--indent-width` - The number of characters for an indent. Defaults to 2.

- `--no-semicolons` - To not use semicolons except where necessary.

- `--single-quote` - Whether to use single quote. Defaults to false (using
  double quote).

- `--prose-wrap={always,never,preserve}` - Define how prose should be wrapped in
  Markdown files. Defaults to "always".

Note: In Deno versions < 1.31 you will have to prefix these flags with
`options-` (ex. `--options-use-tabs`)
