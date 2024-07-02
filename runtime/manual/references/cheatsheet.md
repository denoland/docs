---
title: "Node → Deno cheatsheet"
---

| Node.js                                | Deno                                           |
| -------------------------------------- | ---------------------------------------------- |
| `node file.js`                         | `deno run file.js`                             |
| `ts-node file.ts`                      | `deno run file.ts`                             |
| `node -e`                              | `deno eval`                                    |
| `npm i -g`                             | `deno install`                                 |
| `npm i` / `npm install`                | _n/a_ ¹                                        |
| `npm run`                              | `deno task`                                    |
| `eslint`                               | `deno lint`                                    |
| `prettier`                             | `deno fmt`                                     |
| `package.json`                         | `deno.json` / `deno.jsonc` / `import_map.json` |
| `tsc`                                  | `deno check` ²                                 |
| `typedoc`                              | `deno doc`                                     |
| `jest` / `ava` / `mocha` / `tap` / etc | `deno test`                                    |
| `nodemon`                              | `deno run/lint/test --watch`                   |
| `nexe` / `pkg`                         | `deno compile`                                 |
| `npm explain`                          | `deno info`                                    |
| `nvm` / `n` / `fnm`                    | `deno upgrade`                                 |
| `tsserver`                             | `deno lsp`                                     |
| `nyc` / `c8` / `istanbul`              | `deno coverage`                                |
| benchmarks                             | `deno bench`                                   |

¹ See [Modules](../basics/modules/index.md), the runtime downloads and caches
the code on first use.

² Type checking happens automatically, TypeScript compiler is built into the
`deno` binary.
