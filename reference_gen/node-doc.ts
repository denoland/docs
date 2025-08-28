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

const INCREMENTAL_CACHE_FILE = ".node-incremental-cache.json";
const MAX_MODULES_PER_BATCH = 10; // Process in smaller batches to manage memory

interface IncrementalCache {
  modules: Record<string, {
    hash: string;
    lastGenerated: number;
    outputSize: number;
  }>;
  lastFullRegen: number;
}

type GeneratedFiles = Record<string, unknown>;

class IncrementalNodeDocGenerator {
  private cache: IncrementalCache = { modules: {}, lastFullRegen: 0 };
  private cacheFile: string;
  private enhancedCache: EnhancedGenerationCache;

  constructor() {
    this.cacheFile = INCREMENTAL_CACHE_FILE;
    this.enhancedCache = new EnhancedGenerationCache();
    this.loadIncrementalCache();
  }

  private loadIncrementalCache() {
    try {
      if (existsSync(this.cacheFile)) {
        const data = Deno.readTextFileSync(this.cacheFile);
        this.cache = JSON.parse(data);
      } else {
        this.cache = { modules: {}, lastFullRegen: 0 };
      }
    } catch {
      this.cache = { modules: {}, lastFullRegen: 0 };
    }
  }

  private saveIncrementalCache() {
    try {
      Deno.writeTextFileSync(
        this.cacheFile,
        JSON.stringify(this.cache, null, 2),
      );
    } catch (error) {
      console.warn("Failed to save incremental cache:", error);
    }
  }

  private async collectNodeFiles(): Promise<string[]> {
    console.log("Collecting Node.js type definition files...");
    const fileNames: string[] = [];
    for await (const file of expandGlob("./types/node/[!_]*")) {
      fileNames.push(`file://${file.path}`);
    }
    return fileNames;
  }

  private async getModulesNeedingRegeneration(
    fileNames: string[],
  ): Promise<string[]> {
    const modulesNeedingRegen: string[] = [];

    for (const fileName of fileNames) {
      const needsRegen = await this.enhancedCache.shouldRegenerateModule(
        fileName,
      );
      if (needsRegen) {
        modulesNeedingRegen.push(fileName);
      }
    }

    return modulesNeedingRegen;
  }

  private async processModuleBatch(
    fileNames: string[],
    startIdx: number,
    batchSize: number,
  ): Promise<GeneratedFiles> {
    const batch = fileNames.slice(startIdx, startIdx + batchSize);

    console.log(
      `Processing batch ${
        Math.floor(startIdx / batchSize) + 1
      }: ${batch.length} modules`,
    );

    // Process this batch
    const nodes = await doc(batch);

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

    return files;
  }

  async generateIncrementally(): Promise<void> {
    const allFileNames = await this.collectNodeFiles();
    console.log(`Found ${allFileNames.length} Node.js type definition files`);

    // Check if output file exists
    const outputExists = existsSync("./gen/node.json");
    if (!outputExists) {
      console.log(
        "📝 Output file node.json does not exist, forcing full regeneration",
      );
      await this.generateFull(allFileNames);
      this.cache.lastFullRegen = Date.now();
      this.saveIncrementalCache();
      return;
    }

    const modulesNeedingRegen = await this.getModulesNeedingRegeneration(
      allFileNames,
    );

    if (modulesNeedingRegen.length === 0) {
      console.log("✅ All Node.js modules are up to date!");
      return;
    }

    console.log(
      `📝 ${modulesNeedingRegen.length} of ${allFileNames.length} modules need regeneration`,
    );

    // Load existing output if it exists
    let existingOutput: GeneratedFiles = {};
    if (existsSync("./gen/node.json")) {
      try {
        const existingContent = await Deno.readTextFile("./gen/node.json");
        existingOutput = JSON.parse(existingContent);
        console.log("📄 Loaded existing node.json for incremental update");
      } catch (error) {
        console.warn(
          "Could not load existing node.json, generating from scratch:",
          error,
        );
      }
    }

    // Check if we need a full regeneration (> 50% of modules changed)
    const needsFullRegen =
      modulesNeedingRegen.length > (allFileNames.length * 0.5);

    if (needsFullRegen) {
      console.log(
        "🔄 Large number of changes detected, performing full regeneration...",
      );
      await this.generateFull(allFileNames);
    } else {
      console.log("⚡ Performing incremental regeneration...");
      await this.generateIncremental(modulesNeedingRegen, existingOutput);
    }

    this.cache.lastFullRegen = needsFullRegen
      ? Date.now()
      : this.cache.lastFullRegen;
    this.saveIncrementalCache();
  }

  private async generateFull(fileNames: string[]): Promise<void> {
    console.log("Generating doc nodes for all modules...");

    // Process in batches to manage memory
    let allFiles: GeneratedFiles = {};

    for (let i = 0; i < fileNames.length; i += MAX_MODULES_PER_BATCH) {
      const batchFiles = await this.processModuleBatch(
        fileNames,
        i,
        MAX_MODULES_PER_BATCH,
      );
      allFiles = { ...allFiles, ...batchFiles };

      // Force garbage collection between batches if available
      try {
        // deno-lint-ignore no-explicit-any
        if ((globalThis as any).gc) {
          // deno-lint-ignore no-explicit-any
          (globalThis as any).gc();
        }
      } catch {
        // Ignore if gc is not available
      }
    }

    console.log("Writing complete node.json...");
    await Deno.writeTextFile("./gen/node.json", JSON.stringify(allFiles));
    console.log("Node.js documentation generation completed");
  }

  private async generateIncremental(
    modulesNeedingRegen: string[],
    existingOutput: GeneratedFiles,
  ): Promise<void> {
    let updatedOutput = { ...existingOutput };

    // Process changed modules in batches
    for (
      let i = 0;
      i < modulesNeedingRegen.length;
      i += MAX_MODULES_PER_BATCH
    ) {
      const batchFiles = await this.processModuleBatch(
        modulesNeedingRegen,
        i,
        MAX_MODULES_PER_BATCH,
      );

      // Merge with existing output
      updatedOutput = { ...updatedOutput, ...batchFiles };

      console.log(
        `✅ Updated batch ${Math.floor(i / MAX_MODULES_PER_BATCH) + 1}`,
      );

      // Force garbage collection between batches if available
      try {
        // deno-lint-ignore no-explicit-any
        if ((globalThis as any).gc) {
          // deno-lint-ignore no-explicit-any
          (globalThis as any).gc();
        }
      } catch {
        // Ignore if gc is not available
      }
    }

    console.log("Writing incrementally updated node.json...");
    await Deno.writeTextFile("./gen/node.json", JSON.stringify(updatedOutput));
    console.log("Incremental Node.js documentation update completed");
  }
}

// Main execution
async function main() {
  const generator = new IncrementalNodeDocGenerator();
  await generator.generateIncrementally();
}

if (import.meta.main) {
  await main();
}
