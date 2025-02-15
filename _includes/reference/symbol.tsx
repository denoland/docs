import type { SymbolPageCtx } from "@deno/doc";
export const layout = "doc.tsx";

export default function Symbol(
  { data, comp }: { data: SymbolPageCtx } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <comp.Base data={data} comp={comp}>
      <comp.SymbolGroup symbolGroup={data.symbol_group_ctx} />;
    </comp.Base>
  );
}
