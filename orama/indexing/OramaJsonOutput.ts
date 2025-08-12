import type { IOutputFormat } from "./types";
import { fromFileUrl, join, relative } from "@std/path";

const ROOT_DIR = Deno.cwd();
const BASE_URL = "https://example.com"; // Replace with your actual base URL

export class OramaJsonOutput implements IOutputFormat {
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

        // Prepare the final index data
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

        // Write the index file
        const outputPath = join(outDir, "orama-index.json");
        await Deno.writeTextFile(outputPath, JSON.stringify(indexData, null, 2));

        console.log(`\nGenerated Orama index: ${outputPath}`);
        console.log(`File size: ${(await Deno.stat(outputPath)).size} bytes`);
    }
}