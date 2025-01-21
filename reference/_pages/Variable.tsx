import { DocNodeVariable, VariableDef } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { DetailedSection } from "./partials/DetailedSection.tsx";
import { MemberSection } from "./partials/MemberSection.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";
import { getSymbolDetails } from "./partials/SymbolDetails.tsx";

type Props = { data: SymbolDoc<DocNodeVariable>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeVariable>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <Variable data={item} context={context} />,
  };
}

export function Variable({ data, context }: Props) {
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
              <NameHeading fullName={data.fullName} headingType="Variable" />
              <StabilitySummary jsDoc={data.data.jsDoc} />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={data.data.jsDoc} />
            <VariableType type={data.data.variableDef} />
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

function VariableType({ type }: { type: VariableDef }) {
  return (
    <MemberSection title={"Type"}>
      <DetailedSection>
        <TypeSummary typeDef={type.tsType!} />
      </DetailedSection>
    </MemberSection>
  );
}
