import { DocNode, DocNodeImport } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";

type Props = { item: SymbolDoc<DocNodeImport>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeImport>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <Import item={item} context={context} />,
  };
}

export function Import({ item, context }: Props) {
  return (
    <ReferencePage
      context={context}
      navigation={{ category: context.packageName, currentItemName: item.name }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={item.fullName} headingType="Import" />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={item.data.jsDoc} />
          </div>
        </article>
        <ul>
          <li>src: {item.data.importDef.src}</li>
          <li>imported: {item.data.importDef.imported}</li>
        </ul>
      </main>
    </ReferencePage>
  );
}
