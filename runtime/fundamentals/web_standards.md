---
title: "Web Standards and Node APIs"
---

Deno aims to narrow the gap between browser and server-side JavaScript by
providing the same web APIs that are available client side, in the server. This
means if you know how to program for a browser, you already know how to program
Deno!

Existing Node.js ecosystem compatibility is provided through a built-in
compatibility layer that allows you to use any npm package directly in Deno.

Deno also provides its own Deno specific APIs, accessible under the `Deno`
global namespace, that are performant, simple ways to do server-side only
operations.

## Web Platform APIs

If you’ve ever built for the browser, you’re already on familiar ground. Deno
supports standard web APIs (like fetch, WebSockets, and more) instead of
proprietary alternatives. This means your existing web knowledge can be used in
your Deno projects.

For more information about the web platform APIs, see the
[Web Platform APIs](/runtime/reference/web_platform_apis/) documentation.

## Node.js built-in APIs

Deno’s Node.js compatibility isn’t about replacing Node, it’s about coexistence.
Developers can gradually migrate their projects, leveraging Deno’s security
features and built in tooling while benefiting from Node.js libraries. Many
Node.js libraries are battle-tested and widely used. Deno’s compatibility allows
developers to reuse this code seamlessly. No need for a complete rewrite—just
import your favorite Node.js modules with a `node:` prefix, (eg `node:fs`) and
they will operate exactly as they do in Node.js.

For more information about Node.js compatibility, see the
[Node.js Compatibility](/runtime/reference/node/) documentation.

## Deno APIs

The global Deno namespace offers APIs that go beyond web standards. These APIs
allow you to interact with system-level tasks such as the environment, file
system, network, and more. For more information about the Deno namespace APIs,
see the [Deno Namespace](/runtime/reference/deno_namespace_apis/) documentation.
