import type { PageBase, ToCCtx } from "@deno/doc";

export default function Base(
  { data, comp, children }: Lume.Data & { data: PageBase },
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <div className="ddoc markdown-body">
        <link rel="stylesheet" href="/reference_styles.css" />
        <comp.Breadcrumbs parts={data.breadcrumbs_ctx.parts} />
        <div id="content">
          {children}
        </div>
      </div>
    </>
  );
}
