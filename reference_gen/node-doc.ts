import { doc, generateHtmlAsJSON } from "@deno/doc";
import { expandGlob } from "@std/fs";
import { hrefResolver, renderMarkdown, stripMarkdown } from "./common.ts";
import { EnhancedGenerationCache } from "./cache.ts";
import symbolRedirectMap from "./node-symbol-map.json" with { type: "json" };
import defaultSymbolMap from "./node-default-map.json" with { type: "json" };
import rewriteMap from "./node-rewrite-map.json" with { type: "json" };
import { existsSync } from "@std/fs";

const newRewriteMap = Object.fromEntries(
  Object.entries(rewriteMap).map((
    [key, val],
  ) => [import.meta.resolve(val), key]),
);

class NodeDocGenerator {
  private enhancedCache: EnhancedGenerationCache;

  constructor() {
    this.enhancedCache = new EnhancedGenerationCache();
  }

  private async collectNodeFiles(): Promise<string[]> {
    console.log("Collecting Node.js type definition files...");
    const fileNames: string[] = [];
    for await (const file of expandGlob("./types/node/[!_]*")) {
      fileNames.push(`file://${file.path}`);
    }
    return fileNames;
  }

  async generateDocs(): Promise<void> {
    const allFileNames = await this.collectNodeFiles();
    console.log(`Found ${allFileNames.length} Node.js type definition files`);

    // Check if output file exists or if sources changed
    const outputExists = existsSync("./gen/node.json");
    const sourcesChanged = await this.enhancedCache.shouldRegenerate(
      "./types/node",
    );

    if (!outputExists) {
      console.log("📝 Output file node.json does not exist, generating...");
    } else if (sourcesChanged) {
      console.log("📝 Source files changed, regenerating...");
    } else {
      console.log("✅ Node.js documentation is up to date!");
      return;
    }

    console.log("Generating doc nodes for all modules...");
    const nodes = await doc(allFileNames);

    console.log(`Generated doc nodes for ${Object.keys(nodes).length} modules`);
    console.log("Generating JSON structure...");

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

    console.log("Writing node.json...");
    await Deno.writeTextFile("./gen/node.json", JSON.stringify(files));
    console.log("Node.js documentation generation completed");
  }
}

// Main execution
async function main() {
  const generator = new NodeDocGenerator();
  await generator.generateDocs();
}

if (import.meta.main) {
  await main();
}
