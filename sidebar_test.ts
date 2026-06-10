import { assert } from "@std/assert";
import { sidebar as runtimeSidebar } from "./runtime/_data.ts";
import { sidebar as deploySidebar } from "./deploy/_data.ts";
import { sidebar as classicSidebar } from "./deploy/classic/_data.ts";
import { sidebar as subhostingSidebar } from "./subhosting/_data.ts";
import { sidebar as sandboxSidebar } from "./sandbox/_data.ts";
import type { TitleContent } from "./types.ts";

// Long nav labels wrap onto two lines and blow out the sidebar width, so a
// sidebar must not introduce a label longer than the longest it already has.
// Each cap below is that sidebar's current maximum — tighten it as labels are
// shortened; raising one should be a deliberate design decision.
const SIDEBARS = [
  { name: "runtime", sidebar: runtimeSidebar, maxLabelLength: 22 },
  { name: "deploy", sidebar: deploySidebar, maxLabelLength: 29 },
  { name: "deploy classic", sidebar: classicSidebar, maxLabelLength: 25 },
  { name: "subhosting", sidebar: subhostingSidebar, maxLabelLength: 28 },
  { name: "sandbox", sidebar: sandboxSidebar, maxLabelLength: 23 },
];

// Minimal shape for walking a sidebar tree. The exported `sidebar` data is
// structurally compatible with this (sections and items both have a title and
// optional nested items).
interface LabelNode {
  title?: TitleContent;
  items?: LabelNode[];
}

// Recursively collect every string label from a sidebar tree. Non-string titles
// (rendered JSX, e.g. icons) have no meaningful character length, so skip them.
function collectLabels(nodes: readonly LabelNode[]): string[] {
  const labels: string[] = [];
  for (const node of nodes) {
    if (typeof node.title === "string") labels.push(node.title);
    if (node.items) labels.push(...collectLabels(node.items));
  }
  return labels;
}

for (const { name, sidebar, maxLabelLength } of SIDEBARS) {
  Deno.test(`${name} sidebar labels stay within ${maxLabelLength} characters`, () => {
    const labels = collectLabels(sidebar);
    assert(labels.length > 0, `expected to find labels in the ${name} sidebar`);

    const tooLong = labels.filter((label) => label.length > maxLabelLength);
    assert(
      tooLong.length === 0,
      `These ${name} sidebar labels exceed ${maxLabelLength} characters:\n` +
        tooLong.map((label) => `  ${label.length}  "${label}"`).join("\n") +
        `\nShorten them, or raise the cap for "${name}" in sidebar_test.ts if ` +
        `this is an intentional design change.`,
    );
  });
}
