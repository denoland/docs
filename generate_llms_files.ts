#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * This script generates llms.txt and llms-full.txt files for the Deno documentation,
 * following the llmstxt.org standard to create LLM-friendly documentation.
 *
 * By default, files are generated in the same directory as the generation script. When running
 * during the build process, files are generated in the _site directory so they can be served
 * at the site's root.
 */

import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";
import { parse as parseYaml } from "@std/yaml";

const BASE_URL = "https://docs.deno.com";
// Convert file URL to a proper filesystem path (fixes Windows leading slash issue)
const ROOT_DIR = fromFileUrl(new URL(".", import.meta.url));

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
const SUMMARY_LIMIT_PER_SECTION = 25;

// Regex patterns for extracting headers and content
const H1_REGEX = /^# (.+)$/m;
const H2_REGEX = /^## (.+)$/gm;

interface FileInfo {
  path: string;
  relativePath: string;
  url: string;
  title: string;
  description: string | null;
  summary: string | null;
  content: string;
  h2Sections: string[];
}

interface OramaSummaryMetadata {
  generatedAt: string;
  version: string;
  baseUrl: string;
  totalDocuments: number;
  includesApiReference: boolean;
  stats: Record<string, unknown>;
}

interface OramaSummaryEntry {
  id: string;
  title: string;
  url: string;
  path: string;
  category: string;
  section: string;
  subsection: string;
  description?: string;
  tags?: string[];
  docType?: string;
}

interface OramaSummaryIndex {
  metadata: OramaSummaryMetadata;
  data: OramaSummaryEntry[];
}

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function getString(
  obj: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

function normalizeTitle(title: string): string {
  return title.replace(/^title:\s*/i, "").trim();
}

function extractSummary(markdownContent: string): string | null {
  const withoutCode = markdownContent.replace(/```[\s\S]*?```/g, "");
  const withoutHtml = withoutCode.replace(/<[^>]+>/g, "");
  const blocks = withoutHtml
    .split(/\n\n+/)
    .map((block) => block.replace(/^#+\s+/gm, "").trim())
    .filter((block) => block.length > 0);

  return blocks.length > 0 ? blocks[0] : null;
}

function resolveUrl(
  relativePath: string,
  frontmatter: Record<string, unknown>,
) {
  const frontmatterUrl = getString(frontmatter, ["url", "href"]);
  if (frontmatterUrl) {
    if (
      frontmatterUrl.startsWith("http://") ||
      frontmatterUrl.startsWith("https://")
    ) {
      return frontmatterUrl;
    }
    if (frontmatterUrl.startsWith("/")) {
      return `${BASE_URL}${frontmatterUrl}`;
    }
    return `${BASE_URL}/${frontmatterUrl}`;
  }

  let url = relativePath.replace(/\.(md|mdx)$/, "");
  if (url.endsWith("/index")) {
    url = url.replace(/\/index$/, "/");
  }
  return `${BASE_URL}/${url}`;
}

async function collectFiles(): Promise<FileInfo[]> {
  const files: FileInfo[] = [];

  // Process each directory
  for (const dir of INCLUDE_DIRS) {
    const dirPath = join(ROOT_DIR, dir);

    for await (
      const entry of walk(dirPath, {
        includeDirs: false,
        includeFiles: true,
        exts: INCLUDE_EXTS,
      })
    ) {
      const relativePathFs = relative(ROOT_DIR, entry.path);
      // Normalize to POSIX separators for consistent downstream logic and URL building
      const relativePath = relativePathFs.replaceAll("\\", "/");

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

        // Split frontmatter from content
        let markdownContent = content;
        const frontmatterMatch = content.match(
          /^---\n([\s\S]*?)\n---\n([\s\S]*)$/,
        );

        let frontmatter = {} as Record<string, unknown>;
        if (frontmatterMatch) {
          try {
            frontmatter = asRecord(parseYaml(frontmatterMatch[1]));
          } catch (_error) {
            frontmatter = {};
          }
          markdownContent = frontmatterMatch[2];
        }

        // Extract title from frontmatter or first h1
        let title = "";
        const frontmatterTitle = getString(frontmatter, [
          "title",
          "sidebar_title",
          "sidebarTitle",
          "heading",
        ]);
        if (frontmatterTitle) {
          title = normalizeTitle(frontmatterTitle);
        } else {
          const h1Match = markdownContent.match(H1_REGEX);
          if (h1Match) {
            title = h1Match[1];
          } else {
            title = relativePath; // Fallback to file path
          }
        }

        // Extract description
        const description = getString(frontmatter, [
          "description",
          "summary",
          "excerpt",
        ]);

        const summary = extractSummary(markdownContent);

        // Extract h2 sections
        const h2Sections: string[] = [];
        let match;
        while ((match = H2_REGEX.exec(markdownContent)) !== null) {
          h2Sections.push(match[1]);
        }

        const url = resolveUrl(relativePath, frontmatter);

        files.push({
          path: entry.path,
          relativePath,
          url,
          title,
          description,
          summary,
          content: markdownContent,
          h2Sections,
        });
      } catch (error) {
        console.error(`Error processing ${entry.path}:`, error);
      }
    }
  }

  return files;
}

function generateLlmsTxt(files: FileInfo[]): string {
  // Extract information about the main sections
  const sections = INCLUDE_DIRS.map((dir) => {
    const sectionFiles = files.filter((file) =>
      file.relativePath.startsWith(dir)
    );
    const sectionName = dir.charAt(0).toUpperCase() + dir.slice(1);

    return {
      name: sectionName,
      files: sectionFiles,
      description: getSectionDescription(dir),
    };
  });

  // Build the llms.txt content
  let content = "# Deno Documentation\n\n";
  content +=
    "> Deno is an open source JavaScript, TypeScript, and WebAssembly runtime with secure defaults and a great developer experience. It's built on V8, Rust, and Tokio.\n\n";
  content +=
    "Deno is a modern, secure-by-default runtime for JavaScript, TypeScript, and WebAssembly. This documentation covers the Deno runtime, Deno Deploy cloud service, and related tools and services.\n\n";

  // Add sections
  for (const section of sections) {
    content += `## ${section.name} Documentation\n\n`;
    if (section.description) {
      content += `${section.description}\n\n`;
    }

    // Get section index page
    const indexPage = section.files.find((file) =>
      file.relativePath === `${section.name.toLowerCase()}/index.md` ||
      file.relativePath === `${section.name.toLowerCase()}/index.mdx`
    );

    if (indexPage) {
      content += `- [${indexPage.title}](${indexPage.url})`;
      if (indexPage.description ?? indexPage.summary) {
        content += `: ${indexPage.description ?? indexPage.summary}`;
      }
      content += "\n";
    }

    // Group files by directories (if needed)
    const filesByDirectory = new Map<string, FileInfo[]>();
    for (const file of section.files) {
      // Skip the index page as it's already included
      if (file === indexPage) continue;

      const parts = file.relativePath.split("/");
      if (parts.length > 2) {
        // This is a subdirectory
        const subdir = parts.slice(0, 2).join("/");
        if (!filesByDirectory.has(subdir)) {
          filesByDirectory.set(subdir, []);
        }
        filesByDirectory.get(subdir)?.push(file);
      } else {
        // This is a direct child of the section
        if (!filesByDirectory.has(section.name.toLowerCase())) {
          filesByDirectory.set(section.name.toLowerCase(), []);
        }
        filesByDirectory.get(section.name.toLowerCase())?.push(file);
      }
    }

    // Add links to important files
    for (const [_, dirFiles] of filesByDirectory) {
      // Sort files to ensure consistent output
      dirFiles.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

      for (const file of dirFiles) {
        // Skip files with no title
        if (!file.title) continue;

        // Format for llms.txt - use the pattern: [Title](url): Description
        const descriptionOrSummary = file.description ?? file.summary;
        content += `- [${file.title}](${file.url})`;
        if (descriptionOrSummary) {
          content += `: ${descriptionOrSummary}`;
        }
        content += "\n";
      }
    }

    content += "\n";
  }

  // Add Optional section with additional resources
  content += "## Optional\n\n";
  content +=
    `- [AI Entrypoint](${BASE_URL}/ai/): Overview and key links for LLMs and AI agents\n`;
  content +=
    `- [LLM Index (JSON)](${BASE_URL}/llms.json): Structured index built from the Orama summary\n`;
  content +=
    `- [Contribution Guidelines](${BASE_URL}/runtime/contributing): How to contribute to Deno\n`;
  content +=
    `- [Style Guide](${BASE_URL}/runtime/contributing/style_guide): Coding style guidelines for Deno\n`;
  content +=
    `- [Release Schedule](${BASE_URL}/runtime/contributing/release_schedule): Deno's release cadence and versioning\n`;
  content +=
    "- [Deno LLM Skills](https://github.com/denoland/skills): Skills and playbooks for LLMs and AI agents working with Deno\n";

  return content;
}

function scoreSummaryCandidate(file: FileInfo): number {
  let score = 0;
  const depth = file.relativePath.split("/").length;

  if (
    file.relativePath.endsWith("/index.md") ||
    file.relativePath.endsWith("/index.mdx")
  ) {
    score += 10;
  }

  if (file.description || file.summary) {
    score += 5;
  }

  if (file.relativePath.includes("/getting_started/")) {
    score += 4;
  }

  if (file.relativePath.includes("/fundamentals/")) {
    score += 3;
  }

  if (file.relativePath.includes("/manual/")) {
    score += 2;
  }

  if (file.relativePath.includes("/tutorials/")) {
    score += 2;
  }

  if (file.relativePath.includes("/reference/")) {
    score -= 2;
  }

  score += Math.max(0, 6 - depth);

  return score;
}

function generateLlmsSummaryTxt(files: FileInfo[]): string {
  const sections = INCLUDE_DIRS.map((dir) => {
    const sectionFiles = files.filter((file) =>
      file.relativePath.startsWith(dir)
    );
    const sectionName = dir.charAt(0).toUpperCase() + dir.slice(1);

    return {
      name: sectionName,
      files: sectionFiles,
      description: getSectionDescription(dir),
      dir,
    };
  });

  let content = "# Deno Documentation - Summary\n\n";
  content +=
    "> A compact, LLM-friendly overview of the Deno docs. For a full index, use llms.txt. For full content, use llms-full.txt.\n\n";

  for (const section of sections) {
    content += `## ${section.name} Documentation\n\n`;
    if (section.description) {
      content += `${section.description}\n\n`;
    }

    const indexPage = section.files.find((file) =>
      file.relativePath === `${section.dir}/index.md` ||
      file.relativePath === `${section.dir}/index.mdx`
    );

    if (indexPage) {
      content += `- [${indexPage.title}](${indexPage.url})`;
      if (indexPage.description ?? indexPage.summary) {
        content += `: ${indexPage.description ?? indexPage.summary}`;
      }
      content += "\n";
    }

    const candidates = section.files
      .filter((file) => file !== indexPage)
      .map((file) => ({
        file,
        score: scoreSummaryCandidate(file),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.file.title.localeCompare(b.file.title);
      })
      .slice(0, SUMMARY_LIMIT_PER_SECTION)
      .map((entry) => entry.file);

    for (const file of candidates) {
      const descriptionOrSummary = file.description ?? file.summary;
      content += `- [${file.title}](${file.url})`;
      if (descriptionOrSummary) {
        content += `: ${descriptionOrSummary}`;
      }
      content += "\n";
    }

    content += "\n";
  }

  content += "## Optional\n\n";
  content +=
    `- [Contribution Guidelines](${BASE_URL}/runtime/contributing): How to contribute to Deno\n`;
  content +=
    `- [Style Guide](${BASE_URL}/runtime/contributing/style_guide): Coding style guidelines for Deno\n`;
  content +=
    `- [Release Schedule](${BASE_URL}/runtime/contributing/release_schedule): Deno's release cadence and versioning\n`;
  content +=
    "- [Deno LLM Skills](https://github.com/denoland/skills): Skills and playbooks for LLMs and AI agents working with Deno\n";

  return content;
}

function generateLlmsFullTxt(files: FileInfo[]): string {
  let content = "# Deno Documentation - Full Content\n\n";
  content +=
    "> This document contains the full content of the Deno documentation website.\n\n";

  // Sort files by path for consistency
  files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));

  // Add each file's content
  for (const file of files) {
    content += `# ${file.title}\n\n`;
    if (file.description) {
      content += `> ${file.description}\n\n`;
    }
    content += `URL: ${file.url}\n\n`;
    content += file.content + "\n\n";
    content += "---\n\n";
  }

  return content;
}

async function loadOramaSummaryIndex(): Promise<OramaSummaryIndex | null> {
  const summaryPath = join(ROOT_DIR, "static", "orama-index-summary.json");
  try {
    const raw = await Deno.readTextFile(summaryPath);
    const parsed = JSON.parse(raw) as OramaSummaryIndex;
    if (!parsed?.metadata || !Array.isArray(parsed?.data)) {
      return null;
    }
    return parsed;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

function generateLlmsJson(summary: OramaSummaryIndex): string {
  const payload = {
    metadata: {
      generatedAt: new Date().toISOString(),
      source: "orama-index-summary.json",
      orama: summary.metadata,
    },
    data: summary.data,
  };

  return JSON.stringify(payload);
}

function getSectionDescription(section: string): string {
  const descriptions: Record<string, string> = {
    runtime:
      "Documentation for the Deno CLI and runtime environment, including installation, configuration, and core concepts.",
    deploy:
      "Documentation for Deno Deploy, a serverless platform for deploying JavaScript to a global edge network.",
    examples:
      "Code examples and tutorials demonstrating how to build applications with Deno.",
    subhosting:
      "Documentation for Deno Subhosting, a platform for securely running code written by customers.",
    lint:
      "Documentation for Deno's built-in linter and formatter, including available rules and configuration.",
  };

  return descriptions[section] || "";
}

async function main(outputDir?: string) {
  console.log("Generating LLM-friendly documentation files...");

  const files = await collectFiles();
  console.log(`Collected ${files.length} documentation files`);

  // Use the specified output directory or default to the static directory
  const outDir = outputDir
    ? join(ROOT_DIR, outputDir)
    : join(ROOT_DIR, "static");

  try {
    await Deno.stat(outDir);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`The output directory ${outDir} does not exist`);
      Deno.exit(1);
    }
    throw error;
  }

  // Generate llms.txt
  const llmsTxt = generateLlmsTxt(files);
  await Deno.writeTextFile(join(outDir, "llms.txt"), llmsTxt);
  console.log(`Generated llms.txt in ${outDir}`);

  // Generate llms-summary.txt
  const llmsSummaryTxt = generateLlmsSummaryTxt(files);
  await Deno.writeTextFile(join(outDir, "llms-summary.txt"), llmsSummaryTxt);
  console.log(`Generated llms-summary.txt in ${outDir}`);

  // Generate llms.json (structured index from Orama summary)
  const oramaSummary = await loadOramaSummaryIndex();
  if (oramaSummary) {
    const llmsJson = generateLlmsJson(oramaSummary);
    await Deno.writeTextFile(join(outDir, "llms.json"), llmsJson);
    console.log(`Generated llms.json in ${outDir}`);
  } else {
    console.warn(
      "Skipped llms.json generation (orama-index-summary.json not found)",
    );
  }

  // Generate llms-full.txt
  const llmsFullTxt = generateLlmsFullTxt(files);
  await Deno.writeTextFile(join(outDir, "llms-full.txt"), llmsFullTxt);
  console.log(`Generated llms-full.txt in ${outDir}`);

  console.log("Done!");
}

// Run the main function
if (import.meta.main) {
  // Check if an output directory is specified as a command-line argument
  const args = Deno.args;
  const outputDir = args.length > 0 ? args[0] : undefined;
  main(outputDir);
}

// Export functions for use in the site build process
export default {
  collectFiles,
  generateLlmsTxt,
  generateLlmsSummaryTxt,
  generateLlmsFullTxt,
  generateLlmsJson,
  loadOramaSummaryIndex,
};
