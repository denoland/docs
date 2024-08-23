---
title: "Importing modules from HTTP URLs"
oldUrl:
- runtime/manual/node/cdns.md
---

Deno supports importing modules from HTTP URLs. This is useful for importing
modules from a CDN or from a server that serves JavaScript modules. Note that
npm packages can be directly imported via the
[`npm:` specifier](../../manual/node/npm_specifiers).

```typescript
import { render } from "https://esm.sh/preact";
```

You can also import modules from a URL by adding it to your `deno.json` import
map:

```json
{
  "imports": {
    "preact": "https://esm.sh/preact"
  }
}
```

Supporting URL imports enables us to support the following JavaScript CDNs, as
they provide URL access to JavaScript modules:

- [esm.sh](https://esm.sh/) (recommended)
- [jspm.io](https://jspm.io/)

URL imports should be used with caution, as they can introduce security risks.
When importing modules from a URL, you are trusting the server to serve the
correct code. If the server is compromised, it could serve malicious code to
your application. For this reason, it is recommended to use URL imports only
from trusted sources. They can also cause versioning issues if you import
different versions in different files.
