#!/usr/bin/env -S deno run --allow-read --allow-env
/**
 * Example: How to set up and use the Orama indexing system
 *
 * This script demonstrates the complete workflow for indexing
 * Deno documentation with Orama.
 */

console.log("🔍 Orama Indexing Example for Deno Documentation\n");

console.log("Step 1: Generate the search index");
console.log(
  "This extracts content from all markdown files and creates orama-index.json",
);
console.log("Command: deno task generate:orama\n");

console.log("Step 2: Set up environment variables for Orama Cloud");
console.log("You need these from your Orama Cloud dashboard:");
console.log(
  'export ORAMA_ENDPOINT="https://cloud.orama.run/v1/indexes/your-index-id"',
);
console.log('export ORAMA_PRIVATE_API_KEY="your-private-api-key"\n');

console.log("Step 3: Upload to Orama Cloud");
console.log("Command: deno task upload:orama\n");

console.log("Alternative workflow with options:");
console.log("# Generate and upload in one go");
console.log("deno task generate:orama && deno task upload:orama");
console.log("");
console.log("# Upload with custom batch size and clear existing index");
console.log("deno run -A upload_orama_index.ts --batch-size=10 --clear-index");
console.log("");
console.log("# Test upload without actually sending data");
console.log("deno run -A upload_orama_index.ts --dry-run\n");

console.log("Benefits of this approach:");
console.log("✅ Bypasses web crawler rate limits");
console.log("✅ Only indexes main content (no navigation/sidebars)");
console.log("✅ Provides clean, processed markdown content");
console.log("✅ Supports batch uploads with error handling");
console.log("✅ Can be integrated into CI/CD pipeline");
console.log("✅ Generates both full and minimal indexes\n");

// Check if index file exists
try {
  const stat = await Deno.stat("static/orama-index.json");
  console.log(`📁 Found generated index: ${stat.size} bytes`);

  const content = await Deno.readTextFile("static/orama-index.json");
  const data = JSON.parse(content);
  console.log(`📊 Contains ${data.documents?.length || 0} documents`);

  if (data.metadata?.stats) {
    console.log(
      `📈 Average document length: ${data.metadata.stats.averageDocumentLength} chars`,
    );
  }
} catch {
  console.log("📁 No index file found - run 'deno task generate:orama' first");
}

console.log("\n🚀 Ready to index your documentation!");
