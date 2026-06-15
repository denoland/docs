/**
 * @title Render HTML templates with Eta
 * @difficulty beginner
 * @tags cli, deploy
 * @run -RW <url>
 * @resource {https://eta.js.org/} Eta documentation
 * @resource {https://docs.deno.com/examples/http_server/} Example: HTTP server
 * @group Web frameworks and libraries
 *
 * When JSX is more than you need, a string template engine renders HTML
 * from plain templates and data. Eta is a small, fast engine with no
 * dependencies that works well in Deno: templates are just text with
 * embedded expressions, and the data is passed in as an object.
 */
import { Eta } from "jsr:@eta-dev/eta";

// Render a template directly from a string. The it object holds the data;
// <%= %> escapes its value for safe insertion into HTML, and <% %> runs
// statements such as loops.
const eta = new Eta();

const html = eta.renderString(
  `<h1><%= it.title %></h1>
<ul>
<% it.items.forEach(function (item) { %>
  <li><%= item %></li>
<% }) %>
</ul>`,
  { title: "Shopping list", items: ["Eggs", "Milk & honey"] },
);
console.log(html);
// <h1>Shopping list</h1>
// <ul>
//   <li>Eggs</li>
//   <li>Milk &amp; honey</li>
// </ul>

// Note that the ampersand in "Milk & honey" was escaped to &amp;, which is
// what prevents user data from breaking the page or injecting markup. Use
// <%~ %> only for values you trust and want inserted as raw HTML.

// For real projects, keep templates in files and let Eta load them. Point
// views at a directory, then render by file name; partials and layouts
// resolve relative to it.
const fileEta = new Eta({ views: "./templates" });
await Deno.mkdir("./templates", { recursive: true });
await Deno.writeTextFile(
  "./templates/card.eta",
  `<article><h2><%= it.name %></h2></article>`,
);

console.log(fileEta.render("card", { name: "Deno" })); // <article><h2>Deno</h2></article>
