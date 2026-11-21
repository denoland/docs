---
tags: [recommended]
---

Disallows empty files.

A file that contains no code — only whitespace, comments, or a directive
prologue such as `"use strict"` — serves no purpose and is usually the result of
a mistake, such as an incomplete refactor or a bad merge. Either add some code
to the file or delete it.

A file consisting solely of a triple-slash reference directive (for example
`/// <reference types="..." />`) is allowed, since such directives are
meaningful.

**Invalid:**

```typescript
// (a file containing only this comment)
```

```typescript
"use strict";
```

```typescript
{
}
```

**Valid:**

```typescript
const x = 0;
```

```typescript
/// <reference types="./types.d.ts" />
```
