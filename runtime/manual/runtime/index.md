---
title: "Runtime"
---

Documentation for all runtime functions (Web APIs + `Deno` global) can be found
at [`/api`](https://deno.land/api) or with adding the _unstable_ APIs which are
enabled via the `--unstable` flag at
[`/api?unstable`](https://deno.land/api?unstable=true).

## Web Platform APIs

For APIs where a web standard already exists, like `fetch` for HTTP requests,
Deno uses these rather than inventing a new proprietary API.

For more details, view the chapter on
[Web Platform APIs](./web_platform_apis.md).

## `Deno` global

All APIs that are not web standard are contained in the global `Deno` namespace.
It has the APIs for reading from files, opening TCP sockets,
[serving HTTP](./http_server_apis.md), and executing subprocesses, etc.

For more details, view the chapter on [Built-in APIs](./builtin_apis.md).

The TypeScript definitions for the Deno namespaces can be found in the
[`lib.deno.ns.d.ts`](https://github.com/denoland/deno/blob/$CLI_VERSION/cli/tsc/dts/lib.deno.ns.d.ts)
file.
