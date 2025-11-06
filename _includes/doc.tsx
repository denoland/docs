import renderCommand from "./renderCommand.tsx";

export const layout = "layout.tsx";

export const ogImage = (data: Lume.Data) => `${data.url}/index.png`;

export default function Doc(data: Lume.Data, helpers: Lume.Helpers) {
  // Flags and simple derivations
  const API_LANDING = new Set(["/api/deno/", "/api/web/", "/api/node/"]);
  const isReference = data.url.startsWith("/api/");
  const isApiLandingPage = API_LANDING.has(data.url);
  const isExampleScript = Boolean(
    (data.page.data.content as { type?: string })?.type,
  );
  const isLintRule = data.url.startsWith("/lint/rules/");

  // Compute file path used by Feedback component
  const file = isLintRule
    ? `/lint/rules/${encodeURIComponent(data.title ?? "")}.md`
    : data.page.sourcePath;

  // Render command block and merge its TOC if present
  let renderedCommand: unknown = null;
  if (data.command) {
    const { rendered, toc } = renderCommand(data.command, helpers);
    renderedCommand = rendered;
    data.toc = toc.concat(...data.toc);
  }

  function getTocCtx(
    d: unknown,
  ): { document_navigation: unknown; document_navigation_str: string } | null {
    type Toc = {
      document_navigation: unknown;
      document_navigation_str: string;
    };
    const tocCtx: unknown = (d as {
      children?: { props?: { data?: { toc_ctx?: unknown } } };
    })?.children?.props?.data?.toc_ctx;
    if (
      tocCtx &&
      typeof tocCtx === "object" &&
      "document_navigation" in tocCtx &&
      "document_navigation_str" in tocCtx
    ) {
      return tocCtx as Toc;
    }
    return null;
  }

  const tocCtx = getTocCtx(data);

  return (
    <>
      <main
        id="content"
        class={`content ${isExampleScript ? "examples-content" : ""}`}
      >
        <div class="w-full">
          <article class="mx-auto">
            <data.comp.TableOfContentsMobile toc={data.toc} data={data} />

            <div
              data-color-mode="auto"
              data-light-theme="light"
              data-dark-theme="dark"
              class="markdown-body mt-6 sm:mt-6"
            >
              {!(isReference && !isApiLandingPage) && (
                <h1
                  dangerouslySetInnerHTML={{
                    __html: helpers.md(data.title!, true),
                  }}
                >
                </h1>
              )}
              {data.available_since && (
                <div class="bg-gray-200 rounded-md text-sm py-3 px-4 mb-4 font-semibold">
                  Available since {data.available_since}
                </div>
              )}
              {data.info && (
                <div class="admonition info">
                  <div class="title">Info</div>
                  <div
                    class="text-sm"
                    dangerouslySetInnerHTML={{
                      __html: helpers.md(data.info, true),
                    }}
                  />
                </div>
              )}
              {renderedCommand}
              {data.children}
            </div>
          </article>
          <data.comp.Feedback file={file} />
        </div>
      </main>
      {isReference && tocCtx && (
        <data.comp.RefToc
          documentNavigation={tocCtx.document_navigation}
          documentNavigationStr={tocCtx.document_navigation_str}
        />
      )}
    </>
  );
}
