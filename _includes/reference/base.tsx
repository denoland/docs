import type { PageBase, ToCCtx } from "@deno/doc";

export const layout = "raw.tsx";

export default function Base(
  { data, comp, children }: Lume.Data & { data: PageBase },
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <comp.CategoryPanel categoryPanel={data.categories_panel} />
      <div className="absolute top-16 bottom-0 left-0 right-0 xl:left-74 overflow-y-auto xl:grid xl:grid-cols-7 xl:gap-8 mx-auto">

        <nav className="top-0 sticky bg-white z-50 py-3 h-14" id="topnav">
          <div className="h-full">
            <comp.Breadcrumbs parts={data.breadcrumbs_ctx.parts} />
          </div>
        </nav>

        <div id="content">
          {children}

          {"toc_ctx" in data && (
            <comp.Toc
              documentNavigation={(data.toc_ctx as ToCCtx)
                .document_navigation}
              documentNavigationStr={(data.toc_ctx as ToCCtx)
                .document_navigation_str}
            />
          )}
        </div>
      </div>
    </>
  );
}
