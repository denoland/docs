import { doc, type DocNode, generateHtmlAsJSON } from "@deno/doc";
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

    // Process files in much smaller batches to reduce peak memory usage
    const batchSize = 8; // Reduced from 15 to 8
    const allModules: string[] = [];
    const tempDir = "./temp_node_docs";

    // Create temporary directory for intermediate results
    try {
      await Deno.mkdir(tempDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    // Process and store each batch separately
    for (let i = 0; i < allFileNames.length; i += batchSize) {
      const batch = allFileNames.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(allFileNames.length / batchSize);

      console.log(
        `Processing batch ${batchNum}/${totalBatches} (${batch.length} files)...`,
      );

      try {
        const batchNodes = await doc(batch);

        // Store batch result to disk immediately and clear from memory
        const batchFile = `${tempDir}/batch_${batchNum}.json`;
        await Deno.writeTextFile(batchFile, JSON.stringify(batchNodes));

        // Track modules for final assembly
        allModules.push(...Object.keys(batchNodes));
      } catch (error) {
        console.error(`Error processing batch ${batchNum}:`, error);
        throw error;
      }

      // Delay to allow memory to settle
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    console.log(
      `Processed ${allModules.length} modules in ${
        Math.ceil(allFileNames.length / batchSize)
      } batches`,
    );
    console.log("Assembling final documentation...");

    // Reassemble all nodes from disk with memory management
    const allNodes: Record<string, DocNode[]> = {};
    const assemblyBatchSize = 3; // Process even fewer batches at once during assembly

    for (
      let i = 0;
      i < Math.ceil(allFileNames.length / batchSize);
      i += assemblyBatchSize
    ) {
      const endBatch = Math.min(
        i + assemblyBatchSize,
        Math.ceil(allFileNames.length / batchSize),
      );

      console.log(`Assembling batches ${i + 1}-${endBatch}...`);

      for (let j = i; j < endBatch; j++) {
        const batchFile = `${tempDir}/batch_${j + 1}.json`;
        try {
          const batchData = await Deno.readTextFile(batchFile);
          const batchNodes = JSON.parse(batchData);

          // Merge into allNodes
          Object.assign(allNodes, batchNodes);

          // Clean up temporary file
          await Deno.remove(batchFile);
        } catch (error) {
          console.warn(`Could not load batch ${j + 1}:`, error);
        }
      }

      // Memory management between assembly batches
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    // Clean up temp directory
    try {
      await Deno.remove(tempDir, { recursive: true });
    } catch {
      // Ignore cleanup errors
    }

    console.log("Generating JSON structure...");

    const files = await generateHtmlAsJSON(allNodes, {
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
