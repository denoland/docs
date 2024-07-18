import type { Middleware } from "lume/core/server.ts";
import { parseMediaType } from "https://jsr.io/@std/media-types/1.0.1/parse_media_type.ts";

export const apiDocumentContentTypeMiddleware: Middleware = async (
  request,
  next,
) => {
  const response = await next(request);

  // Requests to API docs located under `/api` should all be served as HTML with
  // a few exceptions like `/api/deno/page.css` or `/api/web/script.js`.
  // We need to explicitly set the content type here because some file names
  // confuse the MIME type detection - for example, the file name
  // `Deno.Kv.prototype.list` is inferred as `text/plain` but it should be
  // `text/html` for browsers to render it correctly.
  const requestToApiDoc = new URL(request.url).pathname.startsWith("/api");
  const contentTypeSetToCssOrJs = isCssOrJs(
    response.headers.get("content-type"),
  );
  if (requestToApiDoc && !contentTypeSetToCssOrJs) {
    response.headers.set("content-type", "text/html; charset=utf-8");
  }

  return response;
};

function isCssOrJs(contentType: string | null): boolean {
  if (contentType === null) {
    return false;
  }

  const [mime] = parseMediaType(contentType);
  return ["text/css", "text/javascript", "application/javascript"].includes(
    mime,
  );
}
