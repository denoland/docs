import type { PageBase, ToCCtx } from "@deno/doc";

export const layout = "raw.tsx";

export default function Base(
  { data, comp, children }: Lume.Data & { data: PageBase },
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <comp.RefNav data={data} url="/reference" />
    <div className="ddoc">
      <link rel="stylesheet" href="/reference_styles.css" />
      <comp.CategoryPanel categoryPanel={data.categories_panel} />

      <div>
        <nav className="top-0 sticky bg-white z-50 py-3 h-14" id="topnav">
          <div className="h-full">
            <div>
              <comp.Breadcrumbs parts={data.breadcrumbs_ctx.parts} />
            </div>
          </div>
        </nav>

        <div id="content">
          {children}

          <div>
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
      </div>
    </div>
    </>
  );
}
