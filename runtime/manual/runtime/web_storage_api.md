# Web Storage API

Deno 1.10 introduced the
[Web Storage API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)
which provides an API for storing string keys and values. Persisting data works
similar to a browser, and has a 10MB storage limit. The global `sessionStorage`
object only persists data for the current execution context, while
`localStorage` persists data from execution to execution.

In a browser, `localStorage` persists data uniquely per origin (effectively the
protocol plus hostname plus port). As of Deno 1.16, Deno has a set of rules to
determine what is a unique storage location:

- When using the `--location` flag, the origin for the location is used to
  uniquely store the data. That means a location of `http://example.com/a.ts`
  and `http://example.com/b.ts` and `http://example.com:80/` would all share the
  same storage, but `https://example.com/` would be different.
- If there is no location specifier, but there is a `--config` configuration
  file specified, the absolute path to that configuration file is used. That
  means `deno run --config deno.jsonc a.ts` and
  `deno run --config deno.jsonc b.ts` would share the same storage, but
  `deno run --config tsconfig.json a.ts` would be different.
- If there is no configuration or location specifier, Deno uses the absolute
  path to the main module to determine what storage is shared. The Deno REPL
  generates a "synthetic" main module that is based off the current working
  directory where `deno` is started from. This means that multiple invocations
  of the REPL from the same path will share the persisted `localStorage` data.

This means, unlike versions prior to 1.16, `localStorage` is always available in
the main process.

## Example

The following snippet accesses the local storage bucket for the current origin
and adds a data item to it using `setItem()`.

```ts
localStorage.setItem("myDemo", "Deno App");
```

The syntax for reading the localStorage item is as follows:

```ts
const cat = localStorage.getItem("myDemo");
```

The syntax for removing the localStorage item is as follows:

```ts
localStorage.removeItem("myDemo");
```

The syntax for removing all the localStorage items is as follows:

```ts
localStorage.clear();
```
