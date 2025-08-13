import { join } from "@std/path";
import { IndexCollection } from "../indexing/IndexCollection.ts";
import type { IOutputFormat } from "../types.ts";

const ROOT_DIR = Deno.cwd();
const BASE_URL = "https://example.com"; // Replace with your actual base URL

export class MinimalIndexJsonOutput implements IOutputFormat {
    private outputDir?: string;

    constructor(outputDir?: string) {
        this.outputDir = outputDir;
    }

    async write(index: IndexCollection) {
        // Use the specified output directory or default to the static directory
        const outDir = this.outputDir
            ? join(ROOT_DIR, this.outputDir)
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

        const indexData = {
            metadata: {
            generatedAt: new Date().toISOString(),
            version: "1.0.0",
            baseUrl: BASE_URL,
            totalDocuments: index.documents.length,
            stats: index.stats,
            },
            documents: index.documents,
        };

        const minimalDocuments = index.documents.map((doc) => ({
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
    }
}