import type { IndexCtx } from "@deno/doc";

export const layout = "doc.tsx";

export default function Index(
  { data, comp }: { data: IndexCtx } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <comp.Base data={data} comp={comp}>
      <main>
        <comp.UsageLarge usages={data.usage} />
        {data.module_doc && <comp.ModuleDoc moduleDoc={data.module_doc} />}
        {data.overview &&
          <comp.SymbolContent symbolContent={data.overview} />}
      </main>
    </comp.Base>
  );
}
