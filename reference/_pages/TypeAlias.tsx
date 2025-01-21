import { DocNodeTypeAlias } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";

type Props = {
  item: SymbolDoc<DocNodeTypeAlias>;
  context: ReferenceContext;
};

export default function* getPages(
  item: SymbolDoc<DocNodeTypeAlias>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <TypeAlias item={item} context={context} />,
  };
}

export function TypeAlias({ item, context }: Props) {
  return (
    <ReferencePage
      context={context}
      navigation={{ category: context.packageName, currentItemName: item.name }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={item.fullName} headingType="TypeAlias" />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={item.data.jsDoc} />
          </div>
        </article>
        <div>
          Alias for: <TypeSummary typeDef={item.data.typeAliasDef.tsType} />
        </div>
      </main>
    </ReferencePage>
  );
}
