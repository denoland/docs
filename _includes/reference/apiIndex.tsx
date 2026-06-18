import type { Group } from "../../reference/_lib/group.ts";

export const layout = "doc.tsx";

export interface ApiIndexData {
  title: string;
  intro: string;
  aboutUrl: string;
  aboutLabel: string;
  allSymbolsUrl: string;
  groups: { title: string; url: string; slug: string; group: Group }[];
}

/** Landing page for one API kind: a dense, Ctrl+F-able index of every symbol,
 * grouped by category/module. Clicking a symbol jumps to its full docs on the
 * grouped reference page. */
export default function ApiIndex(
  { data, comp }: { data: ApiIndexData } & Lume.Data,
  _helpers: Lume.Helpers,
) {
  return (
    <main id="content" className="ddoc markdown-body" tabIndex={-1}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="!mb-0">{data.title}</h1>
        <p className="!my-0 text-sm whitespace-nowrap">
          <a href={data.aboutUrl}>{data.aboutLabel}</a>
          {" · "}
          <a href={data.allSymbolsUrl}>All symbols</a>
        </p>
      </div>
      <p className="mt-2 max-w-prose text-foreground-secondary">
        {data.intro}
      </p>

      {data.groups.map(({ title, url, slug, group }) => (
        <section key={slug} className="mt-8">
          <h2 id={slug} className="!mb-2 scroll-mt-16 !border-0">
            <a href={url} className="!text-foreground-primary hover:underline">
              {title}
            </a>
          </h2>
          <ul className="!list-none !pl-0 !my-0">
            {group.sections.flatMap((section) =>
              section.nodes.map((node) => (
                <li
                  key={node.name}
                  className="flex items-baseline gap-2 py-px !mt-0"
                  aria-label={node.deprecated ? "deprecated" : undefined}
                >
                  <comp.DocNodeKindIcon kinds={node.doc_node_kind_ctx} />
                  <a
                    href={node.href}
                    className={`font-mono text-sm whitespace-nowrap ${
                      node.deprecated ? "line-through opacity-60" : ""
                    }`}
                  >
                    {node.name}
                  </a>
                  {node.docs && (
                    <div
                      className="text-sm text-foreground-secondary line-clamp-1 [&_p]:inline [&_div]:inline min-w-0"
                      dangerouslySetInnerHTML={{ __html: node.docs }}
                    />
                  )}
                </li>
              ))
            )}
          </ul>
        </section>
      ))}
    </main>
  );
}
