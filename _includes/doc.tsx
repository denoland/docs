import renderCommand from "./renderCommand.tsx";

export const layout = "layout.tsx";

export default function Doc(data: Lume.Data, helpers: Lume.Helpers) {
  const file = data.page.sourcePath;

  const sidebar = data.sidebar;
  let renderedCommand = null;

  if (data.command) {
    const { rendered, toc } = renderCommand(data.command, helpers);
    renderedCommand = rendered;
    data.toc = toc.concat(...data.toc);
  }

  const isReference = data.url.startsWith("/api/");
  const isExamples = data.url.startsWith("/examples/");
  const isHome = data.url === "/";

  return (
    <div id="content" className="content">
      <div class="px-4 sm:px-5 md:px-6 max-w-full">
        <article class="mx-auto">
          {(!isExamples && !isHome && !isReference) && (
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
            class="markdown-body mt-4 rounded-lg"
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
      {!isReference && <data.comp.TableOfContents toc={data.toc} data={data} />}

      {(isReference && data.children.props.data.toc_ctx) && (
        <data.comp.RefToc
          documentNavigation={data.children.props.data.toc_ctx
            .document_navigation}
          documentNavigationStr={data.children.props.data.toc_ctx
            .document_navigation_str}
        />
      )}
    </div>
  );
}
