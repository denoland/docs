/**
 * @title Render markdown to HTML
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -WE <url>
 * @resource {https://jsr.io/@deno/gfm} @deno/gfm on JSR
 * @resource {https://docs.deno.com/examples/front_matter/} Example: Extract front matter from markdown
 * @group Web frameworks and libraries
 *
 * The @deno/gfm module renders GitHub Flavored Markdown to HTML, with the
 * same tables, task lists, and syntax highlighting you see on GitHub. It is
 * the renderer behind this documentation site, so it is a safe default for
 * turning user content or markdown files into web pages.
 */
import { render } from "jsr:@deno/gfm";

// Syntax highlighting is opt-in per language: import the matching Prism
// grammar and the renderer will tokenize fenced code blocks in that
// language. Import one line per language you want to highlight.
import "npm:prismjs/components/prism-typescript.js";

const markdown = `# Release notes

Deno **2.0** is here. Highlights:

- Stable APIs
- A code block:

\`\`\`ts
const greeting: string = "hello";
\`\`\`
`;

// render returns an HTML fragment, not a full document. Headings get
// anchor links and code blocks are highlighted with token spans.
const body = render(markdown);
console.log(body.includes("<h1")); // true
console.log(body.includes("token")); // true

// To produce a standalone page, wrap the fragment and include the GFM
// stylesheet. The CSS export styles the markup, and the markdown-body
// class is the selector it targets.
import { CSS } from "jsr:@deno/gfm";

const page = `<!DOCTYPE html>
<html>
  <head><style>${CSS}</style></head>
  <body class="markdown-body" data-color-mode="light">${body}</body>
</html>`;

await Deno.writeTextFile("release-notes.html", page);
console.log("wrote release-notes.html");

// Markdown is rendered by an untrusted-input-safe parser, but if you allow
// raw HTML in the source, sanitize the output before serving it. The
// render function strips scripts by default; pass allowMath or other
// options when you need them.
