import { join } from "@std/path";
import type { RequestHandler } from "lume/core/server.ts";

interface LlmsFilesMiddlewareOptions {
  /**
   * Directory where the built static assets live. This should match the
   * destination directory configured for Lume ("_site" by default).
   */
  root?: string;
}

const LLMS_CONTENT_TYPES = new Map<string, string>([
  ["/llms.txt", "text/plain; charset=utf-8"],
  ["/llms-summary.txt", "text/plain; charset=utf-8"],
  ["/llms-full.txt", "text/plain; charset=utf-8"],
  ["/llms.json", "application/json; charset=utf-8"],
]);

export default function createLlmsFilesMiddleware(
  { root = "_site" }: LlmsFilesMiddlewareOptions = {},
): RequestHandler {
  const absoluteRoot = root.startsWith("/") ? root : join(Deno.cwd(), root);

  return async function llmsFilesMiddleware(req, next) {
    const pathname = new URL(req.url).pathname;
    const contentType = LLMS_CONTENT_TYPES.get(pathname);

    if (!contentType) {
      return next(req);
    }

    const filePath = join(absoluteRoot, pathname.slice(1));

    try {
      const file = await Deno.readFile(filePath);
      const headers = new Headers({
        "content-type": contentType,
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
  };
}
