#!/usr/bin/env -S deno run --allow-write

/**
 * Creates a minimal placeholder node.json for deployment builds
 * when SKIP_NODE_DOCS is set to avoid memory issues
 */

const placeholderNodeDocs = {
  "kind": "packageDoc",
  "name": "Node",
  "version": "",
  "description":
    "Node.js APIs for Deno - Documentation not available in this build",
  "index": {
    "kind": "module",
    "name": "Node",
    "doc":
      "Node.js APIs for Deno. Full documentation is available when built with sufficient memory.",
    "children": [],
  },
  "apiDocs": {},
  "breadcrumbs": {},
};

console.log("Creating placeholder node.json for deployment build...");
await Deno.writeTextFile(
  "./gen/node.json",
  JSON.stringify(placeholderNodeDocs, null, 2),
);
console.log("✅ Created placeholder node.json");
