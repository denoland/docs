import { ClassMethodDef, DocNodeFunction } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { FunctionSignature } from "./primitives/FunctionSignature.tsx";
import { MemberSection } from "./partials/MemberSection.tsx";
import { parameter } from "../_util/symbolStringBuilding.ts";
import { TypeSummary } from "./primitives/TypeSummary.tsx";

export default function* getPages(
  item: SymbolDoc<DocNodeFunction>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.identifier}`,
    content: (
      <Function name={item.fullName} data={item.data} context={context} />
    ),
  };
}

type Props = {
  name: string;
  data: DocNodeFunction | ClassMethodDef;
  context: ReferenceContext;
};

export function Function({ name, data, context }: Props) {
  const nameOnly = name.split(".").pop();

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: name,
      }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={name} headingType="Method" />
              <StabilitySummary jsDoc={data.jsDoc} />
            </div>
          </div>
          <div>
            <FunctionSignature
              functionDef={data.functionDef}
              nameOverride={nameOnly}
            />
          </div>
          <div>
            <JsDocDescription jsDoc={data.jsDoc} />
          </div>
          <MemberSection title="Parameters">
            {data.functionDef.params.map((param) => (
              <div>
                {parameter(param).map((part) => {
                  return <span className={part.kind}>{part.value}</span>;
                })}
              </div>
            ))}
          </MemberSection>
          <MemberSection title="Return Type">
            <TypeSummary typeDef={data.functionDef.returnType} />
          </MemberSection>
        </article>
      </main>
    </ReferencePage>
  );
}
