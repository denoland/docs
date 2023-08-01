# Reverse proxy middleware

This quickstart will cover how to deploy a small piece of middleware that
reverse proxies another server (in this case example.com). For additional
examples of common middleware functions, see the
[example gallery](https://www.deno.com/deploy/examples).

## **Step 1:** Create a new playground project on Deno Deploy

Navigate to https://dash.deno.com/new and click on the **Play** button in the
**Playground** card.

## **Step 2:** Deploy middleware code via playground

On the next page, copy and paste the code below into the editor. It is an HTTP
server that proxies all requests to https://example.com.

```ts
import { serve } from "https://deno.land/std/http/mod.ts";
async function reqHandler(req: Request) {
  const reqPath = new URL(req.url).pathname;
  return await fetch("https://example.com" + reqPath, { headers: req.headers });
}
serve(reqHandler, { port: 8000 });
```

Click **Save and Deploy**.

You should see something like this:

![image](../docs-images/proxy_to_example.png)
