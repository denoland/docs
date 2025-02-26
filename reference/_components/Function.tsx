import type { FunctionCtx } from "@deno/doc";

export default function (
  { functionCtx, comp }: { comp: any; functionCtx: FunctionCtx },
) {
  return (
    <div className="mt-3">
      {functionCtx.functions.map((func, index) => (
        <>
          {functionCtx.functions.length > 1 && <h2>Overload {index + 1}</h2>}
          <div className="scroll-mt-16" id={func.id}>
            <code
              className={`anchorable break-words inline-code-block`}
            >
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
        </>
      ))}
    </div>
  );
}
