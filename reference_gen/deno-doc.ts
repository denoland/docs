import { doc, generateHtmlAsJSON } from "@deno/doc";
import {
  hrefResolver,
  renderMarkdown,
  stripMarkdown,
} from "./common.ts";
import categoryDocs from "./deno-categories.json" with { type: "json" };

const url = import.meta.resolve("./types/deno.d.ts");

console.log("Generating doc nodes...");

const nodes = await doc([url], { includeAll: true });

console.log("Generating json structure...");

const files = await generateHtmlAsJSON(nodes, {
  packageName: "Deno",
  categoryDocs,
  disableSearch: true,
  hrefResolver,
  usageComposer: {
    singleMode: true,
    compose(_currentResolve, _usageToMd) {
      return new Map();
    },
  },
  markdownRenderer: renderMarkdown,
  markdownStripper: stripMarkdown,
});

await Deno.writeTextFile("./gen/deno.json", JSON.stringify(files));
