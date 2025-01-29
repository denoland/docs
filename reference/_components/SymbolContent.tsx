import type { SymbolContentCtx } from "@deno/doc";

export default function (
  { symbolContent, comp }: { comp: any; symbolContent: SymbolContentCtx },
) {
  return (
    <div class="space-y-7" id={symbolContent.id}>
      {/*markdown rendering*/}
      {symbolContent.docs && (
        <div dangerouslySetInnerHTML={{ __html: symbolContent.docs }} />
      )}

      {symbolContent.sections.map((section) => (
        <comp.Section section={section} />
      ))}
    </div>
  );
}
