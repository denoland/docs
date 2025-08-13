import type { OramaDocument, DocType, IIndexDocuments, InputFileReference } from "./types";
import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";
import { FileSelector } from "./identification/FileSelector.ts";
import { MarkdownIndexer } from "./indexing/MarkdownIndexer.ts";
import { NullIndexer } from "./indexing/NullIndexer.ts";
import { IndexCollection } from "./indexing/IndexCollection.ts"
import { OramaJsonOutput } from "./outputs/OramaJsonOutput.ts";
import { MinimalIndexJsonOutput } from "./outputs/MinimalIndexJsonOutput.ts"

const args = Deno.args;
const outputDir = args.length > 0 ? args[0] : undefined;

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
    const filePromises = [];
    
    for await (const file of input.selectInputFiles("./")) {
        const indexer = indexers.find((i) => i.isValidIndexer(file));
        filePromises.push(indexer.tryIndex(file));
    }

    const documents = await Promise.all(filePromises);

    for (const document of documents) {
        index.addDocument(document);
    }
}

console.log(index.stats);

for (const output of outputs) {
    await output.write(index);
}
