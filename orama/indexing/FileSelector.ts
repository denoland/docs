import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";
import type { OramaDocument, DocType, IIndexDocuments, InputFileReference } from "./types";

export class FileSelector {        
    private INCLUDE_DIRS = [
        "runtime",
        "deploy",
        "examples",
        "subhosting",
        "lint",
    ];

    // Files to exclude (relative paths)
    private EXCLUDE_FILES = [
        "README.md",
        "deno.json",
        "deno.lock",
        "lume.ts",
        "server.ts",
    ];

    // Extensions to include
    private INCLUDE_EXTS = [".md", ".mdx"];

    public async *selectInputFiles(indexPath: string) {
        const scanOpts = {
            includeDirs: false,
            includeFiles: true,
            followSymlinks: true,
            exts: this.INCLUDE_EXTS,
        };

        for (const dir of this.INCLUDE_DIRS) {
            const dirPath = join(indexPath, dir);
        
            for await (const entry of walk(dirPath, scanOpts)) {
                const relativePath = relative(indexPath, entry.path);
                if (this.EXCLUDE_FILES.some((exclude) => relativePath.includes(exclude))) {
                    continue;
                }

                if (relativePath.includes("/_")) {
                    continue;
                }

                const absolutePath = join(Deno.cwd(), entry.path);

                const reference = {
                    path: relativePath,
                    fullPath: absolutePath,
                    docType: relativePath.endsWith(".md") || relativePath.endsWith(".mdx") ? "markdown" : "api-reference",
                };

                yield reference;
            }
        }
    }
}
