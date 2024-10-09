---
title: "Reverse proxy middleware"
---

This quickstart will cover how to deploy a small piece of middleware that
reverse proxies another server (in this case example.com). For additional
examples of common middleware functions, see the
[example gallery](../tutorials/index.md).

## **Step 1:** Create a new playground project on Deno Deploy

Navigate to https://dash.deno.com/projects and click on the "New Playground"
button.

## **Step 2:** Deploy middleware code via playground

On the next page, copy and paste the code below into the editor. It is an HTTP
server that proxies all requests to https://example.com.

```ts
async function reqHandler(req: Request) {
  const reqPath = new URL(req.url).pathname;
  return await fetch("https://example.com" + reqPath, { headers: req.headers });
}

Deno.serve(reqHandler);
```

Click **Save and Deploy**.

You should see something like this:

![image](../docs-images/proxy_to_example.png)
