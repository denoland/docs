import { DOMParser } from "jsr:@b-fuze/deno-dom";
import RunQueue from "npm:run-queue@2";

const visitedPages = new Set<string>();
const queue = new RunQueue({ maxConcurrency: 10 });

const rootURL = new URL(Deno.env.get("DOCS_ROOT")!);
const rootPage = await fetch(rootURL).then((res) => res.text());

visitedPages.add(rootURL.href);
let hasInvalidHrefs = false;

traversePage(rootURL, rootPage);

await queue.run();

console.log("Total pages checked:", visitedPages.size);

if (hasInvalidHrefs) {
  Deno.exit(1);
}

function traversePage(url: URL, content: string) {
  console.log("Checking", url.href);
  const doc = new DOMParser().parseFromString(content, "text/html");
  for (const a of doc.querySelectorAll("a")) {
    const href = a.getAttribute("href")?.trim();
    if (!href) {
      hasInvalidHrefs = true;
      console.error(`Empty href on '${url.pathname}': ${a.outerHTML}`);
      continue;
    }

    if (
      href.startsWith("http") || href.startsWith("mailto") ||
      href.startsWith("vscode:")
    ) {
      continue;
    }

    const aURL = new URL(href, url);
    if (aURL.pathname.startsWith("/api")) {
      continue;
    }

    aURL.hash = "";

    if (visitedPages.has(aURL.href)) {
      continue;
    }
    visitedPages.add(aURL.href);
    queue.add(0, fetchUrl, [href, aURL, url]);
  }
}

function fetchUrl(href: string, urlToCheck: URL, baseUrl: URL) {
  return fetch(urlToCheck).then((res) => {
    if (res.status === 200) {
      if (res.headers.get("content-type")?.includes("text/html")) {
        return res.text().then((text) => traversePage(urlToCheck, text));
      }
    } else {
      hasInvalidHrefs = true;
      console.error(`${res.status} on '${baseUrl.pathname}': ${href}`);
    }

    return res.body?.cancel();
  });
}
