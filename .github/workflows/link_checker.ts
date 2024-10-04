import { DOMParser } from "jsr:@b-fuze/deno-dom";

const visitedPages = new Set<string>();

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
        invalidUrls.push(`Missing href in ${url.pathname}: ${a.outerHTML}`);
        return;
      }

      if (href.startsWith("http") || href.startsWith("mailto")) {
        return;
      }

      const aURL = new URL(href, url);
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
          invalidUrls.push(
            `${res.status} on '${url.pathname}': ${href} ${aURL}`,
          );
        }

        return res.body?.cancel();
      });
    }));
}
