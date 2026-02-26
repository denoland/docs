import { join } from "@std/path";
import { log } from "lume/core/utils/log.ts";
import type { RequestHandler } from "lume/core/server.ts";

interface MarkdownSourceMiddlewareOptions {
  /** Directory where the built static assets live. */
  root?: string;
}

/** Reads a markdown file and returns a Response, or null if not found. Throws on other errors. */
async function serveMarkdownFile(
  filePath: string,
  absoluteRoot: string,
): Promise<Response | null> {
  if (!filePath.startsWith(absoluteRoot + "/")) {
    return new Response("Forbidden", { status: 403 });
  }
  try {
    const file = await Deno.readFile(filePath);
    return new Response(file, {
      headers: new Headers({
        "content-type": "text/markdown; charset=utf-8",
        "cache-control": "public, max-age=300",
      }),
    });
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return null;
    }
    throw error;
  }
}

export default function createMarkdownSourceMiddleware(
  { root = "_site" }: MarkdownSourceMiddlewareOptions = {},
): RequestHandler {
  const absoluteRoot = root.startsWith("/") ? root : join(Deno.cwd(), root);

  return async function markdownSourceMiddleware(req, next) {
    const pathname = new URL(req.url).pathname;

    // Case A: Direct .md URL request (e.g. /runtime/getting_started/installation.md)
    if (pathname.endsWith(".md")) {
      const filePath = join(absoluteRoot, pathname.slice(1));
      try {
        const response = await serveMarkdownFile(filePath, absoluteRoot);
        if (response) return response;
        // Fallback: /foo/bar.md → /foo/bar/index.md (for index.md source files)
        const indexPath = filePath.replace(/\.md$/, "/index.md");
        const indexResponse = await serveMarkdownFile(indexPath, absoluteRoot);
        return indexResponse ?? next(req);
      } catch (error) {
        log.error(`Failed serving ${pathname} from ${filePath}: ${error}`);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    // Case B: Accept: text/markdown header — content negotiation
    // Tools like Claude Code send this header when they prefer markdown over HTML
    const acceptHeader = req.headers.get("accept") ?? "";
    if (
      acceptHeader.includes("text/markdown") &&
      !acceptHeader.includes("text/html")
    ) {
      // Convert the HTML path to its .md equivalent
      // e.g. /runtime/getting_started/installation/ -> /runtime/getting_started/installation.md
      // Also try the index.md variant for directory-style URLs (e.g. /runtime/contributing/)
      const mdPath = pathname.replace(/\/$/, "") + ".md";
      const mdIndexPath = pathname.replace(/\/$/, "") + "/index.md";
      const filePath = join(absoluteRoot, mdPath.slice(1));
      const indexFilePath = join(absoluteRoot, mdIndexPath.slice(1));
      try {
        const response = (await serveMarkdownFile(filePath, absoluteRoot)) ??
          (await serveMarkdownFile(indexFilePath, absoluteRoot));
        if (response) {
          // Add Vary: Accept so caches don't serve this markdown to requests that want HTML
          response.headers.set("vary", "Accept");
          return response;
        }
        // No .md source for this page (e.g. generated API reference) — serve HTML normally.
        // Add Vary: Accept so HTTP caches don't serve this HTML to markdown-only requests.
        const htmlResponse = await next(req);
        const headers = new Headers(htmlResponse.headers);
        headers.set("vary", "Accept");
        return new Response(htmlResponse.body, {
          status: htmlResponse.status,
          statusText: htmlResponse.statusText,
          headers,
        });
      } catch (error) {
        log.error(`Failed serving markdown for ${pathname}: ${error}`);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return next(req);
  };
}
