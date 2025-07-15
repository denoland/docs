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
  const isExamples = data.url.startsWith("/examples/");
  const isExampleScript = (data.page.data.content as { type?: string })?.type;
  const isLintRule = data.url.startsWith("/lint/rules/");
  const isHome = data.url === "/";

  const hasBreadcrumbs = !isExamples && !isHome && !isReference;

  if (isLintRule) {
    file = `/lint/rules/${encodeURIComponent(data.title ?? "")}.md`;
  }

  return (
    <main
      id="content"
      class={isExampleScript ? "examples-content" : "content"}
    >
      <div class="w-full">
        <article class="mx-auto">
          {hasBreadcrumbs && (
            <data.comp.Breadcrumbs
              title={data.title!}
              sidebar={sidebar}
              url={data.url}
              sectionTitle={data.sectionTitle!}
              sectionHref={data.sectionHref!}
            />
          )}

          <data.comp.TableOfContentsMobile toc={data.toc} data={data} />

          <div
            data-color-mode="auto"
            data-light-theme="light"
            data-dark-theme="dark"
            class="markdown-body mt-4 sm:mt-6"
          >
            {!isReference && (
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
            {renderedCommand}
            {data.children}
          </div>
        </article>
        {!isReference && <data.comp.Feedback file={file} />}
      </div>

      {(isReference && data.children.props.data.toc_ctx) && (
        <data.comp.RefToc
          documentNavigation={data.children.props.data.toc_ctx
            .document_navigation}
          documentNavigationStr={data.children.props.data.toc_ctx
            .document_navigation_str}
        />
      )}
    </main>
  );
}
