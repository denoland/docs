import { DocNodeFunction } from "@deno/doc/types";
import { HasFullName, LumeDocument, ReferenceContext } from "../types.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { StabilitySummary } from "./partials/Badges.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { FunctionSignature } from "./primitives/FunctionSignature.tsx";

type Props = { data: DocNodeFunction & HasFullName; context: ReferenceContext };

export default function* getPages(
  item: DocNodeFunction & HasFullName,
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
        </article>
      </main>
    </ReferencePage>
  );
}
