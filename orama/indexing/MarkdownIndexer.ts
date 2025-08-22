import type {
    IIndexDocuments,
    InputFileReference,
    OramaDocument,
} from "../types.ts";

const H1_REGEX = /^# (.+)$/m;
const FRONTMATTER_TITLE_REGEX = /title: ["'](.+)["']/;
const DESCRIPTION_REGEX = /description: ["'](.+)["']/;
const FRONTMATTER_URL_REGEX = /url:\s*(.+)/;
const TAGS_REGEX = /tags: \[(.*?)\]/;
const FRONTMATTER_COMMAND_REGEX = /\bcommand:\s*(["']?)([a-zA-Z0-9_-]+)\1/;

export class MarkdownIndexer implements IIndexDocuments {
    public isValidIndexer(file: InputFileReference): boolean {
        return file.docType === "markdown";
    }

    public async tryIndex(
        file: InputFileReference,
    ): Promise<OramaDocument | null> {
        try {
            const document = await this.index(file);
            console.log("Indexed document:", document?.title);
            return document;
        } catch (error) {
            console.error("Error indexing file:", file.path, error);
            return null;
        }
    }

    public async index(
        file: InputFileReference,
    ): Promise<OramaDocument | null> {
    const content = await Deno.readTextFile(file.fullPath);
        const stat = await Deno.stat(file.fullPath);

    // Normalize path separators to forward slashes for consistent logic
    const relPath = file.path.replace(/\\/g, "/");

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
                const pathParts = file.path.replace(/\.(md|mdx)$/, "").split(
                    "/",
                );
                title = pathParts[pathParts.length - 1]
                    .replace(/[-_]/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());
            }
        }

        // Extract description
        let description: string | null = null;
        const descMatch = frontmatter.match(DESCRIPTION_REGEX);
        if (descMatch) {
            description = descMatch[1];
        }

        // Detect CLI command pages
    const isCliPath = relPath.startsWith("runtime/reference/cli/");
        let command: string | undefined = undefined;
        if (isCliPath) {
            // Prefer explicit frontmatter command field
            const cmdMatch = frontmatter.match(FRONTMATTER_COMMAND_REGEX);
            if (cmdMatch) {
                command = cmdMatch[2].trim();
            } else {
                // Fallback: derive from filename (e.g., serve.md -> serve)
                const fileName = relPath.split("/").pop() || "";
                const m = fileName.match(/^([a-z0-9_-]+)\.(md|mdx)$/i);
                if (m) command = m[1];
            }
        }

        const tags = this.extractTags(frontmatter);
        const headings = this.extractHeadings(markdownContent);
    const cleanedContent = this.cleanMarkdownContent(markdownContent);
    // Include title/description in searchable content to ensure H1/frontmatter is indexed
    const prefixParts: string[] = [];
    if (title) prefixParts.push(title);
    if (description) prefixParts.push(description);
    const prefixedContent = (prefixParts.join("\n\n") + "\n\n" + cleanedContent).trim();

        // Skip files with very little content
    if (prefixedContent.length < 50) {
            console.log(`Skipping ${file.path} - content too short`);
            return null;
        }

        // Get category and section
        const { category, section, subsection } = this.getCategoryAndSection(relPath);

        const url = this.buildUrl(relPath, frontmatter);

        return {
            id: this.generateId(relPath),
            title: title,
            content: prefixedContent,
            url,
            path: this.buildPath(relPath, frontmatter),
            category: category,
            section: section,
            subsection: subsection || undefined,
            description: description || undefined,
            tags: tags,
            headings: headings,
            lastModified: stat.mtime?.getTime() || Date.now(),
            kind: isCliPath ? "cli" : undefined,
            command,
        };
    }

    private cleanMarkdownContent(content: string): string {
        return content
            // Remove entire navigation blocks first
            .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, "")
            // Remove any element marked as role="navigation" (keep minimal regex)
            .replace(/<([a-zA-Z][\w:-]*)[^>]*\brole=["']navigation["'][^>]*>[\s\S]*?<\/\1>/gi, "")
            .replace(/^---\n[\s\S]*?\n---\n/, "") // Remove frontmatter
            .replace(/```[\s\S]*?```/g, "") // Remove code blocks
            .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
            .replace(/<[^>]*>/g, "") // Remove JSX/MDX components
            .replace(/!\[.*?\]\(.*?\)/g, "") // Remove image references
            .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove links
            .replace(/\n{3,}/g, "\n\n") // Clean up multiple newlines
            .replace(/[ \t]+/g, " ") // Remove excessive whitespace
            .trim();
    }

    private extractHeadings(content: string): string[] {
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

    private extractTags(frontmatter: string): string[] {
        const match = frontmatter.match(TAGS_REGEX);
        if (match) {
            return match[1]
                .split(",")
                .map((tag) => tag.trim().replace(/["']/g, ""))
                .filter((tag) => tag.length > 0);
        }
        return [];
    }

    private getCategoryAndSection(
        relativePath: string,
    ): { category: string; section: string; subsection: string | null } {
        const parts = relativePath.split("/");
        const category = parts[0] || "general";
        const section = parts[1] || "general";
        const subsection = parts.length > 2 ? parts[2] : null;

        return { category, section, subsection };
    }

    private generateId(relativePath: string): string {
        return relativePath
            .replace(/\.(md|mdx)$/, "")
            .replace(/[\/]/g, "-")
            .replace(/[^a-zA-Z0-9-_]/g, "")
            .toLowerCase();
    }

    private buildUrl(relativePath: string, frontmatter?: string): string {
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
                const BASE_URL = "https://docs.deno.com";
                return `${BASE_URL}${frontmatterUrl}`;
            }
        }

        // Fall back to path-based URL
        let url = relativePath.replace(/\.(md|mdx)$/, "");
        if (url.endsWith("/index")) {
            url = url.replace(/\/index$/, "/");
        }
        if (!url.startsWith("/")) {
            url = "/" + url;
        }

        const BASE_URL = "https://docs.deno.com"; // Replace with your actual base URL

        return `${BASE_URL}${url}`;
    }

    private buildPath(relativePath: string, frontmatter?: string): string {
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
        let p = relativePath.replace(/\.(md|mdx)$/, "");
        if (p.endsWith("/index")) {
            p = p.replace(/\/index$/, "/");
        }
        if (!p.startsWith("/")) {
            p = "/" + p;
        }
        return p;
    }
}
