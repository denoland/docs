import { expandGlob } from "@std/fs";
import { doc, DocNode } from "@deno/doc";

export type Package = {
  name: string;
  symbols: DocNode[];
};

const packages = [
  { packageName: "Web", files: ["./types/web.d.ts"] },
  { packageName: "Deno", files: ["./types/deno.d.ts"] },
  { packageName: "Node", files: await getNodeTypeFiles() },
];

export async function* getSymbols() {
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

      const symbols = docs[sourceFile];
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

async function getNodeTypeFiles() {
  const urls: string[] = [];
  for await (const file of expandGlob("./reference_gen/types/node/[!_]*")) {
    urls.push(file.path);
  }
  return urls;
}
