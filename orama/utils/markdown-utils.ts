/**
 * Shared utilities for markdown processing in Orama indexing
 */

// Common regex patterns
export const H1_REGEX = /^# (.+)$/m;
export const FRONTMATTER_TITLE_REGEX = /title: ["'](.+)["']/;
export const DESCRIPTION_REGEX = /description: ["'](.+)["']/;
export const FRONTMATTER_URL_REGEX = /url:\s*(.+)/;
export const TAGS_REGEX = /tags: \[(.*?)\]/;
export const FRONTMATTER_COMMAND_REGEX = /\bcommand:\s*(["']?)([a-zA-Z0-9_-]+)\1/;

// Frontmatter regex that handles both CRLF and LF line endings
export const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

/**
 * Clean markdown content for indexing by removing non-textual elements
 */
export function cleanMarkdownContent(content: string): string {
  return content
    // Remove entire navigation blocks first
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "")
    // Remove any element marked as role="navigation"
    .replace(/<([a-zA-Z][\w:-]*)[^>]*\brole=["']navigation["'][^>]*>[\s\S]*?<\/\1>/gi, "")
    // Remove frontmatter
    .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "")
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
 * Extract heading text from markdown content (H1, H2, H3)
 */
export function extractHeadings(content: string): string[] {
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
export function extractTags(frontmatter: string): string[] {
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
 * Parse frontmatter from markdown content
 * Returns { frontmatter, content } or null if no frontmatter found
 */
export function parseFrontmatter(content: string): { frontmatter: string; content: string } | null {
  const frontmatterMatch = content.match(FRONTMATTER_REGEX);
  if (frontmatterMatch) {
    return {
      frontmatter: frontmatterMatch[1],
      content: frontmatterMatch[2],
    };
  }
  return null;
}

/**
 * Extract title from frontmatter or first H1
 */
export function extractTitle(frontmatter: string, markdownContent: string, relativePath: string): string {
  // Try frontmatter first
  const titleMatch = frontmatter.match(FRONTMATTER_TITLE_REGEX);
  if (titleMatch) {
    return titleMatch[1];
  }

  // Try first H1
  const h1Match = markdownContent.match(H1_REGEX);
  if (h1Match) {
    return h1Match[1];
  }

  // Generate title from file path as fallback
  const pathParts = relativePath.replace(/\.(md|mdx)$/, "").split("/");
  return pathParts[pathParts.length - 1]
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Extract description from frontmatter
 */
export function extractDescription(frontmatter: string): string | null {
  const descMatch = frontmatter.match(DESCRIPTION_REGEX);
  return descMatch ? descMatch[1] : null;
}

/**
 * Build URL with frontmatter override support
 */
export function buildUrlWithFrontmatter(
  relativePath: string, 
  baseUrl: string, 
  frontmatter?: string
): string {
  // Check for frontmatter URL first
  if (frontmatter) {
    const urlMatch = frontmatter.match(FRONTMATTER_URL_REGEX);
    if (urlMatch) {
      let frontmatterUrl = urlMatch[1].trim();
      // Remove quotes if present
      frontmatterUrl = frontmatterUrl.replace(/^['"`]|['"`]$/g, '');
      // Ensure it starts with /
      if (!frontmatterUrl.startsWith("/")) {
        frontmatterUrl = "/" + frontmatterUrl;
      }
      return `${baseUrl}${frontmatterUrl}`;
    }
  }

  // Fall back to path-based URL
  let url = relativePath.replace(/\.(md|mdx)$/, "");
  // Normalize path separators to forward slashes for web URLs
  url = url.replace(/\\/g, "/");
  
  // Flatten tutorial URLs only in examples: /examples/tutorials/something -> /examples/something_tutorial
  if (url.startsWith("examples/tutorials/")) {
    url = url.replace("examples/tutorials/", "examples/").replace(/\/([^/]+)$/, "/$1_tutorial");
  }
  
  if (url.endsWith("/index")) {
    url = url.replace(/\/index$/, "/");
  }
  if (!url.startsWith("/")) {
    url = "/" + url;
  }
  return `${baseUrl}${url}`;
}

/**
 * Build path with frontmatter override support (without base URL)
 */
export function buildPathWithFrontmatter(
  relativePath: string, 
  frontmatter?: string
): string {
  // Check for frontmatter URL first
  if (frontmatter) {
    const urlMatch = frontmatter.match(FRONTMATTER_URL_REGEX);
    if (urlMatch) {
      let frontmatterUrl = urlMatch[1].trim();
      // Remove quotes if present
      frontmatterUrl = frontmatterUrl.replace(/^['"`]|['"`]$/g, '');
      // Ensure it starts with /
      if (!frontmatterUrl.startsWith("/")) {
        frontmatterUrl = "/" + frontmatterUrl;
      }
      return frontmatterUrl;
    }
  }

  // Fall back to path-based URL
  let path = relativePath.replace(/\.(md|mdx)$/, "");
  // Normalize path separators to forward slashes for web paths
  path = path.replace(/\\/g, "/");
  
  // Flatten tutorial URLs only in examples: /examples/tutorials/something -> /examples/something_tutorial
  if (path.startsWith("examples/tutorials/")) {
    path = path.replace("examples/tutorials/", "examples/").replace(/\/([^/]+)$/, "/$1_tutorial");
  }
  
  if (path.endsWith("/index")) {
    path = path.replace(/\/index$/, "/");
  }
  if (!path.startsWith("/")) {
    path = "/" + path;
  }
  return path;
}

/**
 * Generate category and section from path
 */
export function getCategoryAndSection(
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
export function generateDocumentId(relativePath: string): string {
  return relativePath
    .replace(/\.(md|mdx)$/, "")
    .replace(/[\/]/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
}
