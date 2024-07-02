---
title: "Node.js built-in APIs"
oldUrl:
  - /deploy/docs/runtime-node/
---

Deno Deploy natively supports importing built-in Node.js modules like `fs`,
`path`, and `http` through `node:` specifiers. This allows running code
originally written for Node.js without changes in Deno Deploy.

Here is an example of a Node.js HTTP server running on Deno Deploy:

```js
import { createServer } from "node:http";
import process from "node:process";

const server = createServer((req, res) => {
  const message = `Hello from ${process.env.DENO_REGION} at ${new Date()}`;
  res.end(message);
});

server.listen(8080);
```

_You can see this example live here:
https://dash.deno.com/playground/node-specifiers_

When using `node:` specifiers, all other features of Deno Deploy are still
available. For example, you can use `Deno.env` to access environment variables
even when using Node.js modules. You can also import other ESM modules from
external URLs as usual.

The following Node.js modules are available:

- `assert`
- `assert/strict`
- `async_hooks`
- `buffer`
- `child_process`
- `cluster`
- `console`
- `constants`
- `crypto`
- `dgram`
- `diagnostics_channel`
- `dns`
- `dns/promises`
- `domain`
- `events`
- `fs`
- `fs/promises`
- `http`
- `http2`
- `https`
- `module`
- `net`
- `os`
- `path`
- `path/posix`
- `path/win32`
- `perf_hooks`
- `process`
- `punycode`
- `querystring`
- `readline`
- `stream`
- `stream/consumers`
- `stream/promises`
- `stream/web`
- `string_decoder`
- `sys`
- `timers`
- `timers/promises`
- `tls`
- `tty`
- `url`
- `util`
- `util/types`
- `v8`
- `vm`
- `worker_threads`
- `zlib`

The behavior of these modules should be identical to Node.js in most cases. Due
to the sandboxing behaviour of Deno Deploy, some features are not available:

- Executing binaries with `child_process`
- Spawning workers using `worker_threads`
- Creating contexts and evaluating code with `vm`

> Note: the emulation of Node.js modules is sufficient for most use cases, but
> it is not yet perfect. If you encounter any issues, please
> [open an issue](https://github.com/denoland/deno).
