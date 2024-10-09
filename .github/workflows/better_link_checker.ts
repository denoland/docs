import process from "node:process";
import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";

class PageIndexer {
  public visitedPages: Set<string>;
  public failedPages: Set<string>;

  private indexQueue: string[];
  private parser: DOMParser;
  private rootUrl: URL;

  private excludedPaths: string[];
  private excludedExtensions: string[];
  private excludedProtocolPrefixes: string[];

  public anyErrors = false;
  private log = false;

  constructor(rootUrl: URL, log: boolean = false) {
    this.log = log;
    this.indexQueue = [];
    this.visitedPages = new Set<string>();
    this.failedPages = new Set<string>();
    this.parser = new DOMParser();
    this.rootUrl = rootUrl;
    this.excludedPaths = ["/api"];
    this.excludedExtensions = [
      ".ts",
      ".js",
      ".svg",
      ".json",
      ".png",
      ".css",
      ".ico",
      ".xml",
      "robots.txt",
    ];
    this.excludedProtocolPrefixes = [
      "mailto",
      "vscode:",
    ];
  }

  public async check() {
    console.log("Checking links from", this.rootUrl.href);
    this.indexQueue.push(this.rootUrl.href);

    for await (const [url, content] of this.processIndexQueue()) {
      this.log && console.debug(url, "Processing");
      !this.log && process.stdout.write(".");

      const pageLinks = await this.extractPageLinks(url, content);
      const toProcess = pageLinks.filter((link) =>
        !this.alreadyProcessed(link.href) &&
        !this.indexQueue.includes(link.href)
      );
      const newQueueItems = toProcess.map((link) => link.href);

      this.indexQueue.push(...newQueueItems);
      this.log &&
        console.debug(
          url,
          "Found",
          pageLinks.length,
          "links",
          "Queued",
          toProcess.length,
          "new links",
        );
    }

    !this.log && process.stdout.write("\n");
    return this.anyErrors ? 1 : 0;
  }

  private async *processIndexQueue() {
    while (this.indexQueue.length > 0) {
      const url = this.indexQueue.pop();
      if (!url || this.alreadyProcessed(url)) {
        continue;
      }

      this.log && console.debug("Processing queue item", url);

      const response = await fetch(url);

      if (response.status !== 200) {
        this.log && console.error(`${response.status} loading '${url}'`);
        this.failedPages.add(url);
        this.anyErrors = true;
        continue;
      }

      if (!response.headers.get("content-type")?.includes("text/html")) {
        continue;
      }

      const content = await response.text();
      this.visitedPages.add(url);

      yield [url, content];
    }
  }

  public extractPageLinks(pageUrl: string, content: string) {
    const doc = this.parser.parseFromString(content, "text/html");

    const aElements = [...doc.querySelectorAll("a")];

    this.log && console.debug("Found", aElements.length, "links on", pageUrl);

    const emptyLinks = aElements.filter((a) => !a.getAttribute("href")?.trim());
    const pageLinkStrings: string[] = aElements.map((a) =>
      a.getAttribute("href")?.trim()
    )
      .map((href) => href?.split("#")[0]!)
      .filter((href) => href)
      .filter((value, index, self) => self.indexOf(value) === index)
      .filter((href) => href?.length > 0);

    const pageLinks = pageLinkStrings.map((href) => {
      return href.startsWith("/") ? new URL(href, this.rootUrl) : new URL(href);
    });

    this.displayAnyEmptyLinkErrors(emptyLinks, pageUrl);

    return pageLinks.filter((link) => this.isCheckableLink(link));
  }

  private isCheckableLink(url: URL) {
    return !this.excludedProtocolPrefixes.some((prefix) =>
      url.href.startsWith(prefix)
    ) &&
      !this.excludedPaths.some((path) => url.pathname.startsWith(path)) &&
      !this.excludedExtensions.some((ext) => url.pathname.endsWith(ext)) &&
      url.href.startsWith(this.rootUrl.href);
  }

  private alreadyProcessed(url: string) {
    return this.visitedPages.has(url) || this.failedPages.has(url);
  }

  private displayAnyEmptyLinkErrors(emptyLinks: Element[], pageUrl: string) {
    if (emptyLinks.length > 0) {
      this.anyErrors = true;
      for (const link of emptyLinks) {
        console.warn(`Empty href on '${pageUrl}': ${link.outerHTML}`);
      }
    }
  }
}

// Entrypoint

const debug = Deno.env.get("DEBUG") === "true";
const verbose = Deno.env.get("VERBOSE") === "true";
const baseUrlString = Deno.env.get("DOCS_ROOT") || "http://localhost:8000";
const rootURL = new URL(baseUrlString!);

console.time("Link Checker");

const indexer = new PageIndexer(rootURL, debug);
const result = await indexer.check();

console.timeEnd("Link Checker");
console.log(
  "Distinct Pages checked:",
  indexer.visitedPages.size + indexer.failedPages.size,
);
console.log("Successful Pages:", indexer.visitedPages.size);
console.log("Failed Pages:", indexer.failedPages.size);

if (verbose) {
  console.log("Successful Pages:");
  console.log([...indexer.visitedPages].join("\n"));
}

if (result !== 0) {
  console.error("Errors were found!");
  console.error(
    "Pages that were linked to but failed to load:",
    indexer.failedPages,
  );
}

Deno.exit(result);
