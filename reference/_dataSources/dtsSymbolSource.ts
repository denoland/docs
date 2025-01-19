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

async function getNodeTypeFiles() {
  const urls: string[] = [];
  for await (const file of expandGlob("./reference_gen/types/node/[!_]*")) {
    urls.push(file.path);
  }
  return urls;
}

function addAutoTags(symbols: DocNode[], sourceFileName: string) {
  for (const symbol of symbols) {
    if (fileDrivenAutoTagsMap.has(sourceFileName)) {
      const category = fileDrivenAutoTagsMap.get(sourceFileName);

      symbol.jsDoc = symbol.jsDoc || {};
      symbol.jsDoc.tags = symbol.jsDoc.tags || [];
      symbol.jsDoc.tags.push({
        kind: "category",
        doc: category!,
      });
    }
  }
}

const fileDrivenAutoTagsMap = new Map([
  ["node__assert.d.ts", "assert"],
  ["node__assert--strict.d.ts", "assert/strict"],
  ["node__async_hooks.d.ts", "async_hooks"],
  ["node__buffer.d.ts", "buffer"],
  ["node__child_process.d.ts", "child_process"],
  ["node__cluster.d.ts", "cluster"],
  ["node__console.d.ts", "console"],
  ["node__constants.d.ts", "constants"],
  ["node__crypto.d.ts", "crypto"],
  ["node__dgram.d.ts", "dgram"],
  ["node__diagnostics_channel.d.ts", "diagnostics_channel"],
  ["node__dns.d.ts", "dns"],
  ["node__dns--promises.d.ts", "dns/promises"],
  ["node__domain.d.ts", "domain"],
  ["node__events.d.ts", "events"],
  ["node__fs.d.ts", "fs"],
  ["node__fs--promises.d.ts", "fs/promises"],
  ["node__http.d.ts", "http"],
  ["node__http2.d.ts", "http2"],
  ["node__https.d.ts", "https"],
  ["node__inspector.d.ts", "inspector"],
  ["node__inspector--promises.d.ts", "inspector/promises"],
  ["node__module.d.ts", "module"],
  ["node__net.d.ts", "net"],
  ["node__os.d.ts", "os"],
  ["node__path.d.ts", "path"],
  ["node__perf_hooks.d.ts", "perf_hooks"],
  ["node__process.d.ts", "process"],
  ["node__punycode.d.ts", "punycode"],
  ["node__querystring.d.ts", "querystring"],
  ["node__readline.d.ts", "readline"],
  ["node__readline--promises.d.ts", "readline/promises"],
  ["node__repl.d.ts", "repl"],
  ["node__sea.d.ts", "sea"],
  ["node__sqlite.d.ts", "sqlite"],
  ["node__stream.d.ts", "stream"],
  ["node__stream--consumers.d.ts", "stream/consumers"],
  ["node__stream--promises.d.ts", "stream/promises"],
  ["node__stream--web.d.ts", "stream/web"],
  ["node__string_decoder.d.ts", "string_decoder"],
  ["node__test.d.ts", "test"],
  ["node__test--reporters.d.ts", "test/reporters"],
  ["node__timers.d.ts", "timers"],
  ["node__timers--promises.d.ts", "timers/promises"],
  ["node__tls.d.ts", "tls"],
  ["node__trace_events.d.ts", "trace_events"],
  ["node__tty.d.ts", "tty"],
  ["node__url.d.ts", "url"],
  ["node__util.d.ts", "util"],
  ["node__util--types.d.ts", "util/types"],
  ["node__v8.d.ts", "v8"],
  ["node__vm.d.ts", "vm"],
  ["node__wasi.d.ts", "wasi"],
  ["node__worker_threads.d.ts", "worker_threads"],
  ["node__zlib.d.ts", "zlib"],
]);
