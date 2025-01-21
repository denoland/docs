import ReferencePage from "../_layouts/ReferencePage.tsx";
import { flattenItems, sections } from "../_util/common.ts";
import {
  LumeDocument,
  ReferenceContext,
  SymbolDoc,
  WebCategoryDetails,
} from "../types.ts";
import { AnchorableHeading } from "./partials/AnchorableHeading.tsx";
import { Package } from "./Package.tsx";
import { SymbolSummaryItem } from "./partials/SymbolSummaryItem.tsx";
import {
  TableOfContents,
  TocListItem,
  TocSection,
} from "./partials/TableOfContents.tsx";
import { JsDocDescription } from "./partials/JsDocDescription.tsx";
import { NodeInDenoUsageGuidance } from "./partials/NodeInDenoUsageGuidance.tsx";
import {
  filterByCategory,
  firstOrDefaultOfType,
  groupBySymbolType,
  tagIncludes,
} from "../_util/queries.ts";

export default function* getPages(
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: context.packageName,
    url: `${context.root}/${context.packageName.toLocaleLowerCase()}/`,
    content: <Package data={context.currentCategoryList} context={context} />,
  };

  for (const [key, details] of context.currentCategoryList) {
    const BrowsePage = key === "All Symbols"
      ? AllSymbolsBrowse
      : CategoryBrowse;

    yield {
      title: key,
      url:
        `${context.root}/${context.packageName.toLocaleLowerCase()}/${details.urlStub}`,
      content: (
        <BrowsePage
          categoryName={key}
          categoryDetails={details}
          context={context}
        />
      ),
    };
  }
}

type ListingProps = {
  categoryName: string;
  categoryDetails: WebCategoryDetails;
  context: ReferenceContext;
};

export function CategoryBrowse({ categoryName, context }: ListingProps) {
  const allItems = flattenItems(context.symbols).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const validItems = filterByCategory(allItems, categoryName);
  const itemsOfType = groupBySymbolType(validItems);

  const isFromNodeJs = tagIncludes(validItems, "node");
  const moduleDoc = firstOrDefaultOfType(validItems, "moduleDoc");
  const jsDocData = moduleDoc?.data.jsDoc;

  const nodeCompatibilityElement = isFromNodeJs
    ? <NodeInDenoUsageGuidance nodePackage={categoryName} />
    : <></>;

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: categoryName,
      }}
    >
      <main>
        {nodeCompatibilityElement}
        <JsDocDescription jsDoc={jsDocData} />
        <div className={"space-y-7"}>
          {sections.map(([title, kind]) => {
            const matching = itemsOfType.get(kind) || [];
            return <CategoryPageSection title={title} items={matching} />;
          })}
        </div>
      </main>
      <TableOfContents>
        <ul>
          {sections.map(([title, kind]) => {
            const matching = itemsOfType.get(kind) || [];
            return (
              <TocSection title={title}>
                {matching.map((x) => {
                  return (
                    <TocListItem item={{ name: x.fullName }} type={kind} />
                  );
                })}
              </TocSection>
            );
          })}
        </ul>
      </TableOfContents>
    </ReferencePage>
  );
}

type AllSymbolsBrowseProps = {
  context: ReferenceContext;
};

function AllSymbolsBrowse({ context }: AllSymbolsBrowseProps) {
  const allItems = flattenItems(context.symbols).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: "All Symbols",
      }}
    >
      <main>
        <div className={"space-y-7"}>
          <CategoryPageSection title={"Default"} items={allItems} />;
        </div>
      </main>
    </ReferencePage>
  );
}

function CategoryPageSection(
  { title, items }: { title: string; items: SymbolDoc[] },
) {
  if (items.length === 0) {
    return null;
  }

  const anchorId = title.replace(" ", "-").toLocaleLowerCase();
  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>{title}</AnchorableHeading>
      <div className={"namespaceSection"}>
        {items.map((item) => <SymbolSummaryItem item={item} />)}
      </div>
    </section>
  );
}
