/**
 * @title Generate sitemap.xml and robots.txt
 * @difficulty beginner
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://www.sitemaps.org/protocol.html} Sitemaps XML format
 * @resource {/examples/http_server_rss} Example: Generate an RSS feed
 * @group Network
 *
 * Search engines discover pages through a sitemap and learn crawling rules
 * from robots.txt. Both files derive from the same route list, so serving
 * them from one handler keeps them in sync as the site grows.
 */

// The sitemap protocol requires absolute URLs in every loc element, so the
// canonical origin has to be part of the data.
const SITE = "https://example.com";

const routes = [
  { path: "/", lastmod: "2026-06-01" },
  { path: "/about", lastmod: "2026-05-12" },
  { path: "/blog", lastmod: "2026-06-10" },
  { path: "/blog/hello-world", lastmod: "2026-05-20" },
];

// A urlset with one url element per route. lastmod uses the W3C date
// format, YYYY-MM-DD is enough.
function sitemap(): string {
  const urls = routes.map((route) =>
    `  <url>
    <loc>${SITE}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

// robots.txt points crawlers at the sitemap. The Sitemap line also needs
// an absolute URL.
const robots = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`;

Deno.serve((req) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/sitemap.xml") {
    return new Response(sitemap(), {
      headers: { "content-type": "application/xml; charset=utf-8" },
    });
  }

  if (pathname === "/robots.txt") {
    return new Response(robots, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response("hello\n");
});

// Both files come from the same route list:
//
//   curl -s http://localhost:8000/sitemap.xml | head -n 7
//   <?xml version="1.0" encoding="UTF-8"?>
//   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//     <url>
//       <loc>https://example.com/</loc>
//       <lastmod>2026-06-01</lastmod>
//     </url>
//     <url>
//
//   curl -s http://localhost:8000/robots.txt
//   User-agent: *
//   Allow: /
//
//   Sitemap: https://example.com/sitemap.xml
