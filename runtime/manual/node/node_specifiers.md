# `node:` specifiers

Deno supports using Node.js built-in modules such as
[fs](https://nodejs.org/api/fs.html#file-system),
[path](https://nodejs.org/api/path.html#path),
[process](https://nodejs.org/api/process.html#process), and many more via
`node:` specifiers.

```ts, ignore
import { readFileSync } from "node:fs";

console.log(readFileSync("deno.json", { encoding: "utf8" }));
```

Take note that importing via a bare specifier (ex.
`import { readFileSync } from "fs";`) is not supported. If you attempt to do so
and the bare specifier matches a Node.js built-in module not found in an import
map, Deno will provide a helpful error message asking if you meant to import
with the `node:` prefix. Additionally the LSP provides a quick fix to update to
a `node:` specifier.

If you are using code both with Deno and Node.js, the `node:` scheme will work
in both runtimes and it's recommended to update to them for your Node.js code.
