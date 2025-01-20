import { DocNodeNamespace } from "@deno/doc/types";
import {
  containsWrappedElements,
  HasWrappedElements,
  LumeDocument,
  ReferenceContext,
  SymbolDoc,
} from "../types.ts";
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

type Props = { data: SymbolDoc<DocNodeNamespace>; context: ReferenceContext };

export default function* getPages(
  item: SymbolDoc<DocNodeNamespace>,
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: item.name,
    url:
      `${context.root}/${context.packageName.toLocaleLowerCase()}/${item.identifier}`,
    content: <Namespace data={item} context={context} />,
  };

  if (containsWrappedElements(item.data.namespaceDef)) {
    for (const element of item.data.namespaceDef.wrappedElements) {
      yield* generatePageFor(element, {
        ...context,
        symbols: item.data.namespaceDef.wrappedElements,
      });
    }
  }
}

export function Namespace({ data, context }: Props) {
  const namespaceDef = data.data.namespaceDef as unknown as HasWrappedElements;

  const children = namespaceDef.wrappedElements.sort((a, b) =>
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
            <JsDocDescription jsDoc={data.data.jsDoc} />
          </div>
        </article>
        {sections.map(([title, kind]) => {
          return (
            <MemberSection
              title={title}
              children={children.filter((x) => x.data.kind === kind).map(
                (x) => {
                  return <SymbolSummaryItem item={x} />;
                },
              )}
            />
          );
        })}
      </main>
      <TableOfContents>
        <ul>
          {sections.map(([title, kind]) => {
            return (
              <TocSection title={title}>
                {children.filter((x) => x.data.kind === kind).map((x) => {
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
