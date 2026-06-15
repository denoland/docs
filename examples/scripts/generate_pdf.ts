/**
 * @title Generate a PDF
 * @difficulty intermediate
 * @tags cli, deploy
 * @run -W <url>
 * @resource {https://pdf-lib.js.org/} pdf-lib documentation
 * @group Web frameworks and libraries
 *
 * The pdf-lib package creates and edits PDF documents in pure JavaScript,
 * so it runs anywhere Deno does, including Deno Deploy. Use it to produce
 * invoices, tickets, or reports on the fly without a headless browser or a
 * native PDF toolchain.
 */
import { PDFDocument, rgb, StandardFonts } from "npm:pdf-lib";

// A document is a container for pages. Create one, then add pages with an
// explicit size in points (72 points per inch, so this is US Letter).
const pdf = await PDFDocument.create();
const page = pdf.addPage([612, 792]);

// Fonts must be embedded before use. The 14 standard fonts need no font
// file; embedFont returns a handle you pass when drawing text.
const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

// The coordinate origin is the bottom-left corner, so larger y values are
// higher on the page. Draw a heading near the top.
page.drawText("Invoice", {
  x: 50,
  y: 720,
  size: 28,
  font: bold,
  color: rgb(0.1, 0.1, 0.1),
});

// Lay out a few lines of body text below it, stepping y down for each.
const lines = ["Item: Deno subscription", "Amount: $0.00", "Status: Paid"];
let y = 680;
for (const line of lines) {
  page.drawText(line, { x: 50, y, size: 12, font: helvetica });
  y -= 20;
}

// Vector drawing primitives let you add rules, boxes, and backgrounds.
page.drawLine({
  start: { x: 50, y: 700 },
  end: { x: 562, y: 700 },
  thickness: 1,
  color: rgb(0.8, 0.8, 0.8),
});

// save serializes the whole document to PDF bytes, which start with the
// %PDF- magic number. Write them to a file or return them from a server.
const bytes = await pdf.save();
await Deno.writeFile("invoice.pdf", bytes);
console.log(new TextDecoder().decode(bytes.slice(0, 5))); // %PDF-
console.log(`wrote ${bytes.length} bytes`); // wrote 1049 bytes
