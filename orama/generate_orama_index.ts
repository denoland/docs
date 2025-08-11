#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Orama Index Generator for Deno Documentation
 *
 * This script generates a JSON file containing all documentation content
 * structured for Orama search indexing. It extracts content directly from
 * markdown files, avoiding web crawler rate limits and providing precise
 * control over what gets indexed.
 *
 * Usage:
 *   deno task generate:orama          # Generate to static/orama-index.json
 *   deno run -A generate_orama_index.ts _site  # Generate to _site/orama-index.json
 */

import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";

const BASE_URL = "https://docs.deno.com";
const ROOT_DIR = fromFileUrl(new URL("../", import.meta.url));

// Directories to include in the documentation
const INCLUDE_DIRS = [
  "runtime",
  "deploy",
  "examples",
  "subhosting",
  "lint",
];

// Files to exclude (relative paths)
const EXCLUDE_FILES = [
  "README.md",
  "deno.json",
  "deno.lock",
  "lume.ts",
  "server.ts",
];

// Extensions to include
const INCLUDE_EXTS = [".md", ".mdx"];

// Regex patterns for content extraction
const H1_REGEX = /^# (.+)$/m;
const _H2_REGEX = /^## (.+)$/gm;
const _H3_REGEX = /^### (.+)$/gm;
const FRONTMATTER_TITLE_REGEX = /title: ["'](.+)["']/;
const DESCRIPTION_REGEX = /description: ["'](.+)["']/;
const TAGS_REGEX = /tags: \[(.*?)\]/;

interface OramaDocument {
  id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  section: string;
  subsection?: string;
  description?: string;
  tags: string[];
  headings: string[];
  lastModified: number;
}

interface FileInfo {
  path: string;
  relativePath: string;
  url: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  section: string;
  subsection: string | null;
  tags: string[];
  headings: string[];
  lastModified: number;
}

/**
 * Clean markdown content by removing certain elements that aren't useful for search
 */
function cleanMarkdownContent(content: string): string {
  return content
    // Remove frontmatter
    .replace(/^---\n[\s\S]*?\n---\n/, "")
    // Remove code blocks (keep inline code)
    .replace(/```[\s\S]*?```/g, "")
    // Remove HTML comments
    .replace(/<!--[\s\S]*?-->/g, "")
    // Remove JSX/MDX components (basic cleanup)
    .replace(/<[^>]*>/g, "")
    // Remove image references
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Clean up multiple newlines
    .replace(/\n{3,}/g, "\n\n")
    // Remove excessive whitespace
    .replace(/[ \t]+/g, " ")
    .trim();
}

/**
 * Extract headings from markdown content
 */
function extractHeadings(content: string): string[] {
  const headings: string[] = [];

  // Extract H1s
  const h1Matches = content.matchAll(/^# (.+)$/gm);
  for (const match of h1Matches) {
    headings.push(match[1].trim());
  }

  // Extract H2s
  const h2Matches = content.matchAll(/^## (.+)$/gm);
  for (const match of h2Matches) {
    headings.push(match[1].trim());
  }

  // Extract H3s
  const h3Matches = content.matchAll(/^### (.+)$/gm);
  for (const match of h3Matches) {
    headings.push(match[1].trim());
  }

  return headings;
}

/**
 * Extract tags from frontmatter
 */
function extractTags(frontmatter: string): string[] {
  const match = frontmatter.match(TAGS_REGEX);
  if (match) {
    return match[1]
      .split(",")
      .map((tag) => tag.trim().replace(/["']/g, ""))
      .filter((tag) => tag.length > 0);
  }
  return [];
}

/**
 * Determine category and section from file path
 */
function getCategoryAndSection(
  relativePath: string,
): { category: string; section: string; subsection: string | null } {
  const parts = relativePath.split("/");
  const category = parts[0] || "general";
  const section = parts[1] || "general";
  const subsection = parts.length > 2 ? parts[2] : null;

  return { category, section, subsection };
}

/**
 * Generate a unique ID for the document
 */
function generateId(relativePath: string): string {
  return relativePath
    .replace(/\.(md|mdx)$/, "")
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}

/**
 * Build URL from relative path
 */
function buildUrl(relativePath: string): string {
  let url = relativePath.replace(/\.(md|mdx)$/, "");
  if (url.endsWith("/index")) {
    url = url.replace(/\/index$/, "/");
  }
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return `${BASE_URL}${url}`;
}

/**
 * Collect and process all documentation files
 */
async function collectFiles(): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  console.log("Scanning directories:", INCLUDE_DIRS.join(", "));

  for (const dir of INCLUDE_DIRS) {
    const dirPath = join(ROOT_DIR, dir);

    try {
      for await (
        const entry of walk(dirPath, {
          includeDirs: false,
          includeFiles: true,
          exts: INCLUDE_EXTS,
        })
      ) {
        const relativePath = relative(ROOT_DIR, entry.path);

        // Skip excluded files
        if (EXCLUDE_FILES.some((exclude) => relativePath.includes(exclude))) {
          continue;
        }

        // Skip files in _* directories (components, etc.)
        if (relativePath.includes("/_")) {
          continue;
        }

        try {
          const content = await Deno.readTextFile(entry.path);
          const stat = await Deno.stat(entry.path);

          // Split frontmatter from content
          let markdownContent = content;
          const frontmatterMatch = content.match(
            /^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
          );

          let frontmatter = "";
          if (frontmatterMatch) {
            frontmatter = frontmatterMatch[1];
            markdownContent = frontmatterMatch[2];
          }

          // Extract title from frontmatter or first h1
          let title = "";
          const titleMatch = frontmatter.match(FRONTMATTER_TITLE_REGEX);
          if (titleMatch) {
            title = titleMatch[1];
          } else {
            const h1Match = markdownContent.match(H1_REGEX);
            if (h1Match) {
              title = h1Match[1];
            } else {
              // Generate title from file path as fallback
              const pathParts = relativePath.replace(/\.(md|mdx)$/, "").split(
                "/",
              );
              title = pathParts[pathParts.length - 1]
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());
            }
          }

          // Extract description
          let description = null;
          const descMatch = frontmatter.match(DESCRIPTION_REGEX);
          if (descMatch) {
            description = descMatch[1];
          }

          // Extract tags
          const tags = extractTags(frontmatter);

          // Extract headings
          const headings = extractHeadings(markdownContent);

          // Clean content for indexing
          const cleanedContent = cleanMarkdownContent(markdownContent);

          // Skip files with very little content
          if (cleanedContent.length < 50) {
            console.log(`Skipping ${relativePath} - content too short`);
            continue;
          }

          // Get category and section
          const { category, section, subsection } = getCategoryAndSection(
            relativePath,
          );

          // Build URL
          const url = buildUrl(relativePath);

          files.push({
            path: entry.path,
            relativePath,
            url,
            title,
            description,
            content: cleanedContent,
            category,
            section,
            subsection,
            tags,
            headings,
            lastModified: stat.mtime?.getTime() || Date.now(),
          });

          console.log(
            `Processed: ${relativePath} (${cleanedContent.length} chars)`,
          );
        } catch (error) {
          console.error(`Error processing ${entry.path}:`, error);
        }
      }
    } catch (error) {
      console.error(`Error walking directory ${dirPath}:`, error);
    }
  }

  return files;
}

/**
 * Convert FileInfo to OramaDocument
 */
function convertToOramaDocument(file: FileInfo): OramaDocument {
  return {
    id: generateId(file.relativePath),
    title: file.title,
    content: file.content,
    url: file.url,
    category: file.category,
    section: file.section,
    subsection: file.subsection || undefined,
    description: file.description || undefined,
    tags: file.tags,
    headings: file.headings,
    lastModified: file.lastModified,
  };
}

interface IndexStats {
  totalDocuments: number;
  totalCharacters: number;
  averageDocumentLength: number;
  categoryCounts: Record<string, number>;
  sectionCounts: Record<string, number>;
  documentsWithTags: number;
  documentsWithDescriptions: number;
  longestDocument: string;
  shortestDocument: string;
}

/**
 * Generate statistics about the indexed content
 */
function generateStats(documents: OramaDocument[]): IndexStats {
  const stats: IndexStats = {
    totalDocuments: documents.length,
    totalCharacters: documents.reduce(
      (sum, doc) => sum + doc.content.length,
      0,
    ),
    averageDocumentLength: 0,
    categoryCounts: {} as Record<string, number>,
    sectionCounts: {} as Record<string, number>,
    documentsWithTags: documents.filter((doc) => doc.tags.length > 0).length,
    documentsWithDescriptions:
      documents.filter((doc) => doc.description).length,
    longestDocument: "",
    shortestDocument: "",
  };

  stats.averageDocumentLength = Math.round(
    stats.totalCharacters / stats.totalDocuments,
  );

  // Count by category
  documents.forEach((doc) => {
    stats.categoryCounts[doc.category] =
      (stats.categoryCounts[doc.category] || 0) + 1;
    const sectionKey = `${doc.category}/${doc.section}`;
    stats.sectionCounts[sectionKey] = (stats.sectionCounts[sectionKey] || 0) +
      1;
  });

  // Find longest and shortest documents
  let longest = documents[0];
  let shortest = documents[0];
  documents.forEach((doc) => {
    if (doc.content.length > longest.content.length) longest = doc;
    if (doc.content.length < shortest.content.length) shortest = doc;
  });
  stats.longestDocument = `${longest.title} (${longest.content.length} chars)`;
  stats.shortestDocument =
    `${shortest.title} (${shortest.content.length} chars)`;

  return stats;
}

/**
 * Main function to generate the Orama index
 */
async function main(outputDir?: string) {
  console.log("🔍 Generating Orama search index for Deno documentation...\n");

  const files = await collectFiles();
  console.log(`\nCollected ${files.length} documentation files`);

  if (files.length === 0) {
    console.error("No files found to index");
    Deno.exit(1);
  }

  // Convert to Orama documents
  const documents = files.map(convertToOramaDocument);

  // Generate statistics
  const stats = generateStats(documents);
  console.log("\nIndex Statistics:");
  console.log(`   Total documents: ${stats.totalDocuments}`);
  console.log(`   Total characters: ${stats.totalCharacters.toLocaleString()}`);
  console.log(
    `   Average document length: ${stats.averageDocumentLength} chars`,
  );
  console.log(`   Documents with tags: ${stats.documentsWithTags}`);
  console.log(
    `   Documents with descriptions: ${stats.documentsWithDescriptions}`,
  );

  // Use the specified output directory or default to the static directory
  const outDir = outputDir
    ? join(ROOT_DIR, outputDir)
    : join(ROOT_DIR, "static");

  try {
    await Deno.stat(outDir);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`❌ The output directory ${outDir} does not exist`);
      Deno.exit(1);
    }
    throw error;
  }

  // Prepare the final index data
  const indexData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0.0",
      baseUrl: BASE_URL,
      totalDocuments: documents.length,
      stats,
    },
    documents,
  };

  // Write the index file
  const outputPath = join(outDir, "orama-index.json");
  await Deno.writeTextFile(outputPath, JSON.stringify(indexData, null, 2));

  console.log(`\nGenerated Orama index: ${outputPath}`);
  console.log(`File size: ${(await Deno.stat(outputPath)).size} bytes`);

  // Also generate a minimal version (without full content for quick previews)
  const minimalDocuments = documents.map((doc) => ({
    id: doc.id,
    title: doc.title,
    url: doc.url,
    category: doc.category,
    section: doc.section,
    description: doc.description,
    tags: doc.tags,
    headings: doc.headings.slice(0, 3), // Only first 3 headings
    contentPreview: doc.content.substring(0, 200) + "...", // First 200 chars
  }));

  const minimalIndexData = {
    metadata: indexData.metadata,
    documents: minimalDocuments,
  };

  const minimalOutputPath = join(outDir, "orama-index-minimal.json");
  await Deno.writeTextFile(
    minimalOutputPath,
    JSON.stringify(minimalIndexData, null, 2),
  );

  console.log(`✅ Generated minimal index: ${minimalOutputPath}`);
  console.log(
    `📁 File size: ${(await Deno.stat(minimalOutputPath)).size} bytes`,
  );

  console.log("\nNext steps:");
  console.log("1. Upload the orama-index.json file to your Orama Cloud index");
  console.log("2. Or use the Orama REST API to bulk insert the documents");
  console.log(
    "3. Configure your search client with the proper endpoint and API key",
  );

  console.log("\nDone!");
}

// Run the main function
if (import.meta.main) {
  const args = Deno.args;
  const outputDir = args.length > 0 ? args[0] : undefined;
  main(outputDir);
}

// Export functions for use in other scripts
export { collectFiles, convertToOramaDocument, generateStats };
