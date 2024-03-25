# Parsing and Stringifying CSS

If you want to parse CSS to a abstract syntax tree (AST) then there are two
solutions you might want to consider:

- [reworkcss/css](https://github.com/reworkcss/css)
- [deno_css](https://deno.land/x/css)

`reworkcss/css` was written originally for Node.js but work well when consumed
from a CDN. Importing from `esm.sh` also automatically combines the type
definitions from DefinitelyTyped. It should be noted though that types on
DefinitelyTyped are not _very good_ as many union types that should be tagged
union types are just union types which leave the types very ambiguous and
require a lot of type casting.

Also, if you want to take an AST and generate CSS, `reworkcss/css` also provides
capability to stringify the AST it generates.

`deno_css` is authored in TypeScript specifically for Deno and is available on
`deno.land/x`.

## Basic example with `reworkcss/css`

In this example, we will parse some CSS into an AST and make a modification to
the `background` declaration of the `body` rule, to change the color to `white`.
Then we will stringify the modified CSS AST and output it to the console:

```ts
import * as css from "https://esm.sh/css@3.0.0";
import { assert } from "jsr:std/assert@^0";

declare global {
  interface AbortSignal {
    reason: unknown;
  }
}

const ast = css.parse(`
body {
  background: #eee;
  color: #888;
}
`);

assert(ast.stylesheet);
const body = ast.stylesheet.rules[0] as css.Rule;
assert(body.declarations);
const background = body.declarations[0] as css.Declaration;
background.value = "white";

console.log(css.stringify(ast));
```

## A basic example with `deno_css`

In this example, we will parse some CSS into an AST and log out the `background`
declaration of the `body` rule to the console.

```ts
import * as css from "https://deno.land/x/css@0.3.0/mod.ts";

const ast = css.parse(`
body {
  background: #eee;
  color: #888;
}
`);

const [body] = ast.stylesheet.rules;
const [background] = body.declarations;

console.log(JSON.stringify(background, undefined, "  "));
```
