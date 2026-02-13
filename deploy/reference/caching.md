---
title: CDN and caching
description: "HTTP caching in Deno Deploy: cache control headers, cache tags, invalidation API, and best practices for edge caching."
---

Deno Deploy includes a built-in HTTP caching layer that automatically caches
eligible responses at the edge, reducing latency and origin load. This document
covers how caching works, how to control cache behavior, and how to invalidate
cached content.

## How Caching Works

When a request arrives at Deno Deploy:

1. The cache checks if a valid cached response exists for the request
2. If found and fresh, the cached response is served immediately (cache hit)
3. If not found or stale, the request is forwarded to your application (cache
   miss)
4. Cacheable responses are stored for future requests

The cache follows [RFC 9110](https://httpwg.org/specs/rfc9110.html) and
[RFC 9111](https://httpwg.org/specs/rfc9111.html) semantics, implementing
standard HTTP caching behavior.

## Cache-Control Headers

Deno Deploy respects the standard `Cache-Control` header with the following
directives:

### Response Directives

| Directive                    | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `public`                     | Response can be cached by shared caches                       |
| `private`                    | Response is user-specific and cannot be cached (bypasses CDN) |
| `no-store`                   | Response must not be cached                                   |
| `no-cache`                   | Response must be revalidated before use                       |
| `max-age=N`                  | Response is fresh for N seconds                               |
| `s-maxage=N`                 | Like `max-age`, but only for shared caches (takes precedence) |
| `stale-while-revalidate=N`   | Serve stale content while revalidating in background          |
| `stale-if-error=N`           | Serve stale content if origin returns an error                |
| `must-revalidate`            | Stale responses must not be used without revalidation         |

### Example: Cache for 1 hour at the edge

```typescript
Deno.serve(() => {
  return new Response("Hello, World!", {
    headers: {
      "Cache-Control": "public, s-maxage=3600",
    },
  });
});
```

### Example: Cache with stale-while-revalidate

```typescript
Deno.serve(() => {
  return new Response(JSON.stringify({ data: "..." }), {
    headers: {
      "Content-Type": "application/json",
      // Cache for 60s, serve stale for up to 5 minutes while revalidating
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
});
```

## Deno Deploy-Specific Headers

Deno Deploy supports additional headers for fine-grained cache control:

### `Deno-CDN-Cache-Control`

A CDN-specific cache control header that takes precedence over both
`CDN-Cache-Control` and `Cache-Control`. Use this when you want different
caching behavior for Deno Deploy's CDN versus browsers or other caches.

**Header priority (highest to lowest):**

1. `Deno-CDN-Cache-Control`
2. `CDN-Cache-Control`
3. `Cache-Control`

```typescript
Deno.serve(() => {
  return new Response("Hello!", {
    headers: {
      // Browser caches for 60s
      "Cache-Control": "public, max-age=60",
      // Deno Deploy CDN caches for 1 hour
      "Deno-CDN-Cache-Control": "public, s-maxage=3600",
    },
  });
});
```

### `Deno-Cache-Tag` / `Cache-Tag`

Associate responses with cache tags for targeted invalidation. Tags allow you to
invalidate groups of cached responses without knowing their exact URLs.

```typescript
Deno.serve((req) => {
  const url = new URL(req.url);
  const productId = url.pathname.split("/")[2];

  return new Response(JSON.stringify({ id: productId, name: "Widget" }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, s-maxage=3600",
      // Tag this response for later invalidation
      "Deno-Cache-Tag": `product-${productId},products,catalog`,
    },
  });
});
```

**Tag format:**

- Multiple tags can be specified as a comma-separated list
- Tags are case-insensitive
- Maximum 1024 characters per tag
- Maximum 500 tags per response
- Tags must be UTF-8 encoded

### `Deno-Cache-Id`

A special header that serves two purposes:

1. **Opt out of automatic invalidation**: Responses with `Deno-Cache-Id` use a
   shared cache namespace that persists across deployments. Without this header,
   cached responses are automatically invalidated when you deploy a new version.

2. **Acts as a cache tag**: The value can be used to invalidate the cached
   response.

```typescript
Deno.serve(() => {
  return new Response("Static content that rarely changes", {
    headers: {
      "Cache-Control": "public, s-maxage=86400",
      // This response survives redeployments
      "Deno-Cache-Id": "static-content-v1",
    },
  });
});
```

**Use cases for `Deno-Cache-Id`:**

- Content that should remain cached across deployments (e.g., static assets
  with content-based hashes)
- Long-lived cached responses where you want explicit control over invalidation
- Sharing cached responses between deployment revisions

### `Deno-Vary`

Extend cache variation beyond standard HTTP `Vary` semantics. _(Coming soon)_

## Cache Invalidation

Deno Deploy supports on-demand cache invalidation via cache tags. This allows
you to purge specific cached content without redeploying.

### Invalidation API

Send a POST request to `http://cache.localhost/invalidate/http` from within your
Deno Deploy application:

```typescript
Deno.serve(async (req) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname === "/admin/purge") {
    // Invalidate all responses tagged with "products"
    const res = await fetch("http://cache.localhost/invalidate/http", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: ["products"],
      }),
    });

    if (res.ok) {
      return new Response("Cache purged successfully");
    }
    return new Response("Purge failed", { status: 500 });
  }

  // ... handle other requests
});
```

### Invalidation Request Format

```json
{
  "tags": ["tag1", "tag2", "tag3"]
}
```

- `tags`: Array of cache tags to invalidate (required)
- Maximum 500 tags per request

### Wildcard Invalidation

Use `"*"` to invalidate all cached responses for your deployment:

```typescript
await fetch("http://cache.localhost/invalidate/http", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tags: ["*"],
  }),
});
```

### Cross-Region Invalidation

Cache invalidation is automatically synchronized across all Deno Deploy regions.
When you invalidate a tag, the purge propagates globally within seconds.

### Example: Content Management Webhook

```typescript
Deno.serve(async (req) => {
  const url = new URL(req.url);

  // Webhook endpoint for CMS updates
  if (req.method === "POST" && url.pathname === "/webhook/cms") {
    const payload = await req.json();

    // Invalidate based on content type
    const tags: string[] = [];

    if (payload.type === "product") {
      tags.push(`product-${payload.id}`, "products");
    } else if (payload.type === "category") {
      tags.push(`category-${payload.id}`, "categories", "navigation");
    }

    if (tags.length > 0) {
      await fetch("http://cache.localhost/invalidate/http", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });
    }

    return new Response("OK");
  }

  // ... serve content
});
```

## Cache Status Header

Deno Deploy adds a `Cache-Status` response header to indicate the cache result:

| Value                        | Description                                     |
| ---------------------------- | ----------------------------------------------- |
| `deno; hit`                  | Response served from cache                      |
| `deno; fwd=uri-miss; stored` | Cache miss, response stored for future requests |
| `deno; fwd=miss; stored`     | Vary miss, response stored with new vary key    |
| `deno; fwd=stale`            | Stale response, forwarding to origin            |
| `deno; fwd=method`           | Non-cacheable method (POST, PUT, etc.)          |
| `deno; fwd=bypass`           | Response explicitly bypassed cache              |
| `deno; fwd=request`          | Request directives prevented caching            |

### Bypass Details

When a response bypasses the cache, the `detail` field indicates why:

- `detail=not-cacheable` - Response doesn't meet caching criteria
- `detail=no-cache-or-private` - `no-cache` or `private` directive present
- `detail=set-cookie` - Response contains `Set-Cookie` header
- `detail=pragma-no-cache` - Legacy `Pragma: no-cache` header present
- `detail=too-large` - Response body exceeds maximum cacheable size
- `detail=zero-ttl` - Calculated TTL is zero
- `detail=vary-star` - `Vary: *` header prevents caching
- `detail=header-overflow` - Too many response headers

## Cacheable Responses

A response is cacheable when:

1. The request method is `GET` or `HEAD`
2. The response status is cacheable (200, 203, 204, 206, 300, 301, 308, 404,
   405, 410, 414, 501)
3. The response includes caching headers (`Cache-Control`, `Expires`, etc.)
4. The response doesn't include `no-store`, `private`, or `no-cache` directives
5. The response doesn't include a `Set-Cookie` header
6. The response body is within the maximum cacheable size

## Cache Variation (Vary)

The cache respects the standard `Vary` header to store different versions of a
response based on request headers:

```typescript
Deno.serve((req) => {
  const acceptLanguage = req.headers.get("Accept-Language") || "en";
  const language = acceptLanguage.startsWith("es") ? "es" : "en";

  return new Response(`Hello in ${language}!`, {
    headers: {
      "Cache-Control": "public, s-maxage=3600",
      "Vary": "Accept-Language",
      "Content-Language": language,
    },
  });
});
```

**Note:** `Vary: *` prevents caching entirely.

## HEAD Requests

HEAD requests can be served from cached GET responses. The cache automatically
strips the response body while preserving headers.

## Range Requests

The cache supports HTTP range requests (`Range` header) and can serve partial
content from cached full responses.

## Best Practices

### 1. Use `s-maxage` for CDN caching

```typescript
// Let browsers cache for 1 minute, CDN for 1 hour
headers: {
  "Cache-Control": "public, max-age=60, s-maxage=3600"
}
```

### 2. Tag content for targeted invalidation

```typescript
// Tag by content type, ID, and category for flexible purging
headers: {
  "Deno-Cache-Tag": `article-${id},articles,category-${category}`
}
```

### 3. Use `stale-while-revalidate` for better UX

```typescript
// Serve stale content while refreshing in background
headers: {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600"
}
```

### 4. Use `Deno-Cache-Id` for stable assets

```typescript
// Content-addressed assets that shouldn't be invalidated on deploy
const hash = computeHash(content);
headers: {
  "Cache-Control": "public, s-maxage=31536000, immutable",
  "Deno-Cache-Id": `asset-${hash}`
}
```

### 5. Set appropriate TTLs

- Static assets with hash in filename: `max-age=31536000` (1 year)
- API responses: `s-maxage=60` to `s-maxage=300` with `stale-while-revalidate`
- Personalized content: Don't cache or use `Vary` appropriately

## Automatic Cache Invalidation

By default, all cached responses (without `Deno-Cache-Id`) are automatically
invalidated when you deploy a new version of your application. This ensures
users always see fresh content after a deployment.

To opt out of automatic invalidation, use the `Deno-Cache-Id` header.
