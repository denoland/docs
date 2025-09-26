---
title: Caching
description: "Overview of CDN caching functionality in Deno Deploy, including cache configuration, directives, and best practices."
---

Deno Deploy includes a built-in CDN that can cache responses from your
application. This improves performance for:

- Static assets (images, CSS, JavaScript files)
- API responses and server-rendered pages that don't change frequently

Caching is enabled by default for all applications, but only responses with
appropriate caching headers are actually cached.

Deno Deploy integrates with popular frameworks like Next.js to automatically
optimize caching for features such as Incremental Static Regeneration (ISR).

The CDN cache is tied to both the revision and context. When you deploy a new
revision, the cache is automatically invalidated, ensuring users always see the
latest version of your application. Note that browser caching may still serve
older content if the `Cache-Control` header permits it.

## Caching a resource

To cache a resource, set the `Cache-Control` header in your response. This
standard HTTP header tells browsers and the CDN how to cache your content.

### Supported caching directives

Deno Deploy supports these caching directives:

| Directive                | Description                                                                                                                                                             |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `max-age`                | Maximum time (in seconds) the response is considered fresh by both CDN and browsers. After this time, the response is considered stale and revalidated with the server. |
| `s-maxage`               | Maximum time (in seconds) the response is considered fresh by shared caches (CDNs only, not browsers). After this time, the response is revalidated with the server.    |
| `stale-while-revalidate` | Maximum time (in seconds) a stale response can be served while a fresh one is fetched in the background.                                                                |
| `stale-if-error`         | Maximum time (in seconds) a stale response can be served if the server returns an error.                                                                                |
| `immutable`              | Indicates the response will never change, allowing indefinite caching. Ideal for content-hashed static assets.                                                          |
| `no-store`               | Prevents caching of the response. Use for dynamic content that should never be cached.                                                                                  |
| `no-cache`               | Requires revalidation with the server before serving from cache. Use for content that changes frequently but can benefit from conditional requests.                     |

### Additional caching headers

- `Vary`: Specifies which request headers should be included in the cache key,
  creating separate cached versions based on those headers.

- `Expires`: Sets an absolute expiration date for the response (alternative to
  `max-age`). do not change, such as images or CSS files.
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
