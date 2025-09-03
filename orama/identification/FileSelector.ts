import { walk } from "@std/fs";
import { join, relative } from "@std/path";
import type { InputFileReference } from "../types.ts";

export class FileSelector {
    private INCLUDE_DIRS = [
        "runtime",
        "deploy",
        "examples",
        "subhosting",
        "lint",
    ];

    private EXCLUDE_FILES = [
        "README.md",
        "deno.json",
        "deno.lock",
        "lume.ts",
        "server.ts",
    ];

    private REFERENCE_FILES = [
        {
            path: "reference_gen/gen/deno.json",
            apiType: "deno",
            baseUrl: "/api/deno",
        },
        {
            path: "reference_gen/gen/web.json",
            apiType: "web",
            baseUrl: "/api/web",
        },
        {
            path: "reference_gen/gen/node.json",
            apiType: "node",
            baseUrl: "/api/node",
        },
    ];

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
                if (
                    this.EXCLUDE_FILES.some((exclude) =>
                        relativePath.includes(exclude)
                    )
                ) {
                    continue;
                }

                if (relativePath.includes("/_")) {
                    continue;
                }

                const absolutePath = join(Deno.cwd(), entry.path);

                const reference: InputFileReference = {
                    path: relativePath,
                    fullPath: absolutePath,
                    docType:
                        relativePath.endsWith(".md") ||
                            relativePath.endsWith(".mdx")
                            ? "markdown"
                            : "api-reference",
                };

                console.log(
                    "Selected file:",
                    reference.path,
                    reference.docType,
                );
                yield reference;
            }
        }

        for (const refFile of this.REFERENCE_FILES) {
            const fullPath = join(Deno.cwd(), refFile.path);
            try {
                await Deno.stat(fullPath);
                const reference: InputFileReference = {
                    path: refFile.path,
                    fullPath,
                    docType: "api-reference",
                };
                yield reference;
            } catch {
                console.warn("Reference file not found:", fullPath);
            }
        }
    }
}
