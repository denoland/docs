import type { Group } from "../../reference/_lib/group.ts";

export const layout = "doc.tsx";

/** A grouped reference page: every symbol of a category (Deno, Web) or
 * module (Node) documented on a single page — a symbol index up top,
 * full documentation below. */
export default function MultiSymbol(
  { data, comp }: { data: Group } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <comp.Base data={{ breadcrumbs_ctx: data.breadcrumbs }} comp={comp}>
      <div className="multiSymbolPage">
        <header>
          <h1 className="ref-h1">{data.title}</h1>
          {data.docs && <div dangerouslySetInnerHTML={{ __html: data.docs }} />}
          <comp.UsageLarge usages={data.usage} />
        </header>

        <section className="mt-8" id="symbol-index">
          {data.sections.map((section) => (
            <div className="mb-6">
              <h2 className="ref-h2" id={section.anchor}>{section.title}</h2>
              <comp.NamespaceSection namespaceSections={section.nodes} />
            </div>
          ))}
        </section>

        <hr className="my-10" />

        <section id="symbol-docs">
          {data.symbols.map((symbol) => (
            <SymbolDivider comp={comp} symbol={symbol} />
          ))}
        </section>
      </div>
    </comp.Base>
  );
}

function SymbolDivider(
  // deno-lint-ignore no-explicit-any
  { comp, symbol }: { comp: any; symbol: Group["symbols"][number] },
) {
  return (
    <>
      <comp.SymbolArticle symbol={symbol} />
      <hr className="my-10 last:hidden" />
    </>
  );
}
