import renderCommand from "./renderCommand.tsx";

export const layout = "layout.tsx";

export const ogImage = (data: Lume.Data) => {
  return data.url + "/index.png";
};

export default function Doc(data: Lume.Data, helpers: Lume.Helpers) {
  let file = data.page.sourcePath;
  const sidebar = data.sidebar;
  let renderedCommand = null;

  if (data.command) {
    const { rendered, toc } = renderCommand(data.command, helpers);
    renderedCommand = rendered;
    data.toc = toc.concat(...data.toc);
  }

  const isReference = data.url.startsWith("/api/");
  const isApiLandingPage = ["/api/deno/", "/api/web/", "/api/node/"].includes(
    data.url,
  );
  const isExamples = data.url.startsWith("/examples/");
  const isExampleScript = (data.page.data.content as { type?: string })?.type;
  const isLintRule = data.url.startsWith("/lint/rules/");
  const isHome = data.url === "/";

  const hasBreadcrumbs = !isExamples && !isHome &&
    !(isReference && !isApiLandingPage);

  if (isLintRule) {
    file = `/lint/rules/${encodeURIComponent(data.title ?? "")}.md`;
  }

  function getTocCtx(
    d: Lume.Data,
  ): { document_navigation: unknown; document_navigation_str: string } | null {
    const ch: unknown = (d as unknown as { children?: unknown })?.children;
    if (ch && typeof ch === "object" && "props" in ch) {
      const props: unknown = (ch as { props?: unknown }).props;
      if (props && typeof props === "object" && "data" in props) {
        const pdata: unknown = (props as { data?: unknown }).data;
        if (pdata && typeof pdata === "object" && "toc_ctx" in pdata) {
          const toc: unknown = (pdata as { toc_ctx?: unknown }).toc_ctx;
          if (
            toc && typeof toc === "object" &&
            "document_navigation" in toc &&
            "document_navigation_str" in toc
          ) {
            const t = toc as {
              document_navigation: unknown;
              document_navigation_str: string;
            };
            return t;
          }
        }
      }
    }
    return null;
  }

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
      {(() => {
        const tocCtx = getTocCtx(data);
        return isReference && tocCtx
          ? (
            <data.comp.RefToc
              documentNavigation={tocCtx.document_navigation}
              documentNavigationStr={tocCtx.document_navigation_str}
            />
          )
          : null;
      })()}
    </>
  );
}
