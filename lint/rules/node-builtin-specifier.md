---
tags: [recommended]
---

Enforces the use of the `node:` specifier for Node built-in modules.

Deno requires Node built-in modules to be imported with the `node:` specifier.
Importing them with a bare specifier (e.g. `"fs"`) is not supported and only
works by accident in some setups, so this rule reports a warning and offers a
quick fix that adds the `node:` prefix.

### Invalid:

```typescript
import * as path from "path";
import * as fs from "fs";
import * as fsPromises from "fs/promises";
await import("os");
```

### Valid:

```typescript
import * as path from "node:path";
import * as fs from "node:fs";
import * as fsPromises from "node:fs/promises";
await import("node:os");
```
