import { DOMParser } from "jsr:@b-fuze/deno-dom";

type Element = import("jsr:@b-fuze/deno-dom").Element;

const visitedPages = new Set<string>();

const rootURL = new URL(Deno.env.get("DOCS_ROOT")!);
const rootPage = await fetch(rootURL).then((res) => res.text());

visitedPages.add(rootURL.href);
let hasInvalidHrefs = false;

await traversePage(rootURL, rootPage);

if (hasInvalidHrefs) {
  Deno.exit(1);
}

async function traversePage(url: URL, content: string) {
  const doc = new DOMParser().parseFromString(content, "text/html");
  // TODO(kt3k): Queue tasks and run them in limited concurrency
  for (const a of doc.querySelectorAll("a")) {
    await checkAnchor(a, url);
  }
}

// deno-lint-ignore require-await
async function checkAnchor(a: Element, url: URL) {
  const href = a.getAttribute("href")?.trim();
  if (!href) {
    hasInvalidHrefs = true;
    console.error(`Empty href on '${url.pathname}': ${a.outerHTML}`);
    return;
  }

  if (
    href.startsWith("http") || href.startsWith("mailto:") ||
    href.startsWith("vscode:")
  ) {
    return;
  }

  const aURL = new URL(href, url);
  if (aURL.pathname.startsWith("/api")) {
    return;
  }

  if (visitedPages.has(aURL.href)) {
    return;
  }

  visitedPages.add(aURL.href);

  return fetch(aURL).then((res) => {
    if (res.status === 200) {
      if (res.headers.get("content-type")?.includes("text/html")) {
        return res.text().then((text) => traversePage(aURL, text));
      }
    } else {
      hasInvalidHrefs = true;
      console.error(`${res.status} on '${url.pathname}': ${href}`);
    }

    return res.body?.cancel();
  });
}
