---
title: "deno serve"
oldUrl: /runtime/manual/tools/serve/
command: serve
---

## Example

Here's an example of how you can create a simple HTTP server with declarative
fetch:

```typescript title="server.ts"
export default {
  async fetch(_req) {
    return new Response("Hello world!");
  },
};
```

You can then run the server using the `deno serve` command:

```bash
deno serve server.ts
```

The logic inside the `fetch` function can be customized to handle different
types of requests and serve content accordingly:

```typescript title="server.ts"
export default {
  async fetch(request) {
    if (request.url.startsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
};
```
