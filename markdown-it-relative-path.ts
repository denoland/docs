// deno-lint-ignore-file no-explicit-any

export default function relativeLinksPlugin(md: any) {
  // Function to make a link relative
  function makeRelative(link: string, baseURL: string) {
    if (
      link.startsWith("http://") || link.startsWith("https://") ||
      link.startsWith("/") || link.startsWith("#") || link.startsWith("mailto:")
    ) {
      return link;
    }
    const url = new URL(link, baseURL);
    const pathname = url.pathname.replaceAll(/\/+/g, "/")
      .replace(/\/index.md$/, "/")
      .replace(/.md$/, "/");
    return pathname + url.search + url.hash;
  }

  // Ruler to parse links
  md.core.ruler.after("inline", "relative_links", function (state: any) {
    const basePath = state.env?.filename;
    if (!basePath) return;
    const baseURL = new URL(basePath, "https://docs.deno.com").href;

    state.tokens.forEach(function (blockToken: any) {
      if (blockToken.type === "inline" && blockToken.children) {
        blockToken.children.forEach(function (token: any) {
          // Process markdown links
          if (token.type === "link_open" || token.type === "image") {
            token.attrs.forEach(function (attr: any) {
              if (attr[0] === "href" || attr[0] === "src") {
                attr[1] = makeRelative(attr[1], baseURL);
              }
            });
          }
          // Process HTML img and video tags
          if (token.type === "html_inline" || token.type === "html_block") {
            token.content = (token.content as string).replace(
              /<(img|video)\b([^>]*)\bsrc=['"]([^'"]+)['"]/gi,
              (_, tag, attrs, src) => {
                return `<${tag}${attrs} src="${makeRelative(src, baseURL)}"`;
              },
            );
          }
        });
      }
    });
  });
}
