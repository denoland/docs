import type { AllSymbolsCtx } from "@deno/doc";

export const layout = "doc.tsx";

export default function AllSymbols(
  { comp, data }: { data: AllSymbolsCtx } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <comp.Base data={data} comp={comp}>
      <main>
        <comp.SymbolContent symbolContent={data.content} />
      </main>
    </comp.Base>
  );
}
