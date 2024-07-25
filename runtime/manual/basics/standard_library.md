---
title: "Standard Library"
---

Deno provides a set of standard modules that are audited by the core team and
are guaranteed to work with Deno.

The standard library is hosted on JSR and is available at: https://jsr.io/@std.
Packages are documented, tested, and include usage examples.

## Versioning and stability

Each package of the standard library is independently versioned. Packages follow
semantic versioning rules. You can use version pinning or version ranges to
prevent breaking changes.

```typescript
// imports the latest 1.x version of `copy` from the `fs` package
import { copy } from "jsr:@std/fs@^1.0.0";
```

More examples of semver version selection syntax can be found in the
[@std/semver](https://jsr.io/@std/semver) package documentation.
