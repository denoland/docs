import { Data, Page } from "lume/core/file.ts";
import { walkSync } from "@std/fs/walk";
import { parseExample } from "./examples.page.tsx";

export interface OramaDocument {
  path: string;
  title: string;
  content: string;
  section: string;
  category: string;
}

export function generateDocumentsForPage(page: Page<Data>): OramaDocument[] {
  const documents: OramaDocument[] = [];

  const headers = page.document!.querySelectorAll("h1, h2, h3, h4, h5, h6");
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
    delete (globalThis as any).window;

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

  return documents;
}

export async function generateDocumentsForExamples(): Promise<OramaDocument[]> {
  const files = [...walkSync("./by-example/", {
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
      category: "Example",
    } as OramaDocument;
  }));
}

export async function deploy(
  apiKey: string,
  indexId: string,
  documents: OramaDocument[],
) {
  const res = await fetch(
    `https://api.oramasearch.com/api/v1/webhooks/${indexId}/snapshot`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(documents),
    },
  );
  if (!res.ok) {
    console.error(`Orama snapshot failed`, res.status, await res.text());
  } else {
    console.log(`🚀 Orama snapshot succeeded`);
  }

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
