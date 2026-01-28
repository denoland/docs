#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env
/**
 * This script tests the LLMs file generation directly
 */

import { join } from "@std/path";
import { log } from "lume/core/utils/log.ts";

// Mock site.dest function
const site = {
  dest: (path: string) => join(Deno.cwd(), "_site", path),
};

async function testLlmsGeneration() {
  log.info("Testing LLM-friendly documentation files generation...");

  // Import and call the LLMs generation function directly
  const { default: generateModule } = await import("./generate_llms_files.ts");
  const {
    collectFiles,
    generateLlmsTxt,
    generateLlmsSummaryTxt,
    generateLlmsFullTxt,
    generateLlmsJson,
    loadOramaSummaryIndex,
  } = generateModule;

  const files = await collectFiles();
  log.info(`Collected ${files.length} documentation files for LLMs`);

  // Generate llms.txt
  const llmsTxt = generateLlmsTxt(files);
  await Deno.writeTextFile(site.dest("llms.txt"), llmsTxt);
  log.info("Generated llms.txt in site root");

  // Generate llms-summary.txt
  const llmsSummaryTxt = generateLlmsSummaryTxt(files);
  await Deno.writeTextFile(site.dest("llms-summary.txt"), llmsSummaryTxt);
  log.info("Generated llms-summary.txt in site root");

  // Generate llms-full.txt
  const llmsFullTxt = generateLlmsFullTxt(files);
  await Deno.writeTextFile(site.dest("llms-full.txt"), llmsFullTxt);
  log.info("Generated llms-full.txt in site root");

  // Generate llms.json
  const oramaSummary = await loadOramaSummaryIndex();
  if (oramaSummary) {
    const llmsJson = generateLlmsJson(oramaSummary);
    await Deno.writeTextFile(site.dest("llms.json"), llmsJson);
    log.info("Generated llms.json in site root");
  } else {
    log.warn(
      "Skipped llms.json generation (orama-index-summary.json not found)",
    );
  }

  log.info("Done!");
}

// Run the test
testLlmsGeneration();
