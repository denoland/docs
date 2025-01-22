import { DocNodeEnum } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { MemberSection } from "./partials/MemberSection.tsx";
import { TypeSummary } from "./primitives/TypeSummary.tsx";

type Props = { item: SymbolDoc<DocNodeEnum>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeEnum>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: <Enum item={item} context={context} />,
  };
}

export function Enum({ item, context }: Props) {
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
              <NameHeading fullName={item.fullName} headingType="Enum" />
              <StabilitySummary jsDoc={item.data.jsDoc} />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={item.data.jsDoc} />
          </div>
          <MemberSection title="Members">
            {item.data.enumDef.members.map((member) => (
              <div>
                <div>
                  {member.name} = <TypeSummary typeDef={member.init} />
                </div>
                <div>{member.jsDoc?.doc}</div>
              </div>
            ))}
          </MemberSection>
        </article>
      </main>
    </ReferencePage>
  );
}
