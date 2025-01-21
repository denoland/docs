import { DocNodeClass, TsTypeDef } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { getSymbolDetails } from "./partials/SymbolDetails.tsx";
import { Function } from "./Function.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";

type Props = { data: SymbolDoc<DocNodeClass>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeClass>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <Class data={item} context={context} />,
  };

  for (const method of item.data.classDef.methods) {
    yield {
      title: method.name,
      url:
        `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}.prototype.${method.name}`,
      content: (
        <Function name={method.name} data={method} context={context} />
      ),
    };
  }
}

export function Class({ data, context }: Props) {
  const { details, toc } = getSymbolDetails(data);

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
      {toc}
    </ReferencePage>
  );
}


function ImplementsSummary({ typeDef }: { typeDef: TsTypeDef[] }) {
  if (typeDef.length === 0) {
    return null;
  }

  const spans = typeDef.map((iface) => {
    return <TypeSummary typeDef={iface} />;
  });

  if (spans.length === 0) {
    return null;
  }

  return (
    <div class="symbolSubtitle">
      <div>
        <span class="type">implements{" "}</span>
        {spans}
      </div>
    </div>
  );
}
