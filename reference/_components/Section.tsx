import type { SectionCtx } from "@deno/doc";

export default function (
  { section, comp }: { comp: any; section: SectionCtx },
) {
  let content;

  switch (section.content.kind) {
    case "empty":
      break;
    case "namespace_section":
      content = (
        <comp.NamespaceSection namespaceSections={section.content.content} />
      );
      break;
    case "see":
      content = <comp.See sees={section.content.content} />;
      break;
    default: {
      content = (
        <div className="space-y-8">
          {section.content.content.map((item, i) => {
            let subcontent;
            switch (section.content.kind) {
              case "doc_entry":
                subcontent = <comp.DocEntry docEntry={item} />;
                break;
              case "example":
                subcontent = <comp.Example example={item} />;
                break;
              case "index_signature":
                subcontent = <comp.IndexSignature indexSignature={item} />;
                break;
              default:
                throw "unknown content type";
            }

            return (
              <>
                {subcontent}
                {section.content.kind === "example" &&
                  i !== (section.content.content.length - 1) && (
                  <div className="border-b border-gray-300" />
                )}
              </>
            );
          })}
        </div>
      );

      break;
    }
  }

  return (
    <section className="section" id={section.header?.anchor.id}>
      {section.header && (
        <>
          <h3 className="anchorable-heading">
            {section.header.href
              ? (
                <a href={section.header.href} className="contextLink">
                  {section.header.title}
                </a>
              )
              : (
                section.header.title
              )} <comp.Anchor anchor={section.header.anchor} />
          </h3>

          {/*markdown rendering*/}
          {section.header.doc && (
            <span dangerouslySetInnerHTML={{ __html: section.header.doc }} />
          )}
        </>
      )}

      {content}
    </section>
  );
}
