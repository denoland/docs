---
title: "Formatting with Deno fmt"
url: /examples/deno_fmt/
videoUrl: https://www.youtube.com/watch?v=Ouzso9gQqnc
layout: video.tsx
---

## Video description

A quick cut of tips and tricks on
[Deno's built in formatter, `deno fmt`](/runtime/reference/cli/fmt/).

what's up everyone, Andy from Deno here, back for another episode of the **Deno
tool chain series** where we dig a little deeper into the deno subcommands.

Today we're going to look at `deno fmt`, our built-in formatter that's
customizable, performant and flexible enough to fit into any workflow. Let's
dive right in.

### What is `deno fmt`?

`deno fmt` will format these file extensions:

- `.js`
- `.jsx`
- `.ts`
- `.tsx`
- `.json`
- `.jsonc`
- `.md`
- `.markdown`

The simplest way to use `deno fmt` is to run it from the command line:

```sh
deno fmt
```

You could even pipe in a string or file:

```sh
echo ' console.log(    5  );' | deno fmt
## console.log(5);
```

You can also use the `--check` flag which will check if your code has been
formatted by `deno fmt`. If it's not formatted, it will return a nonzero exit
code:

```sh
echo 'deno fmt --check
## error: Found 1 not formatted file in 1 files
```

This is useful in CI where you want to check if the code is formatted properly.

### Editor integration

`deno fmt` also works in your editor, like VS Code. Set `deno fmt` as your
default formatter in your editors settings, eg for VS Code:

```json title=".vscode/settings.json"
{
  "editor.defaultFormatter": "denoland.vscode-deno",
  "editor.formatOnSave": true
}
```

You can also set format on save to be true

### Multiple ways to format

In some situations, there are multiple ways to format, and Deno lets you decide
how you want to format. For example an object can be formatted horizontally or
vertically, it depends on where you put your first item. Eg:

```typescript
const foo = { bar: "baz", qux: "quux" };

// or

const foo = {
  bar: "baz",
  qux: "quux",
};
```

Same with an array. You can format it horizontally or vertically depending on
where you put your first item. Eg:

```typescript
const foo = ["bar", "baz", "qux"];

// or

const foo = [
  "bar",
  "baz",
  "qux",
];
```

### Remove escaped quotes

`deno fmt` can also reduce the escaped characters in your strings. For example,
if you have a string with escaped quotes, `deno fmt` will remove them:

```typescript
console.log('hello "world"');
```

will be formatted to:

```typescript
console.log('hello "world"');
```

### Ignoring lines or files

What if you want `deno fmt` to skip a line or a file? You can use the
`//deno-fmt-ignore` comment to tell `deno fmt` to skip the following line, eg:

```typescript
console.log("This   line    will  be  formatted");

// deno-fmt-ignore
console.log("This   line  will  not be    formatted");
```

To tell `deno fmt` to skip a file, you can use the `// deno-fmt-ignore-file`
comment at the top of the file to ignore. Or you can use your `deno.json` config
file under the `fmt` field:

```json
{
  "fmt": {
    "exclude": ["main.ts", "*.json"]
  }
}
```

Or at the top level of `deno.json` to tell both `deno fmt` and `deno lint` to
ignore it. (This is a good place to put your generated files):

```json
{
  "fmt": {
    "ignore": ["main.ts", "*.json"]
  }
}
```

### Formatting markdown

`deno fmt` also works on markdown files. You can choose how to format prose with
the option `"proseWrap"` set to either `always`, `never` or `preserve`, eg:

```json
{
  "fmt": {
    "proseWrap": "always"
  }
}
```

`deno fmt` can also format numbered lists if you start a number list with two
ones, for example:

```markdown title="list.md"
1. First
1. Second
1. Third
1. Fourth
1. Fifth
```

The formatter will automatically format the list to all ones, but when you
render it, it will show the number list properly!

If that's weird you can also put `1` and then `2` and then run `deno fmt`, which
will number the rest of the list correctly for you.

`deno fmt` will also format code blocks of JavaScript and TypeScript in your
markdown. It can even format markdown in markdown!

### Formatter options

Let's take a look at
[all the options available in `deno fmt`](/runtime/reference/cli/fmt/#formatting-options).
Note that all these options also have a corresponding flags in the CLI.

```json
{
  "fmt": {
    "useTabs": true,
    "lineWidth": 80,
    "indentWidth": 2,
    "semiColon": false,
    "singleQuote": true,
    "proseWrap": "always",
    "ignore": ["**/logs.json"]
  }
}
```

- `--use-tabs`
- `--line-width <line-width>`
- `--indent-width <indent-width>`
- `--no-semicolons`
- `--single-quote`
- `--prose-wrap <prose-wrap>`
- `--ignore=<ignore>`

### `deno fmt`'s Performance

`deno fmt` is really fast, especially on subsequent runs due to caching, which
is enabled by default. Here's the first run that we did on Deno's standard
Library. Let's run it again! The system time shows that the second run is a
third faster. If we update a file and run it again it's still fast since
`deno fmt` checks only the changed file. Let's compare this to `Prettier` (a
popular Node formatter), we'll run Prettier with a caching flag enabled. Even on
a second run, `deno fmt` is almost 20 times faster!
