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

    console.log(
      "Generating documentation one file at a time (ultra low memory mode)...",
    );

    // Process files individually to minimize memory usage
    const processedModules: string[] = [];
    const tempDir = "./temp_node_minimal";

    // Create temporary directory for results
    try {
      await Deno.mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.warn(`Warning creating temp directory:`, error);
    }

    // Process each file individually
    for (let i = 0; i < allFileNames.length; i++) {
      const fileName = allFileNames[i];
      console.log(
        `Processing file ${i + 1}/${allFileNames.length}: ${
          fileName.split("/").pop()
        }`,
      );

      try {
        // Process single file
        const nodes = await doc([fileName]);

        // Generate JSON for this single file
        const singleFileJson = await generateHtmlAsJSON(nodes, {
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

        // Save individual result to disk
        const resultFile = `${tempDir}/file_${i}.json`;
        await Deno.writeTextFile(resultFile, JSON.stringify(singleFileJson));

        processedModules.push(...Object.keys(nodes));
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
        throw error;
      }

      // Small delay between files
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    console.log(`Processed ${processedModules.length} modules individually`);
    console.log("Combining results into final JSON...");

    // Combine all individual results into final structure
    const finalResult: Record<string, unknown> = {};

    for (let i = 0; i < allFileNames.length; i++) {
      const resultFile = `${tempDir}/file_${i}.json`;
      try {
        const fileData = await Deno.readTextFile(resultFile);
        const fileResult = JSON.parse(fileData);

        // Merge into final result
        Object.assign(finalResult, fileResult);

        // Clean up individual file immediately
        await Deno.remove(resultFile);
      } catch (error) {
        console.warn(`Could not load result ${i}:`, error);
      }

      // Progress indicator for large datasets
      if ((i + 1) % 10 === 0) {
        console.log(`Combined ${i + 1}/${allFileNames.length} results...`);
      }
    }

    // Clean up temp directory
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }

    console.log("Writing final node.json...");
    await Deno.writeTextFile("./gen/node.json", JSON.stringify(finalResult));
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
