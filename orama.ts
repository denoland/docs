import { Data, Page } from "lume/core/file.ts";
import { walkSync } from "@std/fs/walk";
import { parseExample } from "./learn/utils/parseExample.ts";

export interface OramaDocument {
  path: string;
  title: string;
  content: string;
  section: string;
  category: string;
}

export function generateDocumentsForPage(page: Page<Data>): OramaDocument[] {
  const documents: OramaDocument[] = [];

  const headers = page.document!.querySelectorAll(
    "main h1, main h2, main h3, main h4, main h5, main h6",
  );
  for (const header of headers) {
    let headerContent = "";
    for (const childNode of header.childNodes) {
      if (childNode.classList?.contains("header-anchor")) {
        break;
      }
      headerContent += childNode.textContent?.trim() + " ";
    }

    let bodyContent = "";
    let bodySibling = header.tagName == "H1"
      ? header.nextElementSibling!.firstElementChild
      : header.nextElementSibling;
    while (
      bodySibling &&
      !["H1", "H2", "H3", "H4", "H5", "H6"].includes(bodySibling.tagName)
    ) {
      bodyContent += bodySibling.textContent?.trim() + "\n";
      bodySibling = bodySibling.nextElementSibling;
    }

    documents.push({
      path: page.data.url + (header.id ? `#${header.id}` : ""),
      title: headerContent.trim(),
      content: bodyContent,
      section: page.data.title ?? "",
      category: page.data.url.startsWith("/runtime/")
        ? "Runtime"
        : (page.data.url.startsWith("/deploy/") ? "Deploy" : "Subhosting"),
    });
  }

  return documents;
}

export async function generateDocumentsForSymbols(): Promise<OramaDocument[]> {
  const documents = [];

  for (const kind of ["deno", "web", "node"]) {
    (globalThis as any).window = globalThis;
    delete (globalThis as any).DENO_DOC_SEARCH_INDEX;
    await import(`./reference_gen/gen/${kind}/search_index.js`);
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
    delete (globalThis as any).DENO_DOC_SEARCH_INDEX;
    delete (globalThis as any).window;

    console.log(
      "[orama] Inserting %d symbols for %s",
      index.nodes.length,
      kind,
    );

    for (const node of index.nodes) {
      documents.push({
        path: new URL(node.url, `https://docs.deno.com/api/${kind}/`).pathname
          .replace(/\.html$/, ""),
        title: node.name,
        content: node.doc,
        section: `API > ${kind}${node.file !== "." ? ` > ${node.file}` : ""}${
          node.category ? ` > ${node.category}` : ""
        }`,
        category: "Reference",
      });
    }
  }

  console.log("[orama] Total %d symbols", documents.length);

  return documents;
}

export async function generateDocumentsForExamples(): Promise<OramaDocument[]> {
  const files = [...walkSync("./examples/", {
    exts: [".ts"],
  })];
  return await Promise.all(files.map(async (file) => {
    const content = await Deno.readTextFile(file.path);
    const parsed = parseExample(file.name, content);

    const label = file.name.replace(".ts", "");

    return {
      path: `/examples/${label}`,
      title: parsed.title,
      content: parsed.description,
      section: parsed.group,
      category: "Examples",
    } as OramaDocument;
  }));
}

export async function clear(
  apiKey: string,
  indexId: string,
) {
  const res = await fetch(
    `https://api.oramasearch.com/api/v1/webhooks/${indexId}/snapshot`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: "[]",
    },
  );
  if (!res.ok) {
    console.error(`Orama clear failed`, res.status, await res.text());
  } else {
    console.log(`🚀 Orama clear succeeded`);
  }
}

export async function notify(
  apiKey: string,
  indexId: string,
  documents: OramaDocument[],
  label: string,
) {
  const res = await fetch(
    `https://api.oramasearch.com/api/v1/webhooks/${indexId}/notify`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ upsert: documents }),
    },
  );
  if (!res.ok) {
    console.error(
      `Orama notify '${label}' failed`,
      res.status,
      await res.text(),
    );
  } else {
    console.log(`🚀 Orama notify '${label}' succeeded`);
  }
}

export async function deploy(
  apiKey: string,
  indexId: string,
) {
  const resp = await fetch(
    `https://api.oramasearch.com/api/v1/webhooks/${indexId}/deploy`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );
  if (!resp.ok) {
    console.error("Orama deploy failed", resp.status, await resp.text());
  } else {
    console.log("🚀 Orama deploy succeeded");
  }
}
