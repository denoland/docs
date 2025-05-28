---
title: Caching
---

:::info

You are viewing the documentation for Deno Deploy<sup>EA</sup>. Looking for
Deploy Classic documentation? [View it here](/deploy/).

:::

Deno Deploy<sup>EA</sup> has a built-in CDN that can cache responses from your
application. This is useful for static assets, such as images, CSS, and
JavaScript files, as well as for API responses or server rendered pages that do
not change often.

Caching is enabled by default for all applications. Only assets with valid
caching headers are cached.

Deno Deploy<sup>EA</sup> integrates directly with many frameworks, such as
Next.js, to automatically integrate the cache to enable features like ISR.

The CDN cache is tied to the revision and context. This means that if you deploy
a new revision, the cache will be invalidated and no existing cached responses
will be served. This is useful for ensuring that users always see the latest
version of your application. Do note that the browser cache may still serve
stale responses if the `Cache-Control` header is set to a value that allows it.

## Caching a resource

To cache a resource, you need to set the `Cache-Control` header on the response.
The `Cache-Control` header is a standard HTTP header that controls how the
response is cached by the browser and the CDN.

Deno Deploy<sup>EA</sup> supports the following caching directives:

- `max-age`: The maximum amount of time the response is considered fresh. After
  this time, the response is considered stale and will be revalidated with the
  server. This also applies to the browser cache.
- `s-maxage`: The maximum amount of time the response is considered fresh for
  shared caches (e.g. CDNs). After this time, the response is considered stale
  and will be revalidated with the server. This does not apply to the browser
  cache.
- `stale-while-revalidate`: The maximum amount of time the response is
  considered fresh while the response is being revalidated with the server. This
  allows the CDN to serve stale responses while the new response is being
  fetched.
- `stale-if-error`: The maximum amount of time the response is considered fresh
  if the server returns an error. This allows the CDN to serve stale responses
  while the new response is being fetched.
- `immutable`: The response is immutable and will not change. This allows the
  CDN to cache the response indefinitely. This is useful for static assets that
  do not change, such as images or CSS files.
- `no-store`: The response should not be cached. This is useful for dynamic
  responses that should not be cached, such as API responses or server rendered
  pages.
- `no-cache`: The response should be revalidated with the server before being
  served from the cache. This is useful for dynamic responses that may change
  frequently.

The `Vary` header can be used to specify which request headers should be part of
the cache key for the request.

The `Expires` header can be used to specify an absolute expiration date for the
response. This is an alternative to the `max-age` directive.
