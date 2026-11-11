---
last_modified: 2026-11-11
title: "Local development"
---

:::warning Deploy Classic has been shut down

Deno Deploy Classic (dash.deno.com) was shut down on July 20, 2026. These pages
are kept for reference only.

:::

For local development you can use the `deno` CLI. To install `deno`, follow the
instructions in the
[Deno manual](https://deno.land/manual/getting_started/installation).

After installation, you can run your scripts locally:

```shell
$ deno run --allow-net=:8000 https://deno.com/examples/hello.js
Listening on http://localhost:8000
```

To watch for file changes add the `--watch` flag:

```shell
$ deno run --allow-net=:8000 --watch ./main.js
Listening on http://localhost:8000
```

For more information about the Deno CLI, and how to configure your development
environment and IDE, visit the Deno Manual's [Getting Started][manual-gs]
section.

[manual-gs]: https://deno.land/manual/getting_started
