import type { PageBase, ToCCtx } from "@deno/doc";

export default function Base(
  { data, comp, children }: Lume.Data & { data: PageBase },
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <div className="ddoc">
        <link rel="stylesheet" href="/reference_styles.css" />
        <div>
          <comp.Breadcrumbs parts={data.breadcrumbs_ctx.parts} />

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
