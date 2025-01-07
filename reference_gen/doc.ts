import { doc, DocNode, generateHtml, GenerateOptions } from "@deno/doc";
import { encodeHex } from "jsr:@std/encoding/hex";
import registrations from "./registrations.ts";
import { fileExists, writeFiles } from "./common.ts";

type FileMetadata = { fileIdentifier: string; filePath: string; hashPath: string; objectHash: string };

console.time("doc");
console.timeLog("doc", "Generating doc nodes...");

for (const { sources, generateOptions } of registrations) {
    console.timeLog("doc", `Processing ${generateOptions.packageName}...`);

    const paths = resolveFilePaths(sources);
    const docs = await loadDocumentation(paths);
    const metadata = await generateFileMetadata(docs, generateOptions);

    if (await fileExists(metadata.hashPath)) {
        console.timeLog("doc", `Checking ${metadata.fileIdentifier} for changes...`);
        const existingHash = await Deno.readTextFile(metadata.hashPath);

        if (existingHash === metadata.objectHash) {
            console.timeLog("doc", `Skipping ${metadata.fileIdentifier} because source hash and previously generated file hash match exactly. Delete the hash file ${metadata.hashPath} to force regeneration.`);
            continue;
        }
    }

    const files = await generateFiles(docs, generateOptions);

    await writeFiles("gen/" + metadata.fileIdentifier, files);
    await Deno.writeTextFile(metadata.hashPath, metadata.objectHash);
    //await saveResults(files, metadata);
}

console.timeEnd("doc");

function resolveFilePaths(sources: string[]) {
    return sources.map((file) =>
        file.startsWith("./") ? import.meta.resolve(file) : `file://${file}`
    );
}

async function loadDocumentation(paths: string[]) {
    const docGenerationPromises = paths.map(async (path) => {
        return await doc([path]);
    });

    const nodes = await Promise.all(docGenerationPromises);
    return nodes.reduce((acc, val) => ({ ...acc, ...val }), {});
}

async function generateFileMetadata(nodes: Record<string, DocNode[]>, generateOptions: GenerateOptions) {
    const fileIdentifier = generateOptions.packageName?.toLowerCase()!;
    const filePath = `./gen/${fileIdentifier}.json`;
    const hashPath = `./gen/${fileIdentifier}.hash`;
    const objectHash = await hashObject(nodes);
    return { fileIdentifier, filePath, hashPath, objectHash };
}

async function generateFiles(nodes: Record<string, DocNode[]>, generateOptions: GenerateOptions) {
    console.timeLog("doc", "Generating files...");

    const fileGenerationPromises = Object.keys(nodes).map(async (key) => {
        const data = Object.fromEntries([[key, nodes[key]]]);
        const html = await generateHtml(data, generateOptions);

        console.timeLog("doc", `Generated ${key}.`);
        return html;
    });

    const allGeneratedFiles = await Promise.all(fileGenerationPromises);
    return allGeneratedFiles.reduce((acc, val) => ({ ...acc, ...val }), {});
}

async function saveResults(files: Record<string, string>, metadata: FileMetadata) {
    console.timeLog("doc", "Writing files...");
    const asString = JSON.stringify(files, null, 2);

    await Deno.writeTextFile(metadata.filePath, asString);
    await Deno.writeTextFile(metadata.hashPath, metadata.objectHash);

    console.timeLog("doc", `Wrote ${metadata.fileIdentifier}.`);
}

// deno-lint-ignore no-explicit-any
async function hashObject(obj: any) {
    const messageBuffer = new TextEncoder().encode(JSON.stringify(obj));
    const hashBuffer = await crypto.subtle.digest("SHA-256", messageBuffer);
    return encodeHex(hashBuffer);
}
