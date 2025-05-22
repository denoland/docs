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
import { join, relative } from "@std/path";

const BASE_URL = "https://docs.deno.com";
const ROOT_DIR = new URL(".", import.meta.url).pathname;

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

// Regex patterns for extracting headers and content
const H1_REGEX = /^# (.+)$/m;
const H2_REGEX = /^## (.+)$/gm;
const FRONTMATTER_TITLE_REGEX = /title: ["'](.+)["']/;
const DESCRIPTION_REGEX = /description: ["'](.+)["']/;

interface FileInfo {
  path: string;
  relativePath: string;
  url: string;
  title: string;
  description: string | null;
  content: string;
  h2Sections: string[];
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
            title = relativePath; // Fallback to file path
          }
        }

        // Extract description
        let description = null;
        const descMatch = frontmatter.match(DESCRIPTION_REGEX);
        if (descMatch) {
          description = descMatch[1];
        }

        // Extract h2 sections
        const h2Sections: string[] = [];
        let match;
        while ((match = H2_REGEX.exec(markdownContent)) !== null) {
          h2Sections.push(match[1]);
        }

        // Build URL (strip extension and handle index files)
        let url = relativePath.replace(/\.(md|mdx)$/, "");
        if (url.endsWith("/index")) {
          url = url.replace(/\/index$/, "/");
        }

        files.push({
          path: entry.path,
          relativePath,
          url: `${BASE_URL}/${url}`,
          title,
          description,
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
        content += `- [${file.title}](${file.url})`;
        if (file.description) {
          content += `: ${file.description}`;
        }
        content += "\n";
      }
    }

    content += "\n";
  }

  // Add Optional section with additional resources
  content += "## Optional\n\n";
  content +=
    "- [Contribution Guidelines](/runtime/contributing): How to contribute to Deno\n";
  content +=
    "- [Style Guide](/runtime/contributing/style_guide): Coding style guidelines for Deno\n";
  content +=
    "- [Release Schedule](/runtime/contributing/release_schedule): Deno's release cadence and versioning\n";

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
  generateLlmsFullTxt,
};
