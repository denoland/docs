/**
 * @title Parse and generate XML
 * @difficulty beginner
 * @tags cli
 * @run <url>
 * @resource {https://jsr.io/@libs/xml} @libs/xml on JSR
 * @group Encoding
 *
 * There is no XML parser in the web platform's server-side APIs or in the
 * Deno standard library, but the @libs/xml package on JSR covers both
 * directions: XML text to plain JavaScript objects and back. This is
 * enough for RSS feeds, sitemaps, SVG manipulation, and API responses
 * from older services.
 */
import { parse, stringify } from "jsr:@libs/xml";

// An RSS-style document with attributes, nesting, and repeated elements.
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed>
  <title>Deno releases</title>
  <entry id="1" draft="false">
    <title>Deno 2.0</title>
  </entry>
  <entry id="2" draft="true">
    <title>Deno 2.1</title>
  </entry>
</feed>`;

// parse returns nested objects. Attributes are prefixed with @, text
// content of a leaf element becomes its value, and repeated elements
// become an array.
const doc = parse(xml) as unknown as {
  feed: {
    title: string;
    entry: { "@id": string; "@draft": string; title: string }[];
  };
};

console.log(doc.feed.title); // Deno releases
console.log(doc.feed.entry.length); // 2
console.log(doc.feed.entry[1]["@id"]); // 2

// Values keep their string form unless you opt into revival; attributes
// like draft="true" can be compared as strings or revived to booleans via
// the reviver options of parse.
const drafts = doc.feed.entry.filter((e) => e["@draft"] === "true");
console.log(drafts.map((e) => e.title)); // [ "Deno 2.1" ]

// stringify performs the reverse mapping: objects with @-prefixed keys
// become attributes, everything else becomes elements.
const generated = stringify({
  sitemap: {
    url: [
      { loc: "https://example.com/", "@priority": "1.0" },
      { loc: "https://example.com/docs", "@priority": "0.8" },
    ],
  },
});
console.log(generated);
// <sitemap>
//   <url priority="1.0">
//     <loc>https://example.com/</loc>
//   </url>
//   <url priority="0.8">
//     <loc>https://example.com/docs</loc>
//   </url>
// </sitemap>
