import { DocNodeNamespace } from "@deno/doc/types";
import { LumeDocument, ReferenceContext } from "../types.ts";
import generatePageFor from "../pageFactory.ts";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { NameHeading } from "./partials/NameHeading.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import {
  TableOfContents,
  TocListItem,
  TocSection,
} from "./partials/TableOfContents.tsx";
import { SymbolSummaryItem } from "./partials/SymbolSummaryItem.tsx";
import { sections } from "../_util/common.ts";
import { MemberSection } from "./partials/MemberSection.tsx";

type Props = { data: DocNodeNamespace; context: ReferenceContext };

export default function* getPages(
  item: DocNodeNamespace,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/${item.name}`,
    content: <Namespace data={item} context={context} />,
  };

  for (const element of item.namespaceDef.elements) {
    yield* generatePageFor(element, {
      ...context,
      symbols: item.namespaceDef.elements,
    });
  }
}

export function Namespace({ data, context }: Props) {
  const children = data.namespaceDef.elements.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: data.name,
      }}
    >
      <main class={"symbolGroup"}>
        <article>
          <div>
            <div>
              <NameHeading fullName={data.name} headingType="Namespace" />
            </div>
          </div>
          <div>
            <JsDocDescription jsDoc={data.jsDoc} />
          </div>
        </article>
        {sections.map(([title, kind]) => {
          return (
            <MemberSection
              title={title}
              children={children.filter((x) => x.kind === kind).map((x) => {
                return <SymbolSummaryItem item={x} />;
              })}
            />
          );
        })}
      </main>
      <TableOfContents>
        <ul>
          {sections.map(([title, kind]) => {
            return (
              <TocSection title={title}>
                {children.filter((x) => x.kind === kind).map((x) => {
                  return <TocListItem item={x} type={kind} />;
                })}
              </TocSection>
            );
          })}
        </ul>
      </TableOfContents>
    </ReferencePage>
  );
}
