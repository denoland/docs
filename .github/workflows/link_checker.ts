import { DOMParser } from "jsr:@b-fuze/deno-dom";

const visitedPages = new Set<URL>();

const rootURL = new URL(Deno.env.get("DOCS_ROOT")!);
const rootPage = await fetch(rootURL).then((res) => res.text());

visitedPages.add(rootURL);
const invalidUrls: string[] = [];

await traversePage(rootURL, rootPage);

if (invalidUrls.length > 0) {
  for (const invalidUrl of invalidUrls) {
    console.error(invalidUrl);
  }
  Deno.exit(1);
}

async function traversePage(url: URL, content: string) {
  const doc = new DOMParser().parseFromString(content, "text/html");
  await Promise.allSettled([...doc.querySelectorAll("a").values()]
    .map((a) => {
      const href = a.getAttribute("href");
      if (!href) {
        console.error(`Empty href in ${url.pathname}`);
        Deno.exit(1);
      }

      if (href.startsWith("http") || href.startsWith("mailto")) {
        return;
      }

      const aURL = new URL(href, url);
      if (visitedPages.has(aURL)) {
        return;
      }

      visitedPages.add(aURL);

      return fetch(aURL).then((res) => {
        if (res.status === 200) {
          if (res.headers.get("content-type")?.includes("text/html")) {
            return res.text().then((text) => traversePage(aURL, text));
          }
        } else {
          invalidUrls.push(
            `${res.status} on '${url.pathname}': ${href} ${aURL}`,
          );
        }
      });
    }));
}
