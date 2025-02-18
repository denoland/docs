import { doc, generateHtmlAsJSON } from "@deno/doc";
import {
  hrefResolver,
  renderMarkdown,
  stripMarkdown,
} from "./common.ts";
import categoryDocs from "./web-categories.json" with { type: "json" };

const url = import.meta.resolve("./types/web.d.ts");

console.log("Generating doc nodes...");

const nodes = await doc([url], { includeAll: true });

console.log("Generating json structure...");

const files = await generateHtmlAsJSON(nodes, {
  packageName: "Web",
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

await Deno.writeTextFile("./gen/web.json", JSON.stringify(files));
