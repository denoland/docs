/**
 * @title Generate an RSS feed
 * @difficulty beginner
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://www.rssboard.org/rss-specification} RSS 2.0 specification
 * @resource {/examples/http_server} Example: HTTP server: Hello world
 * @group Network
 *
 * An RSS feed is a small XML document that lets readers subscribe to a site.
 * Feeds are simple enough to build with a template string: escape the text
 * fields, format dates in the RFC 822 style the spec requires, and serve the
 * result with the right content type.
 */

const SITE = "https://example.com";

const posts = [
  {
    slug: "tips-tricks",
    title: "Tips & tricks for <template> elements",
    description: "Why & how to use them",
    published: new Date("2026-06-01T10:00:00Z"),
  },
  {
    slug: "hello-world",
    title: "Hello world",
    description: "The first post",
    published: new Date("2026-05-20T08:30:00Z"),
  },
];

// XML has five characters that must not appear raw in text content. The
// ampersand goes first, otherwise it would re-escape the others.
function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

// RSS wants RFC 822 dates, like Mon, 01 Jun 2026 10:00:00 GMT.
// Date.prototype.toUTCString produces exactly that format.
function buildFeed(): string {
  const items = posts.map((post) =>
    `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid>${SITE}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${post.published.toUTCString()}</pubDate>
    </item>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Example blog</title>
    <link>${SITE}/blog</link>
    <description>Posts from the example blog</description>
${items}
  </channel>
</rss>
`;
}

Deno.serve((req) => {
  const { pathname } = new URL(req.url);
  if (pathname === "/feed.xml") {
    // application/rss+xml is the registered media type for RSS. Readers
    // also accept application/xml, but be precise when you can.
    return new Response(buildFeed(), {
      headers: { "content-type": "application/rss+xml; charset=utf-8" },
    });
  }
  return new Response("see /feed.xml\n");
});

// The feed validates as RSS 2.0, with the ampersand and angle brackets in
// the first title escaped:
//
//   curl -s http://localhost:8000/feed.xml | head -n 13
//   <?xml version="1.0" encoding="UTF-8"?>
//   <rss version="2.0">
//     <channel>
//       <title>Example blog</title>
//       <link>https://example.com/blog</link>
//       <description>Posts from the example blog</description>
//       <item>
//         <title>Tips &amp; tricks for &lt;template&gt; elements</title>
//         <link>https://example.com/blog/tips-tricks</link>
//         <guid>https://example.com/blog/tips-tricks</guid>
//         <description>Why &amp; how to use them</description>
//         <pubDate>Mon, 01 Jun 2026 10:00:00 GMT</pubDate>
//       </item>
