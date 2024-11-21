import { doc, DocNode, generateHtml } from "@deno/doc";
import { expandGlob } from "@std/fs";
import {
  hrefResolver,
  renderMarkdown,
  stripMarkdown,
  writeFiles,
} from "./common.ts";
import symbolRedirectMap from "./node-symbol-map.json" with { type: "json" };
import defaultSymbolMap from "./node-default-map.json" with { type: "json" };
import rewriteMap from "./node-rewrite-map.json" with { type: "json" };

const newRewriteMap = Object.fromEntries(
  Object.entries(rewriteMap).map((
    [key, val],
  ) => [import.meta.resolve(val), key]),
);

const nodesByUrl: Record<string, DocNode[]> = {};

console.log("Generating doc nodes...");

for await (const file of expandGlob("./types/node/[!_]*")) {
  const path = `file://${file.path}`;

  nodesByUrl[path] = await doc(path);
}

console.log("Generating html files...");

const files = await generateHtml(nodesByUrl, {
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

await writeFiles("./gen/node", files);
