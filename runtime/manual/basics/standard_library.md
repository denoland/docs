# Standard Library

Deno provides a set of standard modules that are audited by the core team and
are guaranteed to work with Deno.

Standard library is available at: https://jsr.io/@std

## Versioning and stability

Standard library is not yet stable and therefore it is versioned differently
than Deno.

We strongly suggest to always use imports with pinned version of standard
library to avoid unintended changes. For example, rather than linking to the
default branch of code, which may change at any time, potentially causing
compilation errors or unexpected behavior:

```typescript
// import the latest release, this should be avoided
import { copy } from "jsr:@std/fs@/copy";
```

instead, use a version of the std library which is immutable and will not
change:

```typescript
// imports from 0.x of std/fs
import { copy } from "jsr:@std/fs@^0/copy";
```
