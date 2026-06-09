---
title: "HTTP serving"
description: "How Deno.serve() works inside a desktop app — automatic port binding, the DENO_SERVE_ADDRESS env var, and serving local UI to the embedded webview."
---

A `deno desktop` app serves its UI over local HTTP and points the embedded
webview at it. This keeps the app structure identical to a normal Deno website —
[`Deno.serve()`](/api/deno/~/Deno.serve) is the entry point, every request flows
through your handler — but with no port to manage and no remote network
exposure.

## How it works

When the binary starts:

1. The runtime picks an unused local port and sets the `DENO_SERVE_ADDRESS`
   environment variable to `http://127.0.0.1:<port>`.
2. Your code calls `Deno.serve(...)`. The serve API reads `DENO_SERVE_ADDRESS`
   (set by Deno itself in this mode, not by the user) and binds to that port —
   ignoring whatever port you pass.
3. The webview navigates to `http://127.0.0.1:<port>` once the listener is
   ready.

You write the same handler you would for any Deno HTTP server. There is no
desktop-specific serving API.

```ts title="main.ts"
Deno.serve((req) => {
  const url = new URL(req.url);
  if (url.pathname === "/api/hello") {
    return Response.json({ hello: "world" });
  }
  return new Response(HOMEPAGE, {
    headers: { "content-type": "text/html" },
  });
});

const HOMEPAGE = `<!doctype html>
<html><body>
  <h1>Hello, desktop</h1>
  <button onclick="fetch('/api/hello').then(r => r.json()).then(console.log)">
    Ping
  </button>
</body></html>`;
```

```sh
deno desktop main.ts
```

The default-export form works too:

```ts title="main.ts"
export default {
  fetch(req: Request): Response {
    return new Response("Hello!");
  },
};
```

## Why local HTTP?

The local-HTTP architecture trades a tiny amount of overhead for properties that
matter for desktop apps:

- **Same code in browser and desktop.** The homepage, fetch, websockets, and
  cookies all behave identically in `deno run` and `deno desktop`. You can
  develop in a browser tab and ship the same code as a desktop binary.
- **No special module system.** Imports, static assets, and module-level code
  all run the way they would for a web server.
- **Frameworks "just work".** Next.js, Astro, Fresh, and the rest already ship a
  production HTTP server. `deno desktop` runs that server and points the webview
  at it. See [Frameworks](/runtime/desktop/frameworks/).

The cost is a single network hop within `127.0.0.1` per request. For UI serving
— HTML, CSS, bundled JS, JSON API responses — this is negligible.

For high-throughput Deno → webview communication where the overhead matters, use
[bindings](/runtime/desktop/bindings/), which bypass HTTP entirely and route
through tokio channels.

## Network exposure

The bound address is **always** `127.0.0.1` (or `[::1]`). The compiled binary
never binds to a public interface, even if you pass `0.0.0.0` to
[`Deno.serve()`](/api/deno/~/Deno.serve). Other apps and other users on the same
machine cannot reach your server.

If you need to serve users on other machines (a self-hosted local server), do
not use `deno desktop` for that part of your stack — use `deno run` with an
explicit address, or build a separate service.

## Custom port behavior

You cannot override the port [`Deno.serve()`](/api/deno/~/Deno.serve) binds to
inside `deno desktop`. This is intentional — the webview needs to navigate to
the same port the runtime is listening on, and the runtime is the source of
truth for that value.

If you need to know the URL inside your handler:

```ts
console.log("Serving on:", Deno.env.get("DENO_SERVE_ADDRESS"));
```

## Serving multiple windows

When you create additional [windows](/runtime/desktop/windows/), they all load
from the same local HTTP server by default. Use different paths per window to
differentiate:

```ts
const settings = new Deno.BrowserWindow();
settings.navigate("http://127.0.0.1:" + port + "/settings");
```

The `port` is available via `Deno.env.get("DENO_SERVE_ADDRESS")`.
