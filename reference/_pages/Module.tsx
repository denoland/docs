import { DocNodeModuleDoc } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";

type Props = { item: SymbolDoc<DocNodeModuleDoc>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeModuleDoc>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <Module item={item} context={context} />,
  };
}

export function Module({ item, context }: Props) {
  return (
    <ReferencePage
      context={context}
      navigation={{ category: context.packageName, currentItemName: item.name }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={item.fullName} headingType="Module" />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={item.data.jsDoc} />
          </div>
        </article>
        <div>{item.data.declarationKind}</div>
      </main>
    </ReferencePage>
  );
}
