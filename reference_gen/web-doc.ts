import { doc, generateHtml } from "@deno/doc";
import {
  hrefResolver,
  renderMarkdown,
  stripMarkdown,
  writeFiles,
} from "./common.ts";
import categoryDocs from "./web-categories.json" with { type: "json" };

const url = import.meta.resolve("./types/web.d.ts");

console.log("Generating doc nodes...");

const nodes = await doc(url, { includeAll: true });

console.log("Generating html files...");

const files = await generateHtml({ [url]: nodes }, {
  packageName: "Web",
  categoryDocs,
  disableSearch: true,
  hrefResolver,
  usageComposer: {
    singleMode: true,
    compose(_currentResolve, _usageToMd) {
      return new Map();
    }
  },
  markdownRenderer: renderMarkdown,
  markdownStripper: stripMarkdown,
});

await writeFiles("./gen/web", files);
