import { doc, generateHtmlAsJSON } from "@deno/doc";
import { expandGlob } from "@std/fs";
import { hrefResolver, renderMarkdown, stripMarkdown } from "./common.ts";
import { EnhancedGenerationCache } from "./cache.ts";
import symbolRedirectMap from "./node-symbol-map.json" with { type: "json" };
import defaultSymbolMap from "./node-default-map.json" with { type: "json" };
import rewriteMap from "./node-rewrite-map.json" with { type: "json" };
import { existsSync } from "@std/fs";
import { ensureDir } from "@std/fs";

const newRewriteMap = Object.fromEntries(
  Object.entries(rewriteMap).map((
    [key, val],
  ) => [import.meta.resolve(val), key]),
);

class NodeDocGenerator {
  private enhancedCache: EnhancedGenerationCache;
  private readonly CHUNK_SIZE = 1000; // Entries per chunk

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

  private async writeChunkedFiles(
    files: Record<string, unknown>,
  ): Promise<void> {
    const entries = Object.entries(files);
    const totalEntries = entries.length;

    console.log(
      `📊 Splitting ${totalEntries} entries into chunks of ${this.CHUNK_SIZE}...`,
    );

    // Ensure the chunks directory exists
    await ensureDir("./gen/node");

    // Write the chunks
    const chunkCount = Math.ceil(totalEntries / this.CHUNK_SIZE);
    const chunkManifest: {
      file: string;
      entries: number;
      startIndex: number;
      endIndex: number;
    }[] = [];

    for (let i = 0; i < totalEntries; i += this.CHUNK_SIZE) {
      const chunkIndex = Math.floor(i / this.CHUNK_SIZE);
      const chunk = entries.slice(i, i + this.CHUNK_SIZE);
      const chunkData = Object.fromEntries(chunk);

      const chunkFile = `./gen/node/chunk-${
        chunkIndex.toString().padStart(3, "0")
      }.json`;
      await Deno.writeTextFile(chunkFile, JSON.stringify(chunkData));

      chunkManifest.push({
        file: chunkFile,
        entries: chunk.length,
        startIndex: i,
        endIndex: Math.min(i + this.CHUNK_SIZE - 1, totalEntries - 1),
      });

      console.log(
        `📦 Wrote chunk ${
          chunkIndex + 1
        }/${chunkCount}: ${chunk.length} entries`,
      );
    }

    // Write the manifest file
    await Deno.writeTextFile(
      "./gen/node-manifest.json",
      JSON.stringify(
        {
          totalEntries,
          chunkCount,
          chunkSize: this.CHUNK_SIZE,
          chunks: chunkManifest,
          generatedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    console.log(`✅ Created ${chunkCount} chunks with manifest file`);

    // Also write the original monolithic file for backward compatibility
    // but log a warning about its size
    const jsonString = JSON.stringify(files);
    const sizeInMB = (jsonString.length / (1024 * 1024)).toFixed(1);
    console.log(
      `⚠️  Writing large monolithic node.json file (${sizeInMB}MB)...`,
    );
    await Deno.writeTextFile("./gen/node.json", jsonString);
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

    console.log("Writing chunked node documentation files...");
    await this.writeChunkedFiles(files);
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
