import type { FunctionCtx } from "@deno/doc";

export default function (
  { functionCtx, comp }: { comp: any; functionCtx: FunctionCtx },
) {
  return (
    <div className="mt-3 space-y-8">
      {functionCtx.functions.map((func, index) => (
        <>
          <div className="scroll-mt-16" id={func.id}>
            <code className="anchorable text-base break-words">
              <comp.Anchor anchor={func.anchor} />
              <span className="font-bold">{func.name}</span>

              {/*markdown rendering*/}
              <span
                className="font-medium"
                dangerouslySetInnerHTML={{ __html: func.summary }}
              />
            </code>

            {func.deprecated && (
              <comp.Deprecated
                deprecated={func.deprecated}
              />
            )}
            <comp.SymbolContent symbolContent={func.content} />
          </div>
          {index !== (functionCtx.functions.length - 1) && (
            <div className="border-b border-gray-300 max-w-[75ch]" />
          )}
        </>
      ))}
    </div>
  );
}
