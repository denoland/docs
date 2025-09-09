import type { Page } from "@deno/doc";

export const layout = "raw.tsx";

export const sidebar = [
  {
    items: [
      {
        label: "Deno APIs",
        id: "/api/deno/",
      },
      {
        label: "Web APIs",
        id: "/api/web/",
      },
      {
        label: "Node APIs",
        id: "/api/node/",
      },
    ],
  },
];

const kinds = [
  { path: "reference_gen/gen/deno.json", name: "Deno" },
  { path: "reference_gen/gen/web.json", name: "Web" },
  { path: "reference_gen/gen/node.json", name: "Node" },
] as const;

interface ChunkManifest {
  totalEntries: number;
  chunkCount: number;
  chunkSize: number;
  chunks: Array<{
    file: string;
    entries: number;
    startIndex: number;
    endIndex: number;
  }>;
  generatedAt: string;
}

// Process chunked files for better memory management
async function* processChunkedFiles(
  manifestPath: string,
  name: string
): AsyncGenerator<{ url: string; title?: string; layout?: string; data?: Page; content?: string }> {
  console.log(`📖 Loading ${name} reference docs from chunked files...`);

  let manifest: ChunkManifest;
  try {
    const manifestContent = Deno.readTextFileSync(manifestPath);
    manifest = JSON.parse(manifestContent);
    console.log(
      `✅ Found ${name} manifest: ${manifest.totalEntries} entries in ${manifest.chunkCount} chunks`
    );
  } catch (error) {
    throw new Error(`Failed to read manifest at ${manifestPath}: ${error}`);
  }

  let processedEntries = 0;
  
  for (const chunkInfo of manifest.chunks) {
    console.log(`📦 Processing chunk: ${chunkInfo.file} (${chunkInfo.entries} entries)`);
    
    let chunkData: Record<string, Page>;
    try {
      // Resolve path relative to reference_gen directory
      const chunkPath = `../reference_gen/${chunkInfo.file}`;
      const chunkContent = Deno.readTextFileSync(chunkPath);
      chunkData = JSON.parse(chunkContent);
    } catch (error) {
      console.error(`❌ Failed to read chunk ${chunkInfo.file}:`, error);
      continue;
    }

    for (const [filepath, content] of Object.entries(chunkData)) {
      if (content.kind === "search") {
        continue;
      }

      // Skip generating index pages since we have static versions
      if (
        (name === "Deno" || name === "Web" || name === "Node") &&
        filepath === "./index.json"
      ) {
        continue;
      }

      const trailingLength = filepath.endsWith("index.json")
        ? -"index.json".length
        : -".json".length;

      // Remove leading "./" if present
      let normalizedPath = filepath.slice(0, trailingLength);
      if (normalizedPath.startsWith("./")) {
        normalizedPath = normalizedPath.slice(2);
      }

      const url = `/api/${name.toLowerCase()}/${normalizedPath}`;

      if ("path" in content) {
        yield {
          url,
          content: `<meta http-equiv="refresh" content="0; url=${content.path}">`,
        };
        continue;
      }

      let layout;
      if (content.kind === "IndexCtx") {
        layout = "index";
      } else if (content.kind === "AllSymbolsCtx") {
        layout = "allSymbols";
      } else if (content.kind === "SymbolPageCtx") {
        layout = "symbol";
      } else {
        throw `unknown page kind: ${(content as { kind: string }).kind}`;
      }

      yield {
        url,
        title: content.html_head_ctx.title,
        layout: `reference/${layout}.tsx`,
        data: content,
      };

      processedEntries++;
    }

    // Clear chunk from memory
    chunkData = null as unknown as Record<string, Page>;
    
    // Log progress every few chunks
    if (manifest.chunks.indexOf(chunkInfo) % 5 === 0) {
      console.log(`📊 Processed ${processedEntries}/${manifest.totalEntries} entries...`);
    }

    // Small pause to allow garbage collection
    await new Promise(resolve => setTimeout(resolve, 1));
  }

  console.log(`✅ Completed processing ${name} reference docs (${processedEntries} entries)`);
}

// Fallback to process monolithic files (original behavior with memory optimization)
async function* processMonolithicFile(
  path: string,
  name: string
): AsyncGenerator<{ url: string; title?: string; layout?: string; data?: Page; content?: string }> {
  console.log(`📖 Loading ${name} reference docs from ${path}...`);

  let json: Record<string, Page>;
  try {
    const fileContent = Deno.readTextFileSync(path);
    json = JSON.parse(fileContent);
    console.log(
      `✅ Successfully loaded ${name} reference docs (${
        Object.keys(json).length
      } entries)`,
    );
  } catch (readError) {
    console.error(`❌ Failed to read ${path}:`, readError);
    console.error(`   Current working directory: ${Deno.cwd()}`);

    // Check if the file exists
    try {
      const stat = Deno.statSync(path);
      console.error(
        `   File exists but read failed. Size: ${stat.size} bytes`,
      );
    } catch {
      console.error(`   File does not exist at: ${path}`);

      // Check if the gen directory exists
      try {
        Deno.statSync("reference_gen/gen");
        console.error(`   Gen directory exists, contents:`);
        for (const entry of Deno.readDirSync("reference_gen/gen")) {
          console.error(
            `     - ${entry.name} (${entry.isFile ? "file" : "dir"})`,
          );
        }
      } catch {
        console.error(
          `   Gen directory does not exist at reference_gen/gen`,
        );
        console.error(
          `   Run 'deno task generate:reference' to generate the reference docs`,
        );
      }
    }
    throw readError;
  }

  const entries = Object.entries(json);
  const BATCH_SIZE = name === "Node" ? 50 : 200; // Smaller batches for Node

  // Process in smaller batches to reduce memory pressure
  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);

    for (const [filepath, content] of batch) {
      if (content.kind === "search") {
        continue;
      }

      // Skip generating index pages since we have static versions
      if (
        (name === "Deno" || name === "Web" || name === "Node") &&
        filepath === "./index.json"
      ) {
        continue;
      }

      const trailingLength = filepath.endsWith("index.json")
        ? -"index.json".length
        : -".json".length;

      // Remove leading "./" if present
      let normalizedPath = filepath.slice(0, trailingLength);
      if (normalizedPath.startsWith("./")) {
        normalizedPath = normalizedPath.slice(2);
      }

      const url = `/api/${name.toLowerCase()}/${normalizedPath}`;

      if ("path" in content) {
        yield {
          url,
          content: `<meta http-equiv="refresh" content="0; url=${content.path}">`,
        };
        continue;
      }

      let layout;
      if (content.kind === "IndexCtx") {
        layout = "index";
      } else if (content.kind === "AllSymbolsCtx") {
        layout = "allSymbols";
      } else if (content.kind === "SymbolPageCtx") {
        layout = "symbol";
      } else {
        throw `unknown page kind: ${(content as { kind: string }).kind}`;
      }

      yield {
        url,
        title: content.html_head_ctx.title,
        layout: `reference/${layout}.tsx`,
        data: content,
      };
    }

    // Log progress and allow GC
    if (i > 0 && i % (BATCH_SIZE * 10) === 0) {
      console.log(`📊 Processed ${i}/${entries.length} entries for ${name}...`);
      await new Promise(resolve => setTimeout(resolve, 1));
    }
  }

  // Clear the json object from memory
  json = null as unknown as Record<string, Page>;
  console.log(`✅ Completed processing ${name} reference docs`);
}

export default async function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      console.warn("⏭️ Reference docs generation skipped (SKIP_REFERENCE set)");
      return;
    }

    for (const { path, name } of kinds) {
      // Check if chunked version exists for Node.js docs
      if (name === "Node") {
        const manifestPath = "../reference_gen/gen/node-manifest.json";
        try {
          Deno.statSync(manifestPath);
          // Use chunked processing for better memory management
          yield* processChunkedFiles(manifestPath, name);
          continue;
        } catch {
          console.log(`📝 No chunked files found for ${name}, using monolithic file...`);
        }
      }

      // Fallback to monolithic file processing
      yield* processMonolithicFile(path, name);
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }
}
