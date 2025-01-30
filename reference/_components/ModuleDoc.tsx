import type { ModuleDocCtx } from "@deno/doc";

export default function (
  { comp, moduleDoc }: { comp: any; moduleDoc: ModuleDocCtx },
) {
  return (
    <section>
      {moduleDoc.deprecated && (
        <comp.Deprecated deprecated={moduleDoc.deprecated} />
      )}
      <comp.SymbolContent symbolContent={moduleDoc.sections} />
    </section>
  );
}
