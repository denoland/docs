import type { AllSymbolsCtx } from "@deno/doc";

export const layout = "reference/base.tsx";

export default function AllSymbols(
  { comp, data }: { data: AllSymbolsCtx } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <comp.SymbolContent symbolContent={data.content} />
    </>
  );
}
