import type { SymbolPageCtx } from "@deno/doc";

export const layout = "reference/base.tsx";

export default function Symbol(
  { data, comp }: { data: SymbolPageCtx } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return <comp.SymbolGroup symbolGroup={data.symbol_group_ctx} />;
}
