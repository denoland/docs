import { doc, DocNode } from "@deno/doc";
import { PackageConfig } from "../types.ts";

export async function* getSymbols(packages: PackageConfig[]) {
  for (const { packageName, files } of packages) {
    const paths = files.map((file) => {
      if (!file.startsWith("./")) {
        return `file://${file}`;
      } else {
        const newPath = file.replace("./", "../../reference_gen/");
        return import.meta.resolve(newPath);
      }
    });

    const docs = await loadDocumentation(paths);

    for (const sourceFile of Object.keys(docs)) {
      const sourceFileName = sourceFile.split("/").pop();
      if (!sourceFileName) {
        throw new Error("Could not get source file name");
      }

      const symbols = docs[sourceFile];
      addAutoTags(symbols, sourceFileName);

      yield { packageName, symbols, sourceFile, sourceFileName };
    }
  }
}

async function loadDocumentation(paths: string[]) {
  const docGenerationPromises = paths.map(async (path) => {
    return await doc([path]);
  });

  const nodes = await Promise.all(docGenerationPromises);
  return nodes.reduce((acc, val) => ({ ...acc, ...val }), {});
}

function addAutoTags(symbols: DocNode[], sourceFileName: string) {
  for (const symbol of symbols) {
    if (sourceFileName.includes("node__")) {
      let category = sourceFileName;
      category = category.replace("node__", "");
      category = category.replace(".d.ts", "");
      category = category.replace("--", "/");

      symbol.jsDoc = symbol.jsDoc || {};
      symbol.jsDoc.tags = symbol.jsDoc.tags || [];
      symbol.jsDoc.tags.push({
        kind: "category",
        doc: category,
      });

      symbol.jsDoc.tags.push({
        kind: "tags",
        tags: ["node"],
      });
    }
  }
}
