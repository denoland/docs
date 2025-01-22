import { DocNodeVariable, JsDocTagDoc, VariableDef } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { DetailedSection } from "./partials/DetailedSection.tsx";
import { MemberSection } from "./partials/MemberSection.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";
import { getSymbolDetails } from "./partials/SymbolDetails.tsx";
import { getCategoryFromTag, tagIncludes } from "../_util/queries.ts";
import { NodeInDenoUsageGuidance } from "./partials/NodeInDenoUsageGuidance.tsx";

type Props = { item: SymbolDoc<DocNodeVariable>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeVariable>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <Variable item={item} context={context} />,
  };
}

export function Variable({ item, context }: Props) {
  const { details, toc } = getSymbolDetails(item);

  const category = getCategoryFromTag(item);

  const isFromNodeJs = tagIncludes([item], "node");
  const nodeCompatibilityElement = isFromNodeJs
    ? (
      <NodeInDenoUsageGuidance
        nodePackage={category}
        importValue={item.name}
      />
    )
    : <></>;

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: item.fullName,
      }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={item.fullName} headingType="Variable" />
              <StabilitySummary jsDoc={item.data.jsDoc} />
            </div>
          </div>
          <div>
            {nodeCompatibilityElement}
            <JsDocDescription jsDoc={item.data.jsDoc} />
            <VariableType type={item.data.variableDef} />
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
