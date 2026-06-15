/**
 * @title Extract links and metadata from HTML
 * @difficulty beginner
 * @tags cli, deploy
 * @run -N <url>
 * @resource {https://jsr.io/@b-fuze/deno-dom} Doc: deno-dom
 * @resource {https://ogp.me/} Reference: Open Graph protocol
 * @group Web Standard APIs
 *
 * Scrapers, link checkers, and preview cards all start the same way: fetch
 * a page and pull data out of its HTML. This example parses a page with
 * deno-dom and extracts its links, title, and social metadata.
 */
import { DOMParser } from "jsr:@b-fuze/deno-dom";

// Fetch a page and parse the HTML into a queryable document.
const html = await (await fetch("https://example.com/")).text();
const doc = new DOMParser().parseFromString(html, "text/html");

// Extract every link with the same querySelectorAll you would use in a
// browser. Resolving against the page URL turns relative hrefs absolute.
for (const anchor of doc.querySelectorAll("a[href]")) {
  const href = new URL(anchor.getAttribute("href")!, "https://example.com/");
  console.log(href.href); // https://www.iana.org/domains/example
}

// The document title works like in the browser too.
console.log(doc.title); // Example Domain

// Social preview cards read Open Graph meta tags. Collect every og:
// property into a record.
const og: Record<string, string> = {};
for (const meta of doc.querySelectorAll('meta[property^="og:"]')) {
  const property = meta.getAttribute("property")!.slice(3);
  og[property] = meta.getAttribute("content") ?? "";
}
console.log(og); // {} (example.com has no Open Graph tags)

// Pages without Open Graph tags usually still have a description.
const description = doc.querySelector('meta[name="description"]')
  ?.getAttribute("content");
console.log(description ?? "(no description)");
