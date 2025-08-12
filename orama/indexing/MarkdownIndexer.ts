import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";
import type { OramaDocument, DocType, IIndexDocuments, InputFileReference } from "./types";

const H1_REGEX = /^# (.+)$/m;
const _H2_REGEX = /^## (.+)$/gm;
const _H3_REGEX = /^### (.+)$/gm;
const FRONTMATTER_TITLE_REGEX = /title: ["'](.+)["']/;
const DESCRIPTION_REGEX = /description: ["'](.+)["']/;
const TAGS_REGEX = /tags: \[(.*?)\]/;

export class MarkdownIndexer implements IIndexDocuments {
    public isValidIndexer(file: InputFileReference): boolean {
        return file.docType === "markdown";
    }

    public async tryIndex(file: InputFileReference): Promise<OramaDocument | null> {

        try {
            const document = await this.index(file);
            console.log("Indexed document:", document.title);
            return document;
        } catch (error) {
            console.error("Error indexing file:", file.fullPath, error);
            return null;
        }
    }

    public async index(file: InputFileReference): Promise<OramaDocument> {
        const content = await Deno.readTextFile(file.fullPath);
        const stat = await Deno.stat(file.fullPath);

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
        let description = null;
        const descMatch = frontmatter.match(DESCRIPTION_REGEX);
        if (descMatch) {
            description = descMatch[1];
        }

        const tags = this.extractTags(frontmatter);
        const headings = this.extractHeadings(markdownContent);
        const cleanedContent = this.cleanMarkdownContent(markdownContent);

        // Skip files with very little content
        if (cleanedContent.length < 50) {
            console.log(`Skipping ${file.path} - content too short`);
            return null;
        }

        // Get category and section
        const { category, section, subsection } = this.getCategoryAndSection(file.path);

        // Build URL
        const url = this.buildUrl(file.path);

        return {
            path: file.fullPath,
            relativePath: file.path,
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
        };
    }

    private cleanMarkdownContent(content: string): string {
        return content
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

    private getCategoryAndSection(relativePath: string): { category: string; section: string; subsection: string | null } {
        const parts = relativePath.split("/");
        const category = parts[0] || "general";
        const section = parts[1] || "general";
        const subsection = parts.length > 2 ? parts[2] : null;

        return { category, section, subsection };
    }

    private generateId(relativePath: string): string {
        return relativePath
            .replace(/\.(md|mdx)$/, "")
            .replace(/\//g, "-")
            .replace(/[^a-zA-Z0-9-_]/g, "")
            .toLowerCase();
    }

    private buildUrl(relativePath: string): string {
        let url = relativePath.replace(/\.(md|mdx)$/, "");
        if (url.endsWith("/index")) {
            url = url.replace(/\/index$/, "/");
        }
        if (!url.startsWith("/")) {
            url = "/" + url;
        }

        const BASE_URL = "https://example.com"; // Replace with your actual base URL

        return `${BASE_URL}${url}`;
    }    
}
