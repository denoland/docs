import type { SymbolGroupCtx } from "@deno/doc";

export default function (
  { comp, symbolGroup }: { comp: any; symbolGroup: SymbolGroupCtx },
) {
  return (
    <main className="symbolGroup" id={`symbol_${symbolGroup.name}`}>
      {symbolGroup.symbols.map((symbol, i) => (
        <article>
          <h1 className="ref-h1">
            <span className={`text-${symbol.kind.kind}`}>
              {symbol.kind.title_lowercase}
            </span>{" "}
            <span className="font-bold">{symbolGroup.name}</span>
          </h1>
          {symbol.subtitle && (
            <div className="symbolSubtitle">
              {symbol.subtitle.kind === "class"
                ? (
                  <comp.DocBlockSubtitleClass
                    subtitle={symbol.subtitle.value}
                  />
                )
                : (
                  <comp.DocBlockSubtitleInterface
                    subtitle={symbol.subtitle.value}
                  />
                )}
            </div>
          )}
          {(symbol.tags && symbol.tags.length > 0) && (
            <div className="space-x-2 !mt-2">
              {symbol.tags.map((tag) => <comp.Tag tag={tag} large />)}
            </div>
          )}

          {i === 0 && <comp.UsageLarge usage={symbol.usage} />}

          {symbol.deprecated && (
            <comp.Deprecated markdownContent={symbol.deprecated} />
          )}

          <div>
            {symbol.content.map((contentItem) => (
              contentItem.kind === "function"
                ? <comp.Function functionCtx={contentItem.value} />
                : <comp.SymbolContent symbolContent={contentItem.value} />
            ))}
          </div>
        </article>
      ))}
    </main>
  );
}
