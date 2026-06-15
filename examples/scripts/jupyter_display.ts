/**
 * @title Rich output in Jupyter notebooks
 * @difficulty intermediate
 * @tags cli
 * @resource {https://docs.deno.com/api/deno/~/Deno.jupyter} Doc: Deno.jupyter
 * @resource {https://docs.deno.com/runtime/reference/cli/jupyter/} deno jupyter in the manual
 * @group CLI
 *
 * Deno ships a Jupyter kernel, so notebooks can run TypeScript with full
 * access to the Deno and web APIs. Inside a notebook, the Deno.jupyter
 * namespace renders rich output: Markdown, HTML, images, and raw MIME
 * bundles. Install the kernel once with deno jupyter --install, then run
 * these snippets in notebook cells. Deno.jupyter only exists under the
 * deno jupyter subcommand, not in deno run.
 */

// Deno.jupyter.md and Deno.jupyter.html are tagged templates. When their
// result is the last expression of a cell, the notebook renders it as
// Markdown or HTML instead of plain text.
const name = "Deno";
Deno.jupyter.md`## Hello from ${name}
- supports **Markdown**
- and ${1 + 1} other things`;

// HTML works the same way, useful for small inline visualizations without
// pulling in a plotting library.
Deno.jupyter.html`<table>
  <tr><th>lang</th><th>typed</th></tr>
  <tr><td>TypeScript</td><td>yes</td></tr>
</table>`;

// Deno.jupyter.image displays a PNG or JPEG from a file path or from raw
// bytes, handy for images produced by canvas or image libraries.
Deno.jupyter.image("./chart.png");

// Any value can opt in to rich display by implementing the
// Deno.jupyter.$display symbol method and returning a MIME bundle. The
// notebook picks the richest representation it understands.
class Temperature {
  constructor(public celsius: number) {}
  [Deno.jupyter.$display]() {
    return {
      "text/plain": `${this.celsius} C`,
      "text/html": `<strong>${this.celsius} &deg;C</strong>`,
    };
  }
}
new Temperature(21);

// Deno.jupyter.display shows a value explicitly from anywhere in a cell,
// not just the final expression. The raw option treats the object as a
// MIME bundle as-is.
await Deno.jupyter.display({
  "text/markdown": "Progress: **done**",
}, { raw: true });

// Deno.jupyter.broadcast sends low-level Jupyter protocol messages, for
// example to update a display in place while a long computation runs.
await Deno.jupyter.broadcast("display_data", {
  data: { "text/plain": "working..." },
  metadata: {},
  transient: { display_id: "progress" },
});
