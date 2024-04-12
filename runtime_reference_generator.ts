import { join } from "jsr:@std/path@0.222.1/join";
import { pooledMap } from "jsr:@std/async@0.222.1";

const genPath = "./gendocs";
const outPath = "runtime/reference";
await Deno.remove(outPath, { recursive: true });
await Deno.mkdir(outPath);
await Deno.mkdir(join(outPath, "~"));

/*const cmd = await new Deno.Command(Deno.execPath(), {
  env: {
    "DENO_DOCS_INTERNAL": "1",
  },
  args: [
    "doc",
    "--html",
    `--output=${genPath}`,
    "--builtin",
  ]
}).output();
if (!cmd.success) {
  throw new Error(new TextDecoder().decode(cmd.stderr));
}*/

const CSS_PATH = join(genPath, "styles.css");
//const SEARCH_INDEX_PATH = join(genPath, "search_index.js");
const SCRIPT_PATH = join(genPath, "script.js");

await Deno.copyFile(join("static", "doc", "styles.css"), CSS_PATH);
await Deno.copyFile(join("static", "doc", "script.js"), SCRIPT_PATH);


await generateReferenceFile(await Array.fromAsync(Deno.readDir(genPath)), genPath, "index", join(outPath, "index"));


const symbolsDir = join(genPath, "~");

const redirects: Record<string, string> = {};

const pool = pooledMap(50, Deno.readDir(symbolsDir), async (symbol) => {
  if (symbol.isDirectory) {
    const path = join(symbolsDir, symbol.name);
    await processSymbol(
      await Array.fromAsync(Deno.readDir(path)),
      path,
      symbol.name,
    );
  }
});


for await (const _ of pool) {
  //
}

await Deno.writeTextFile("src-deno/reference_redirects.json", JSON.stringify(redirects, null, 2));

async function processSymbol(
  entries: Deno.DirEntry[],
  parentPath: string,
  symbol: string,
) {
  const symbolOutPath = join(outPath, "~", symbol);
  if (entries.find((entry) => entry.name == "redirect.json")) {
    const redirectJson = JSON.parse(await Deno.readTextFile(join(parentPath, "redirect.json")));
    redirects[symbolOutPath] = redirectJson.path;
  } else {
    await generateReferenceFile(entries, parentPath, symbol, symbolOutPath);
  }
}

async function generateReferenceFile(
  entries: Deno.DirEntry[],
  parentPath: string,
  title: string,
  genOutPath: string,
) {
  const breadcrumbs = entries.find((entry) =>
    entry.name == "breadcrumbs.html"
  )
    ? await Deno.readTextFile(join(parentPath, "breadcrumbs.html"))
    : "";
  const content = entries.find((entry) => entry.name == "content.html")
    ? await Deno.readTextFile(join(parentPath, "content.html"))
    : "";
  const sidepanel = entries.find((entry) => entry.name == "sidepanel.html")
    ? await Deno.readTextFile(join(parentPath, "sidepanel.html"))
    : "";

  const file = `
import React from 'react';
import Layout from '@theme/Layout';

export default function Reference() {
  return (
    <Layout title="${title}" description="${title}">
      <link rel="stylesheet" href="/doc/styles.css" />
      <script src="/doc/script.js" defer />
      <div className="ddoc flex" style={{
        "marginTop": "var(--ifm-navbar-height)",
        "paddingTop": "24px",
        "gap": "24px"
      }}>
        <div style={{
          "width": "var(--doc-sidebar-width)"
        }} dangerouslySetInnerHTML={{ __html: ${JSON.stringify(sidepanel)} }} />
        <div>
          <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(breadcrumbs)} }} />
          <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(content)} }} />
        </div>
      </div>
    </Layout>
  );
}`;

  await Deno.writeTextFile(genOutPath + ".jsx", file);
}


//await Deno.remove(genPath, { recursive: true });
