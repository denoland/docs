import { walk } from "@std/fs/walk";
import { dirname, extname } from "@std/path";
import { pooledMap } from "@std/async/pool";
import { DOMParser } from "@b-fuze/deno-dom";

const nav = await Deno.readTextFile("nav.html");
const navDeno = await Deno.readTextFile("nav_deno.html");
const navWeb = await Deno.readTextFile("nav_web.html");
const navNode = await Deno.readTextFile("nav_node.html");

let navHead = `
<link rel="stylesheet" href="/docusaurus.css">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-Italic.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-SemiBold.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-SemiBoldItalic.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="stylesheet" href="/fonts/inter.css">`;

for await (
  const entry of walk("../build/assets/js", {
    includeDirs: false,
    exts: ["js"],
  })
) {
  if (entry.name.includes("main")) {
    navHead = `<script src="/assets/js/${entry.name}" defer="defer"></script>` +
      navHead;
  }
}

const res = pooledMap(
  1000,
  walk("gen", {
    includeDirs: false,
  }),
  async (entry) => {
    const outPath = `./api${entry.path.slice(3)}`;
    await Deno.mkdir(dirname(outPath), { recursive: true });

    if (extname(entry.path) === ".html") {
      const file = await Deno.readTextFile(entry.path);
      const document = new DOMParser().parseFromString(file, "text/html");

      let subNav = "";
      if (entry.path.startsWith("gen/deno")) {
        subNav = navDeno;
      } else if (entry.path.startsWith("gen/web")) {
        subNav = navWeb;
      } else if (entry.path.startsWith("gen/node")) {
        subNav = navNode;
      }

      document.head.innerHTML = document.head.innerHTML + navHead;
      document.body.innerHTML = nav + subNav + document.body.innerHTML;

      await Deno.writeTextFile(
        outPath,
        "<!DOCTYPE html>" + document.documentElement!.outerHTML,
        {
          create: true,
        },
      );
    } else {
      await Deno.copyFile(entry.path, outPath);
    }
  },
);

await Array.fromAsync(res);

const API_KEY = Deno.env.get("ORAMA_CLOUD_API_KEY");
const INDEX_ID = Deno.env.get("ORAMA_CLOUD_INDEX_ID");
for (const kind of ["deno", "web", "node"]) {
  (globalThis as any).window = globalThis;
  await import(`./gen/${kind}/search_index.js`);
  const index = (globalThis as any as {
    DENO_DOC_SEARCH_INDEX: {
      nodes: {
        name: string;
        url: string;
        doc: string;
        category: string;
        file: string;
      }[];
    };
  }).DENO_DOC_SEARCH_INDEX;
  delete (globalThis as any).window;

  const searchEntries = index.nodes.map((node) => ({
    path: new URL(node.url, `https://docs.deno.com/api/${kind}/`).pathname
      .replace(/\.html$/, ""),
    title: node.name,
    content: node.doc,
    section: `API > ${kind}${node.file !== "." ? ` > ${node.file}` : ""}${
      node.category ? ` > ${node.category}` : ""
    }`,
    version: "current",
    category: "reference",
  }));

  if (API_KEY && INDEX_ID) {
    const res = await fetch(
      `https://api.oramasearch.com/api/v1/webhooks/${INDEX_ID}/notify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("ORAMA_CLOUD_API_KEY")}`,
        },
        body: JSON.stringify({ upsert: searchEntries }),
      },
    );
    if (!res.ok) {
      console.error("Orama update failed", res.status, await res.text());
    }
  }
}

const resp = await fetch(
  `https://api.oramasearch.com/api/v1/webhooks/${INDEX_ID}/deploy`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  },
);
if (!resp.ok) {
  console.error("Orama deploy failed", resp.status, await resp.text());
}
