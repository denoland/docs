---
title: "`deno serve`, declarative way to write servers"
---

In addition to `deno run`, Deno offers a `deno serve` command-line option that
automatically configures servers based on the exports of your main module.

Here's an example of how you can create a simple HTTP server using the `serve`
subcommand:

```typescript
export default {
  async fetch(request) {
    return new Response("Hello world!");
  },
};
```

In this example, the `fetch` function is used to handle incoming HTTP requests.

The logic inside the `fetch` function can be customized to handle different
types of requests and serve content accordingly:

```typescript
export default {
  async fetch(request) {
    if (request.url.startsWith("/json")) {
      return Response.json({ hello: "world" });
    }

    return new Response("Hello world!");
  },
};
```
