---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
openGraphLayout: "/open_graph/cli-commands.jsx"
openGraphTitle: "deno serve"
description: "A flexible and configurable HTTP server for Deno"
---

## Example

Here's an example of how you can create a simple HTTP server with declarative
fetch:

```typescript title="server.ts"
export default {
  async fetch(_req) {
    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```

The `satisfies Deno.ServeDefaultExport` type assertion ensures that your
exported object conforms to the expected interface for Deno's HTTP server. This
provides type safety and better editor autocomplete while allowing you to
maintain the inferred types of your implementation.

You can then run the server using the `deno serve` command:

```bash
deno serve server.ts
```

The logic inside the `fetch` function can be customized to handle different
types of requests and serve content accordingly:

```typescript title="server.ts"
export default {
  async fetch(request) {
    if (request.url.endsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
} satisfies Deno.ServeDefaultExport;
```
