import type {
  PreviewMember,
  PreviewSymbol,
} from "../../reference/preview.page.ts";

export const layout = "doc.tsx";

interface PreviewData {
  module: string;
  usage: string;
  symbols: PreviewSymbol[];
  kindOrder: string[];
  kindTitles: Record<string, string>;
}

/** PROTOTYPE layout: Node.js-docs-style prose-first rendering, fed from raw
 * doc nodes instead of @deno/doc's pre-rendered HTML. */
export default function Preview(
  { data }: { data: PreviewData } & Lume.Data,
  helpers: Lume.Helpers,
) {
  const md = (text: string | null) =>
    text
      ? (
        <div
          className="max-w-prose"
          dangerouslySetInnerHTML={{ __html: helpers.md(text) }}
        />
      )
      : null;

  const sinceBadge = (since: string | null) =>
    since && (
      <p className="!mt-0 !mb-2 text-xs text-foreground-secondary">
        Added in: {since}
      </p>
    );

  const deprecatedBadge = (deprecated: string | null) =>
    deprecated !== null && (
      <div className="admonition caution">
        <div className="title">Deprecated</div>
        {md(deprecated || "This API is deprecated.")}
      </div>
    );

  const member = (m: PreviewMember) => (
    <section key={m.anchor} className="mt-6" id={m.anchor}>
      <h4 className="!mb-1 scroll-mt-16">
        <a href={`#${m.anchor}`} className="!text-foreground-primary">
          <code>{m.signature}</code>
        </a>
      </h4>
      {sinceBadge(m.since)}
      {m.returnType && (
        <p className="!my-1 text-sm text-foreground-secondary">
          Returns: <code>{m.returnType}</code>
        </p>
      )}
      {deprecatedBadge(m.deprecated)}
      {md(m.doc)}
    </section>
  );

  return (
    <div className="ddoc markdown-body">
      <main id="content" tabIndex={-1}>
        <h1>
          <code>node:{data.module}</code>
        </h1>
        <div className="admonition info">
          <div className="title">Renderer preview</div>
          <p>
            This page is a prototype of rendering reference docs directly from
            raw doc nodes, side by side with{" "}
            <a href={`/api/node/${data.module}/`}>the current renderer</a>.
          </p>
        </div>
        <pre><code>{data.usage}</code></pre>

        {data.kindOrder.map((kind) => {
          const group = data.symbols.filter((s) => s.kind === kind);
          if (group.length === 0) return null;
          return (
            <section key={kind} className="mt-10">
              <h2 id={`kind-${kind}`} className="scroll-mt-16">
                {data.kindTitles[kind]}
              </h2>
              {group.map((symbol) => (
                <article
                  key={symbol.anchor}
                  className="mt-8 pb-6 border-b border-foreground-tertiary"
                  id={symbol.anchor}
                >
                  <h3 className="scroll-mt-16">
                    <a
                      href={`#${symbol.anchor}`}
                      className="!text-foreground-primary"
                    >
                      <code>{symbol.heading}</code>
                    </a>
                  </h3>
                  {sinceBadge(symbol.since)}
                  {symbol.signature && (
                    <pre><code>{symbol.signature}</code></pre>
                  )}
                  {symbol.returnType && symbol.kind !== "class" && (
                    <p className="!my-1 text-sm text-foreground-secondary">
                      {symbol.kind === "function" ? "Returns" : "Type"}:{" "}
                      <code>{symbol.returnType}</code>
                    </p>
                  )}
                  {deprecatedBadge(symbol.deprecated)}
                  {md(symbol.doc)}
                  {symbol.members.map(member)}
                </article>
              ))}
            </section>
          );
        })}
      </main>
    </div>
  );
}
