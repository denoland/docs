import type { IndexCtx } from "@deno/doc";

export const layout = "reference/base.tsx";

export default function Index(
  { data, comp }: { data: IndexCtx } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <>
      <comp.UsageLarge usages={data.usage} />
      {data.module_doc && <comp.ModuleDoc moduleDoc={data.module_doc} />}
      {data.overview &&
        <comp.SymbolContent symbolContent={data.overview} />}
    </>
  );
}
