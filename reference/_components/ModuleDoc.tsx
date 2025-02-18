import type { ModuleDocCtx } from "@deno/doc";

export default function (
  { comp, moduleDoc }: { comp: any; moduleDoc: ModuleDocCtx },
) {
  return (
    <section>
      <div class="space-y-2 flex-1">
        {moduleDoc.deprecated && (
          <comp.Deprecated deprecated={moduleDoc.deprecated} />
        )}
        <comp.SymbolContent symbolContent={moduleDoc.sections} />
      </div>
    </section>
  );
}
