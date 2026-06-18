import type { GroupSymbol } from "../_lib/group.ts";

/** Full documentation for one root symbol on a grouped reference page.
 * Adapted from SymbolGroup.tsx, but heading at h2 level with a stable anchor
 * so many symbols can share a page. */
export default function (
  // deno-lint-ignore no-explicit-any
  { comp, symbol }: { comp: any; symbol: GroupSymbol },
) {
  const group = symbol.symbolGroup;
  return (
    <article className="symbolGroup scroll-mt-16" id={symbol.anchor}>
      {group.symbols.map((item, i) => (
        <div>
          <h2 className="ref-h1">
            <span className={`text-${item.kind.kind}`}>
              {item.kind.title_lowercase}
            </span>{" "}
            <a
              href={`#${symbol.anchor}`}
              className="font-bold !text-foreground-primary hover:underline"
            >
              {group.name}
            </a>
          </h2>
          {item.subtitle && (
            <div className="symbolSubtitle">
              {item.subtitle.kind === "class"
                ? <comp.DocBlockSubtitleClass subtitle={item.subtitle.value} />
                : (
                  <comp.DocBlockSubtitleInterface
                    subtitle={item.subtitle.value}
                  />
                )}
            </div>
          )}
          {(item.tags && item.tags.length > 0) && (
            <div className="space-x-2 !mt-2">
              {item.tags.map((tag) => (
                <comp.Tag key={tag.kind} tag={tag} large />
              ))}
            </div>
          )}

          {i === 0 && <comp.UsageLarge usages={item.usage} />}

          {item.deprecated && (
            <comp.Deprecated markdownContent={item.deprecated} />
          )}

          <div>
            {item.content.map((contentItem) => (
              contentItem.kind === "function"
                ? <comp.Function functionCtx={contentItem.value} />
                : <comp.SymbolContent symbolContent={contentItem.value} />
            ))}
          </div>
        </div>
      ))}
    </article>
  );
}
