import type { NamespaceNodeCtx } from "@deno/doc";

export default function (
  { comp, namespaceSections }: {
    comp: any;
    namespaceNodeCtx: NamespaceNodeCtx[];
  },
) {
  return (
    <div className="namespaceSection">
      {namespaceSections.map((section) => (
        <div
          key={section.id}
          id={section.id}
          className="namespaceItem"
          aria-label={section.deprecated ? "deprecated" : undefined}
        >
          <comp.DocNodeKindIcon kinds={section.doc_node_kind_ctx} />

          <div className="namespaceItemContent">
            <a href={section.href} title={section.name}>
              {section.name}
            </a>

            <div className="namespaceItemContentDoc">
              {/*markdown rendering*/}
              {section.docs
                ? <span dangerouslySetInnerHTML={{ __html: section.docs }} />
                : <span className="italic">No documentation available</span>}
            </div>

            {section.subitems && (
              <ul className="namespaceItemContentSubItems">
                {section.subitems.map((subitem) => (
                  <li>
                    <a href={subitem.href}>{subitem.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
