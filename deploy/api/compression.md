---
title: "Compressing response bodies"
oldUrl:
  - /deploy/docs/compression/
---

Compressing the response body to save bandwidth is a common practice. To take
some work off your shoulder, we built the capabilities directly into Deploy.

Deno Deploy supports brotli and gzip compression. Compression is applied when
the following conditions are met.

1. The request to your deployment has [`Accept-Encoding`][accept-encoding]
   header set to either `br` (brotli) or `gzip`.
2. The response from your deployment includes the [`Content-Type`][content-type]
   header.
3. The provided content type is compressible; we use
   [this database](https://github.com/jshttp/mime-db/blob/master/db.json) to
   determine if the content type is compressible.
4. The response body size is greater than 20 bytes.

When Deploy compresses the response body, it will set `Content-Encoding: gzip`
or `Content-Encoding: br` header to the response based on the compression
algorithm used.

### When is compression skipped?

Deno Deploy skips the compression if:

- The response has [`Content-Encoding`][content-encoding] header.
- The response has [`Content-Range`][content-range] header.
- The response's [`Cache-Control`][cache-control] header has
  [`no-transform`][no-transform] value (e.g.
  `cache-control: public, no-transform`).

### What happens to my `Etag` header?

When you set an Etag header with the response, we convert the header value to a
Weak Etag if we apply compression to your response body. If it is already a Weak
Etag, we don't touch the header.

[accept-encoding]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept-Encoding
[cache-control]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
[content-encoding]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Encoding
[content-type]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
[no-transform]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#other
[content-range]: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Range
