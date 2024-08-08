---
title: "Node → Deno cheatsheet"
oldUrl: 
- /runtime/manual/references/cheatsheet/
---

| Node.js                                | Deno                          |
| -------------------------------------- | ----------------------------- |
| `node file.js`                         | `deno run file.js`            |
| `ts-node file.ts`                      | `deno run file.ts`            |
| `nodemon`                              | `deno run --watch`            |
| `node -e`                              | `deno eval`                   |
| `npm i` / `npm install`                | `deno install`                |
| `npm install -g`                       | `deno install -g`             |
| `npm run`                              | `deno task`                   |
| `eslint`                               | `deno lint`                   |
| `prettier`                             | `deno fmt`                    |
| `package.json`                         | `deno.json` or `package.json` |
| `tsc`                                  | `deno check` ¹                |
| `typedoc`                              | `deno doc`                    |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                   |
| `nexe` / `pkg`                         | `deno compile`                |
| `npm explain`                          | `deno info`                   |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                |
| `tsserver`                             | `deno lsp`                    |
| `nyc` / `c8` / `istanbul`              | `deno coverage`               |
| benchmarks                             | `deno bench`                  |

¹ Type checking happens automatically, TypeScript compiler is built into the
`deno` binary.

## Built-in Node.js globals

Deno provides a similar set of built-in globals as Node.js, but with some
differences. Here are some common ones:

| Node.js                      | Deno                            |
| ---------------------------- | ------------------------------- |
| `process.cwd()`              | `Deno.cwd()`                    |
| `process.env.MY_ENV`         | `Deno.env.get("MY_ENV")`        |
| `process.env.MY_ENV = "foo"` | `Deno.env.set("MY_ENV", "foo")` |
| `process.platform`           | `Deno.build.os`                 |
| `process.arch`               | `Deno.build.arch`               |
| `process.execPath()`         | `Deno.execPath()`               |
| `process.exist(code)`        | `Deno.exit(code)`               |

It is also possible to import Node.js modules into your project using the
`node:` specifier. For example:

```js
import process from "node:process";
```

### APIs

| Node.js                                  | Deno                          |
| ---------------------------------------- | ----------------------------- |
| `fsPromises.readFile(filePath, "utf-8")` | `Deno.readTextFile(filePath)` |
