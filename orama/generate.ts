import { walk } from "@std/fs";
import { fromFileUrl, join, relative } from "@std/path";
import type { OramaDocument, DocType, IIndexDocuments, InputFileReference } from "./types";
import { FileSelector } from "./indexing/FileSelector.ts";
import { MarkdownIndexer } from "./indexing/MarkdownIndexer.ts";
import { NullIndexer } from "./indexing/NullIndexer.ts";
import { IndexCollection } from "./indexing/IndexCollection.ts"

const indexers = [
    new MarkdownIndexer(),
    new NullIndexer()
];

const scanner = new FileSelector();
const index = new IndexCollection();

for await (const file of scanner.selectInputFiles("./")) {
    console.log("Matched Entry", file.path, file.docType);

    const indexer = indexers.find((i) => i.isValidIndexer(file));
    const document = await indexer?.tryIndex(file);

    index.addDocument(document);
}

console.log(index.stats);