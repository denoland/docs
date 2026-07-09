import type { PageBase } from "@deno/doc";

export default function Base(
  { data, comp, children }: Lume.Data & { data: PageBase },
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <div className="ddoc markdown-body">
        <comp.Breadcrumbs
          parts={data.breadcrumbs_ctx.parts}
          hasSubNav={false}
        />
        {children}
      </div>
    </>
  );
}
