import { doc, generateHtmlAsJSON } from "@deno/doc";
import { expandGlob } from "@std/fs";
import { hrefResolver, renderMarkdown, stripMarkdown } from "./common.ts";
import symbolRedirectMap from "./node-symbol-map.json" with { type: "json" };
import defaultSymbolMap from "./node-default-map.json" with { type: "json" };
import rewriteMap from "./node-rewrite-map.json" with { type: "json" };

const newRewriteMap = Object.fromEntries(
  Object.entries(rewriteMap).map((
    [key, val],
  ) => [import.meta.resolve(val), key]),
);

console.log("Collecting Node.js type definition files...");

const fileNames: string[] = [];
for await (const file of expandGlob("./types/node/[!_]*")) {
  fileNames.push(`file://${file.path}`);
}

console.log(`Found ${fileNames.length} Node.js type definition files`);
console.log("Generating doc nodes...");

// Process all files at once - the @deno/doc library handles this efficiently internally
const nodes = await doc(fileNames);

console.log(`Generated doc nodes for ${Object.keys(nodes).length} modules`);
console.log("Generating json structure...");

const files = await generateHtmlAsJSON(nodes, {
  packageName: "Node",
  disableSearch: true,
  symbolRedirectMap,
  defaultSymbolMap,
  rewriteMap: newRewriteMap,
  hrefResolver,
  usageComposer: {
    singleMode: true,
    compose(currentResolve, usageToMd) {
      if ("file" in currentResolve) {
        return new Map([[
          {
            name: "",
          },
          usageToMd(`node:${currentResolve.file.path}`, undefined),
        ]]);
      } else {
        return new Map();
      }
    },
  },
  markdownRenderer: renderMarkdown,
  markdownStripper: stripMarkdown,
});

await Deno.writeTextFile("./gen/node.json", JSON.stringify(files));
console.log("Node.js documentation generation completed");
