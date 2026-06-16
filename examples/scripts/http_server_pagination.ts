/**
 * @title HTTP server: Paginating results
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams} MDN: URLSearchParams
 * @resource {/examples/http_server_routing} Example: HTTP server: Routing
 * @group Network
 *
 * APIs that return lists need pagination so a single response stays small.
 * This server shows the two common schemes over one dataset: offset and
 * limit at /items, and a cursor at /items/cursor. Both return the link to
 * the next page so clients never construct page URLs themselves.
 */

// A stand-in for a database table. Real handlers would run a query with
// the same offset, limit, or cursor values instead.
const items = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

// Clamp client input so a request can never ask for the whole table or
// pass something negative.
function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}

Deno.serve((req) => {
  const url = new URL(req.url);
  const limit = clamp(Number(url.searchParams.get("limit") ?? "5"), 1, 10);

  // Offset pagination: skip the first N items. Simple, and supports
  // jumping straight to an arbitrary page.
  if (url.pathname === "/items") {
    const offset = clamp(
      Number(url.searchParams.get("offset") ?? "0"),
      0,
      items.length,
    );
    const page = items.slice(offset, offset + limit);

    let next: string | null = null;
    if (offset + limit < items.length) {
      next = `/items?offset=${offset + limit}&limit=${limit}`;
    }
    return Response.json({ items: page, total: items.length, next });
  }

  // Cursor pagination: return items after the last id the client saw.
  // Offsets degrade on large or changing datasets: the database must scan
  // and discard all skipped rows, and an insert or delete between two
  // requests shifts every later row, so pages show duplicates or skip
  // items. A cursor on a stable, ordered column resumes exactly after the
  // last row regardless of what happened before it.
  if (url.pathname === "/items/cursor") {
    const after = Number(url.searchParams.get("after") ?? "0");
    const page = items.filter((item) => item.id > after).slice(0, limit);

    // The cursor is the id of the last item on this page. A null cursor
    // tells the client it has reached the end.
    const last = page.at(-1);
    const nextCursor = last !== undefined && last.id < items.length
      ? last.id
      : null;
    const next = nextCursor === null
      ? null
      : `/items/cursor?after=${nextCursor}&limit=${limit}`;
    return Response.json({ items: page, nextCursor, next });
  }

  return new Response("not found\n", { status: 404 });
});

// Two offset pages, then following a cursor. Oversized limits are clamped
// to 10:
//
//   curl -s "http://localhost:8000/items?limit=2"
//   {"items":[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"}],"total":25,"next":"/items?offset=2&limit=2"}
//
//   curl -s "http://localhost:8000/items?offset=2&limit=2"
//   {"items":[{"id":3,"name":"Item 3"},{"id":4,"name":"Item 4"}],"total":25,"next":"/items?offset=4&limit=2"}
//
//   curl -s "http://localhost:8000/items/cursor?after=4&limit=2"
//   {"items":[{"id":5,"name":"Item 5"},{"id":6,"name":"Item 6"}],"nextCursor":6,"next":"/items/cursor?after=6&limit=2"}
//
//   curl -s "http://localhost:8000/items?limit=9999"
//   {"items":[{"id":1,"name":"Item 1"},{"id":2,"name":"Item 2"},{"id":3,"name":"Item 3"},{"id":4,"name":"Item 4"},{"id":5,"name":"Item 5"},{"id":6,"name":"Item 6"},{"id":7,"name":"Item 7"},{"id":8,"name":"Item 8"},{"id":9,"name":"Item 9"},{"id":10,"name":"Item 10"}],"total":25,"next":"/items?offset=10&limit=10"}
