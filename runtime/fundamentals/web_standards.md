---
title: "Web Standards and Node APIs"
---

Deno aims to bridge the gap between the browser and the backend with a set of
web standard APIs that are familiar to web developers. These APIs are designed
to be compatible with the web platform, making it easier to write code that can
run in both the browser and Deno.

Existing Node.js ecosystem compatibility is provided through a set of Node.js
compatible APIs and Deno namespace APIs. These APIs are designed to be
compatible with Node.js, making it easier to port existing Node.js code to Deno.

Deno also provides its global namespace APIS, to empower developers with
low-level capabilities, often essential for system-level tasks.

## Web Platform APIs

If you’ve ever built for the browser, you’re already on familiar ground. Deno
supports standard web APIs (like fetch, WebSockets, and more) instead of
proprietary alternatives. This means your existing web knowledge can be used in
your Deno projects.

For more information about the web platform APIs, see the
[Web Platform APIs](/runtime/reference/web_platform_apis/) documentation.

## Node.js Compatibility and APIs

Deno’s Node.js compatibility isn’t about replacing Node, it’s about coexistence.
Developers can gradually migrate their projects, leveraging Deno’s security
features and built in tooling while benefiting from Node.js libraries. Many
Node.js libraries are battle-tested and widely used. Deno’s compatibility allows
developers to reuse this code seamlessly. No need for a complete rewrite—just
import your favorite Node.js modules.

For more information about Node.js compatibility, see the
[Node.js Compatibility](/runtime/reference/node/) documentation.

## Deno Namespace APIs

The global Deno namespace offers APIs that go beyond web standards. These APIs
allow you to interact with system-level tasks such as the environment, file
system, network, and more. For more information about the Deno namespace APIs,
see the [Deno Namespace](/runtime/reference/deno_namespace_apis/) documentation.
