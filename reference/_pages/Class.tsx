import { DocNodeClass } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { ImplementsSummary } from "./partials/ImplementsSummary.tsx";
import { getSymbolDetails } from "./partials/SymbolDetails.tsx";

type Props = { data: SymbolDoc<DocNodeClass>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeClass>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <Class data={item} context={context} />,
  };
}

export function Class({ data, context }: Props) {
  const { details, contents } = getSymbolDetails(data);

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: data.fullName,
      }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={data.fullName} headingType="Class" />
              <ImplementsSummary typeDef={data.data.classDef.implements} />
              <StabilitySummary jsDoc={data.data.jsDoc} />
            </div>
          </div>
          <div>
            {details}
          </div>
        </article>
      </main>
      {contents}
    </ReferencePage>
  );
}
