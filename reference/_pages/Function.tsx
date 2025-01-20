import { DocNodeFunction } from "@deno/doc/types";
import { LumeDocument, ReferenceContext, SymbolDoc } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { FunctionSignature } from "./primitives/FunctionSignature.tsx";

type Props = { data: SymbolDoc<DocNodeFunction>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeFunction>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/~/${item.fullName}`,
    content: <Function data={item} context={context} />,
  };
}

export function Function({ data, context }: Props) {
  const nameOnly = data.fullName.split(".").pop();

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
              <NameHeading fullName={data.fullName} headingType="Function" />
              <StabilitySummary jsDoc={data.data.jsDoc} />
            </div>
          </div>
          <div>
            <FunctionSignature
              functionDef={data.data.functionDef}
              nameOverride={nameOnly}
            />
          </div>
          <div>
            <JsDocDescription jsDoc={data.data.jsDoc} />
          </div>
        </article>
      </main>
    </ReferencePage>
  );
}
