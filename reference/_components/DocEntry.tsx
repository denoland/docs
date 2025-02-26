import type { DocEntryCtx } from "@deno/doc";

export default function (
  { comp, docEntry }: { comp: any; docEntry: DocEntryCtx },
) {
  return (
    <div
      class={(docEntry.name ? "anchorable" : "") + " docEntry"}
      id={docEntry.id}
    >
      <div className="docEntryHeader">
        {docEntry.tags && docEntry.tags.length > 0 && (
          <div className="space-x-1 mb-1">
            {docEntry.tags.map((tag) => <comp.Tag tag={tag} />)}
          </div>
        )}

        {/* Chosen 200 as a guestimate of when code is blocks rather than inline, would be better if this was in the markup sent from ddoc */}
        <code
          className={docEntry.content.length > 200 ? "inline-code-block" : ""}
        >
          {docEntry.name && <comp.Anchor anchor={docEntry.anchor} />}

          {docEntry.name_href
            ? (
              <a className="font-bold font-lg link" href={docEntry.name_href}>
                {docEntry.name}
              </a>
            )
            : (
              docEntry.name && (
                <span className="font-bold font-lg">{docEntry.name}</span>
              )
            )}
          {/*typedef rendering*/}
          <span
            className="font-medium"
            dangerouslySetInnerHTML={{ __html: docEntry.content }}
          />
        </code>
      </div>

      {/*markdown rendering*/}
      {docEntry.js_doc && (
        <div
          className="max-w-[75ch]"
          dangerouslySetInnerHTML={{ __html: docEntry.js_doc }}
        />
      )}
    </div>
  );
}
