import { join } from "@std/path";
import type { RequestHandler } from "lume/core/server.ts";

export default function createMarkdownSourceMiddleware(
  { root = "_site" }: { root?: string } = {},
): RequestHandler {
  const absoluteRoot = root.startsWith("/") ? root : join(Deno.cwd(), root);

  return async function markdownSourceMiddleware(req, next) {
    const pathname = new URL(req.url).pathname;

    // Case A: Direct .md URL request (e.g. /runtime/getting_started/installation.md)
    if (pathname.endsWith(".md")) {
      const filePath = join(absoluteRoot, pathname.slice(1));
      try {
        const file = await Deno.readFile(filePath);
        const headers = new Headers({
          "content-type": "text/markdown; charset=utf-8",
          "cache-control": "public, max-age=300",
        });
        return new Response(file, { headers });
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          return new Response("Not Found", { status: 404 });
        }
        console.error(`Failed serving ${pathname} from ${filePath}`, error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    // Case B: Accept: text/markdown header — content negotiation
    // Tools like Claude Code send this header when they prefer markdown over HTML
    const acceptHeader = req.headers.get("accept") ?? "";
    if (acceptHeader.includes("text/markdown")) {
      // Convert the HTML path to its .md equivalent
      // e.g. /runtime/getting_started/installation/ -> runtime/getting_started/installation.md
      const mdPath = pathname.replace(/\/$/, "") + ".md";
      const filePath = join(absoluteRoot, mdPath.slice(1));
      try {
        const file = await Deno.readFile(filePath);
        const headers = new Headers({
          "content-type": "text/markdown; charset=utf-8",
          "cache-control": "public, max-age=300",
        });
        return new Response(file, { headers });
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          // No .md source for this page (e.g. generated API reference) — serve HTML normally
          return next(req);
        }
        console.error(`Failed serving markdown for ${pathname}`, error);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return next(req);
  };
}
