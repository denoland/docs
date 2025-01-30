import type { PageBase, ToCCtx } from "@deno/doc";

export const layout = "raw.tsx";

export default function Base(
  { data, comp, children }: Lume.Data & { data: PageBase },
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <comp.CategoryPanel
        categoryPanel={data.categories_panel}
        url={data.url}
      />
      <div className="absolute top-16 bottom-0 left-0 right-0 xl:left-74 xl:right-74 overflow-y-auto mx-auto px-4 sm:px-5 md:px-6 max-w-xl;
      
      ">
        <nav className="mb-4">
          <comp.Breadcrumbs parts={data.breadcrumbs_ctx.parts} />
        </nav>
        <main id="content" className="markdown-body mt-4 rounded-lg">
          {(() => {
            const name = data.breadcrumbs_ctx
              .parts[data.breadcrumbs_ctx.parts.length - 1].name;
            return <h1>{name}</h1>;
          })()}
          {children}
        </main>
      </div>
      {"toc_ctx" in data && (
        <comp.Toc
          documentNavigation={(data.toc_ctx as ToCCtx)
            .document_navigation}
          documentNavigationStr={(data.toc_ctx as ToCCtx)
            .document_navigation_str}
        />
      )}
    </>
  );
}
