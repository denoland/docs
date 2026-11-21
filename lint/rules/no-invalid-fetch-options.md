---
tags: [recommended]
---

Disallows passing a `body` to `fetch()` or `new Request()` when the method is
`GET` or `HEAD`.

The HTTP `GET` and `HEAD` methods must not have a request body. Supplying a
`body` together with one of these methods (including the default method, which
is `GET`) throws a `TypeError` at runtime, so it is always a mistake.

**Invalid:**

```typescript
fetch(url, { body: "foo" });
fetch(url, { method: "GET", body: "foo" });
fetch(url, { method: "HEAD", body: "foo" });
new Request(url, { body: "foo" });
```

**Valid:**

```typescript
fetch(url, { method: "POST", body: "foo" });
fetch(url, { method: "GET" });
fetch(url, { body: undefined });
new Request(url, { method: "PUT", body: "foo" });
```
