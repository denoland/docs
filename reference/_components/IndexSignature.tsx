import type { DocEntryCtx } from "@deno/doc";

export default function (
  { comp, indexSignature }: { comp: any; indexSignature: DocEntryCtx },
) {
  return (
    <div className="anchorable text-sm" id={indexSignature.id}>
      <comp.Anchor anchor={indexSignature.anchor} />
      {indexSignature.readonly && <span>readonly</span>}
      {/* param rendering */}
      [<span dangerouslySetInnerHTML={{ __html: indexSignature.params }}>
      </span>]
      {/* typedef rendering */}
      <span dangerouslySetInnerHTML={{ __html: indexSignature.ts_type }} />
    </div>
  );
}
