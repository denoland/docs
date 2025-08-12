import type { OramaDocument, DocType, IIndexDocuments, InputFileReference } from "./types";
import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";
import { FileSelector } from "./indexing/FileSelector.ts";
import { MarkdownIndexer } from "./indexing/MarkdownIndexer.ts";
import { NullIndexer } from "./indexing/NullIndexer.ts";
import { IndexCollection } from "./indexing/IndexCollection.ts"
import { OramaJsonOutput } from "./indexing/OramaJsonOutput.ts";
import { MinimalIndexJsonOutput } from "./indexing/MinimalIndexJsonOutput.ts"

async function main(outputDir?: string) {
    const inputs = [
        new FileSelector()
    ];

    const indexers = [
        new MarkdownIndexer(),
        new NullIndexer()
    ];

    const outputs = [
        new OramaJsonOutput(outputDir),
        new MinimalIndexJsonOutput(outputDir)
    ];

    const index = new IndexCollection();

    for (const input of inputs) {
        for await (const file of input.selectInputFiles("./")) {
            console.log("Matched Entry", file.path, file.docType);
            const indexer = indexers.find((i) => i.isValidIndexer(file));
            const document = await indexer?.tryIndex(file);
            index.addDocument(document);
        }
    }

    console.log(index.stats);

    for (const output of outputs) {
        await output.write(index);
    }
}

if (import.meta.main) {
  const args = Deno.args;
  const outputDir = args.length > 0 ? args[0] : undefined;
  await main(outputDir);
}
