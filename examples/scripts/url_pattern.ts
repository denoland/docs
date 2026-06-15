/**
 * @title Match URLs with URLPattern
 * @difficulty beginner
 * @tags cli, deploy, web
 * @run <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URLPattern} MDN: URLPattern
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URL_Pattern_API} MDN: URL Pattern API
 * @group Web Standard APIs
 *
 * URLPattern matches URLs against route-style patterns and extracts the
 * dynamic parts. It is the same syntax used by many web routers, built
 * directly into the platform. This example matches pathnames, reads named
 * groups, and builds a tiny router on top of it.
 */

// A pattern component named with a colon, like :id, matches one path
// segment and captures it under that name. Components that are not
// specified, like protocol and hostname, default to wildcards.
const pattern = new URLPattern({ pathname: "/users/:id" });

// The test method returns a boolean and is useful for quick checks.
console.log(pattern.test("https://example.com/users/123")); // true
console.log(pattern.test("https://example.com/posts/123")); // false

// The exec method returns a result object, or null when there is no match.
// Each URL component has its own groups object with the captured values.
const match = pattern.exec("https://example.com/users/123");
console.log(match?.pathname.groups.id); // 123

// A wildcard written as * matches across segment boundaries. Unnamed
// wildcards are captured under numeric keys, starting at 0.
const assets = new URLPattern({ pathname: "/static/*" });
const asset = assets.exec("https://example.com/static/css/site.css");
console.log(asset?.pathname.groups[0]); // css/site.css

// Patterns can also match the search and hash components. The leading ?
// and # characters are not part of the pattern.
const paged = new URLPattern({ search: "page=:page" });
console.log(paged.exec("https://example.com/list?page=4")?.search.groups.page); // 4

const section = new URLPattern({ hash: "section-:name" });
console.log(
  section.exec("https://example.com/docs#section-install")?.hash.groups.name,
); // install

// A router is just an ordered list of pattern and handler pairs. The first
// pattern that matches wins and receives the captured groups.
type Handler = (groups: Record<string, string | undefined>) => string;

const routes: [URLPattern, Handler][] = [
  [new URLPattern({ pathname: "/" }), () => "home page"],
  [new URLPattern({ pathname: "/users/:id" }), (g) => `user ${g.id}`],
  [
    new URLPattern({ pathname: "/users/:id/posts/:post" }),
    (g) => `post ${g.post} by user ${g.id}`,
  ],
];

function route(url: string): string {
  for (const [pattern, handler] of routes) {
    const result = pattern.exec(url);
    if (result) return handler(result.pathname.groups);
  }
  return "404 not found";
}

// In a real server the URL would come from the incoming request. Calling
// the lookup function directly shows the same logic without a server.
console.log(route("https://example.com/")); // home page
console.log(route("https://example.com/users/42")); // user 42
console.log(route("https://example.com/users/42/posts/7")); // post 7 by user 42
console.log(route("https://example.com/about")); // 404 not found
