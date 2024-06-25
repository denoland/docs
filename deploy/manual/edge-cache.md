---
title: "Edge Cache"
---

:::caution Beta feature

Cache API support on Deno Deploy is currently in beta.

:::

The [Web Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache) is
supported on Deno Deploy. The cache is designed to provide microsecond-level
read latency, multi-GB/s write throughput and unbounded storage, with the
tradeoff of best-effort consistency and durability.

```ts
const cache = await caches.open("my-cache");

Deno.serve(async (req) => {
  const cached = await cache.match(req);
  if (cached) {
    return cached;
  }

  const res = new Response("cached at " + new Date().toISOString());
  await cache.put(req, res.clone());
  return res;
});
```

Cached data is stored in the same Deno Deploy region that runs your code.
Usually your isolate observes read-after-write (RAW) and write-after-write (WAW)
consistency within the same region; however, in rare cases recent writes can be
lost, out-of-order or temporarily invisible.

## Limitations

- The `Content-Length` header is required for cached requests.
- Deletion is not yet supported.
