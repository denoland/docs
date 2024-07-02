---
title: "`import.meta` API"
---

Deno supports a number of properties and methods on the
[`import.meta`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import.meta)
API:

## `import.meta.url`

Returns the URL of the current module.

```ts
// main.ts
console.log(import.meta.url);
```

```sh
$ deno run main.ts
file:///dev/main.ts

$ deno run https:/example.com/main.ts
https://example.com/main.ts
```

## `import.meta.main`

Returns whether the current module is the entry point to your program.

```ts
// main.ts
import "./other.ts";

console.log(`Is ${import.meta.url} the main module?`, import.meta.main);

// other.ts
console.log(`Is ${import.meta.url} the main module?`, import.meta.main);
```

```sh
$ deno run main.ts
Is file:///dev/other.ts the main module? false
Is file:///dev/main.ts the main module? true
```

## `import.meta.filename`

_This property is only available for local modules (module that have
`file:///...` specifier) and returns `undefined` for remote modules._

Returns the fully resolved path to the current module. The value contains OS
specific path separators.

```ts
// main.ts
console.log(import.meta.filename);
```

On Unix:

```sh
$ deno run main.ts
/dev/main.ts

$ deno run https://example.com/main.ts
undefined
```

On Windows:

```sh
$ deno run main.ts
C:\dev\main.ts

$ deno run https://example.com/main.ts
undefined
```

## `import.meta.dirname`

_This property is only available for local modules (module that have
`file:///...` specifier) and returns `undefined` for remote modules._

Returns the fully resolved path to the directory containing the current module.
The value contains OS specific path separators.

```ts
// main.ts
console.log(import.meta.dirname);
```

On Unix:

```sh
$ deno run main.ts
/dev/

$ deno run https://example.com/main.ts
undefined
```

On Windows:

```sh
$ deno run main.ts
C:\dev\

$ deno run https://example.com/main.ts
undefined
```

## `import.meta.resolve`

Resolve specifiers relative to the current module.

```ts
const worker = new Worker(import.meta.resolve("./worker.ts"));
```

The `import.meta.resolve` API takes into account the currently applied import
map, which gives you the ability to resolve "bare" specifiers as well.

With such import map loaded...

```json
{
  "imports": {
    "fresh": "https://deno.land/x/fresh@1.0.1/dev.ts"
  }
}
```

...you can now resolve:

```js
// resolve.js
console.log(import.meta.resolve("fresh"));
```

```sh
$ deno run resolve.js
https://deno.land/x/fresh@1.0.1/dev.ts
```
