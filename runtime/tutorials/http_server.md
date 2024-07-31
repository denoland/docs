---
title: "Simple HTTP Web Server"
oldUrl:
  - /runtime/manual/examples/http_server/
---

Deno's has an integrated HTTP server allow you to create and run your own web server.

With just a few lines of code we'll write an HTTP web server with control
over the response status, request headers and more.

Create a new file called `server.ts` and add the following code:

## Using Deno Serve

```ts title="server.ts"
const port = 8080;

const handler = (request: Request): Response => {
  const body = `Your user-agent is:\n\n${
    request.headers.get("user-agent") ?? "Unknown"
  }`;

  return new Response(body, { status: 200 });
};

console.log(`HTTP server running. Access it at: http://localhost:8080/`);
Deno.serve({ port }, handler);
```

Then run this with:

```bash
deno run --allow-net server.ts
```

You can read more about the `--allow-net` flag and other permissions in the [permissions tutorial](/tutorials/permissions).

You can now access your server at `http://localhost:8080/`.

