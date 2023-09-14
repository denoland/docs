# Simple HTTP Web Server

## Concepts

- Use Deno's integrated HTTP server to run your own web server.

## Overview

With just a few lines of code you can run your own HTTP web server with control
over the response status, request headers and more.

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

```shell
deno run --allow-net server.ts
```
