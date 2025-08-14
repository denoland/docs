#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env
/**
 * Orama Index Uploader
 *
 * This script uploads the generated Orama index to Orama Cloud using the official client.
 * It can either upload all documents at once or in batches to avoid rate limits.
 *
 * Prerequisites:
 * 1. Set up environment variables:
 *    - ORAMA_INDEX_ID: Your Orama Cloud index ID
 *    - ORAMA_PRIVATE_API_KEY: Your private API key (for uploads)
 *
 * Usage:
 *   # Upload from static directory
 *   deno run -A upload_orama_index.ts
 *
 *   # Upload from specific file
 *   deno run -A upload_orama_index.ts path/to/orama-index.json
 *
 *   # Upload in batches of 1000 documents
 *   deno run -A upload_orama_index.ts --batch-size=1000
 *
 *   # Deploy after upload
 *   deno run -A upload_orama_index.ts --deploy
 */

import { fromFileUrl, join } from "@std/path";
import { load } from "@std/dotenv";
import { CloudManager } from "npm:@oramacloud/client";

const ROOT_DIR = fromFileUrl(new URL("../", import.meta.url));

// Load environment variables from .env file
await load({ export: true });

interface OramaConfig {
  indexId: string;
  privateApiKey: string;
}

interface UploadOptions {
  batchSize?: number;
  skipExisting?: boolean;
  dryRun?: boolean;
  useFull?: boolean; // Prefer orama-index-full.json when true
}

/**
 * Load Orama configuration from environment variables
 */
function loadOramaConfig(): OramaConfig {
  const indexId = Deno.env.get("ORAMA_INDEX_ID");
  const privateApiKey = Deno.env.get("ORAMA_PRIVATE_API_KEY");

  if (!indexId || !privateApiKey) {
    console.error("❌ Missing required environment variables:");
    console.error("   ORAMA_INDEX_ID - Your Orama Cloud index ID");
    console.error(
      "   ORAMA_PRIVATE_API_KEY - Your private API key for uploads",
    );
    console.error("");
    console.error("Example:");
    console.error(
      '   export ORAMA_INDEX_ID="your-index-id"',
    );
    console.error('   export ORAMA_PRIVATE_API_KEY="your-private-api-key"');
    Deno.exit(1);
  }

  return { indexId, privateApiKey };
}

interface IndexData {
  metadata?: {
    generatedAt: string;
    version?: string;
    stats?: {
      averageDocumentLength: number;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
  documents: OramaDocument[];
}

interface OramaDocument {
  id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  section: string;
  [key: string]: unknown;
}

/**
 * Load the generated index file
 */
async function loadIndexFile(filePath: string): Promise<IndexData> {
  try {
    const content = await Deno.readTextFile(filePath);
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Error loading index file ${filePath}:`, error);
    Deno.exit(1);
  }
}

/**
 * Clear the existing index (optional, for full reindex)
 */
function clearIndex(config: OramaConfig): boolean {
  try {
    console.log("🗑️  Preparing index for upload...");

    const manager = new CloudManager({ api_key: config.privateApiKey });
    const _indexManager = manager.index(config.indexId);

    // The update method will automatically handle existing documents
    // No need to explicitly clear - just proceed with upload

    console.log("✅ Ready to update index (existing docs will be updated)");
    return true;
  } catch (error) {
    console.error("❌ Error preparing index:", error);
    return false;
  }
}

/**
 * Upload documents using Orama Cloud client
 */
async function uploadDocuments(
  config: OramaConfig,
  documents: OramaDocument[],
  options: UploadOptions = {},
): Promise<void> {
  const { batchSize = 1000, dryRun = false } = options;

  if (dryRun) {
    console.log(`DRY RUN: Would upload ${documents.length} documents`);
    return;
  }

  console.log(
    `Uploading ${documents.length} documents in batches of ${batchSize}...`,
  );

  try {
    const manager = new CloudManager({ api_key: config.privateApiKey });
    const indexManager = manager.index(config.indexId);

    let successful = 0;
    let failed = 0;

    // Split documents into batches
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(documents.length / batchSize);

      console.log(
        `Uploading batch ${batchNumber}/${totalBatches} (${batch.length} documents)...`,
      );

      try {
        // Use the update method to insert/update documents
        await indexManager.update(batch);
        successful += batch.length;
        console.log(`✅ Batch ${batchNumber} uploaded successfully`);
      } catch (error) {
        failed += batch.length;
        console.error(`❌ Batch ${batchNumber} failed:`, error);
      }

      // Add a small delay between batches to be nice to the API
      if (i + batchSize < documents.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(`\nUpload complete:`);
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(
      `   📈 Success rate: ${
        ((successful / documents.length) * 100).toFixed(1)
      }%`,
    );
  } catch (error) {
    console.error("❌ Error during upload:", error);
    throw error;
  }
}

/**
 * Deploy the index after upload
 */
async function deployIndex(config: OramaConfig): Promise<void> {
  try {
    console.log("Deploying index...");

    const manager = new CloudManager({ api_key: config.privateApiKey });
    const indexManager = manager.index(config.indexId);

    await indexManager.deploy();

    console.log("✅ Index deployed successfully!");
  } catch (error) {
    console.error("❌ Error deploying index:", error);
    throw error;
  }
}

/**
 * Parse command line arguments
 */
function parseArgs(
  args: string[],
): { filePath?: string; options: UploadOptions; shouldDeploy: boolean } {
  const options: UploadOptions = {};
  let filePath: string | undefined;
  let shouldDeploy = false;

  for (const arg of args) {
    if (arg.startsWith("--batch-size=")) {
      options.batchSize = parseInt(arg.split("=")[1]);
    } else if (arg === "--skip-existing") {
      options.skipExisting = true;
    } else if (arg === "--dry-run") {
      options.dryRun = true;
    } else if (arg === "--full") {
      options.useFull = true;
    } else if (arg === "--deploy") {
      shouldDeploy = true;
    } else if (arg === "--clear-index") {
      // This will be handled in main
    } else if (!arg.startsWith("--")) {
      filePath = arg;
    }
  }

  return { filePath, options, shouldDeploy };
}

/**
 * Determine the index file path to upload. If a filePath is provided, use it.
 * Otherwise try common locations in order of preference.
 */
async function resolveIndexFilePath(
  rootDir: string,
  opts: UploadOptions,
): Promise<string> {
  // If caller provided explicit file path, just return it.
  // Existence will be validated by loadIndexFile.
  // Try candidates in order. Prefer "full" variant when requested.
  const staticDir = join(rootDir, "static");
  const siteDir = join(rootDir, "_site");

  const candidatesPreferred = opts.useFull ? [
    join(staticDir, "orama-index-full.json"),
    join(siteDir, "orama-index-full.json"),
    join(staticDir, "orama-index.json"),
    join(siteDir, "orama-index.json"),
  ] : [
    join(staticDir, "orama-index.json"),
    join(siteDir, "orama-index.json"),
    join(staticDir, "orama-index-full.json"),
    join(siteDir, "orama-index-full.json"),
  ];

  for (const p of candidatesPreferred) {
    try {
      await Deno.stat(p);
      return p;
    } catch (_) {
      // continue
    }
  }

  // Default to static/orama-index.json as before; will error on load.
  return join(staticDir, "orama-index.json");
}

/**
 * Main function
 */
async function main() {
  console.log("🔍 Orama Index Uploader\n");

  const args = Deno.args;
  const { filePath, options, shouldDeploy } = parseArgs(args);
  const shouldClearIndex = args.includes("--clear-index");

  // Load configuration
  const config = loadOramaConfig();
  console.log(`Target index: ${config.indexId}`);

  // Determine input file path (auto-detect full vs minimal and _site vs static)
  const indexFilePath = filePath || await resolveIndexFilePath(ROOT_DIR, options);
  console.log(`Loading index from: ${indexFilePath}`);

  // Load the index file
  const indexData = await loadIndexFile(indexFilePath);
  const documents = indexData.documents || [];

  if (documents.length === 0) {
    console.error("❌ No documents found in index file");
    Deno.exit(1);
  }

  console.log(`Found ${documents.length} documents to upload`);

  // Print some stats
  if (indexData.metadata) {
    console.log(`Index metadata:`);
    console.log(`   Generated: ${indexData.metadata.generatedAt}`);
    console.log(`   Version: ${indexData.metadata.version || "unknown"}`);
    if (indexData.metadata.stats) {
      console.log(
        `   Avg document length: ${indexData.metadata.stats.averageDocumentLength} chars`,
      );
    }
  }

  console.log("");

  // Clear index if requested
  if (shouldClearIndex) {
    const cleared = clearIndex(config);
    if (!cleared) {
      console.error("❌ Failed to prepare index, aborting upload");
      Deno.exit(1);
    }
    console.log("");
  }

  // Upload documents
  await uploadDocuments(config, documents, options);

  // Deploy if requested
  if (shouldDeploy) {
    console.log("");
    await deployIndex(config);
  }

  console.log("\nUpload process completed!");
  if (shouldDeploy) {
    console.log("Index has been deployed and is now live!");
  } else {
    console.log("Run with --deploy flag to deploy the index");
  }
}

// Run the main function
if (import.meta.main) {
  main().catch((error) => {
    console.error("❌ Unexpected error:", error);
    Deno.exit(1);
  });
}
