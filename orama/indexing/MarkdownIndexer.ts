import type {
    IIndexDocuments,
    InputFileReference,
    OramaDocument,
} from "../types.ts";
import {
    FRONTMATTER_COMMAND_REGEX,
    cleanMarkdownContent,
    extractHeadings,
    extractTags,
    parseFrontmatter,
    extractTitle,
    extractDescription,
    buildUrlWithFrontmatter,
    buildPathWithFrontmatter,
    getCategoryAndSection,
    generateDocumentId,
} from "../utils/markdown-utils.ts";

const BASE_URL = "https://docs.deno.com";

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

        // Parse frontmatter
        const parsed = parseFrontmatter(content);
        const frontmatter = parsed?.frontmatter || "";
        const markdownContent = parsed?.content || content;

        // Extract title
        const title = extractTitle(frontmatter, markdownContent, relPath);

        // Extract description
        const description = extractDescription(frontmatter);

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

        const tags = extractTags(frontmatter);
        const headings = extractHeadings(markdownContent);
        const cleanedContent = cleanMarkdownContent(markdownContent);
        
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
        const { category, section, subsection } = getCategoryAndSection(relPath);

        const url = buildUrlWithFrontmatter(relPath, BASE_URL, frontmatter);
        const path = buildPathWithFrontmatter(relPath, frontmatter);

        return {
            id: generateDocumentId(relPath),
            title: title,
            content: prefixedContent,
            url,
            path,
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
}
