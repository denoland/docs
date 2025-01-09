import { DocNodeBase, DocNodeClass } from "@deno/doc/types";
import ReferencePage from "../_layouts/ReferencePage.tsx";
import { flattenItems } from "../_util/common.ts";
import {
  HasNamespace,
  LumeDocument,
  MightHaveNamespace,
  ReferenceContext,
} from "../types.ts";
import { insertLinkCodes } from "./primatives/LinkCode.tsx";
import { AnchorableHeading } from "./primatives/AnchorableHeading.tsx";
import { CodeIcon } from "./primatives/CodeIcon.tsx";
import { Package } from "./Package.tsx";

export default function* getPages(
  context: ReferenceContext,
): IterableIterator<LumeDocument> {
  yield {
    title: context.packageName,
    url: `${context.root}/${context.packageName.toLocaleLowerCase()}/`,
    content: <Package data={context.currentCategoryList} context={context} />,
  };

  for (const [key] of Object.entries(context.currentCategoryList)) {
    yield {
      title: key,
      url:
        `${context.root}/${context.packageName.toLocaleLowerCase()}/${key.toLocaleLowerCase()}`,
      content: <CategoryBrowse categoryName={key} context={context} />,
    };
  }
}

type ListingProps = {
  categoryName: string;
  context: ReferenceContext;
};

export function CategoryBrowse({ categoryName, context }: ListingProps) {
  const allItems = flattenItems(context.symbols);

  const itemsInThisCategory = allItems.filter((item) =>
    item.jsDoc?.tags?.some((tag) =>
      tag.kind === "category" &&
      tag.doc.toLocaleLowerCase() === categoryName?.toLocaleLowerCase()
    )
  );

  const classes = itemsInThisCategory.filter((item) => item.kind === "class")
    .sort((a, b) => a.name.localeCompare(b.name));

  const functions = itemsInThisCategory.filter((item) =>
    item.kind === "function"
  ).sort((a, b) => a.name.localeCompare(b.name));

  const interfaces = itemsInThisCategory.filter((item) =>
    item.kind === "interface"
  ).sort((a, b) => a.name.localeCompare(b.name));

  const typeAliases = itemsInThisCategory.filter((item) =>
    item.kind === "typeAlias"
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ReferencePage
      context={context}
      navigation={{
        category: context.packageName,
        currentItemName: categoryName,
      }}
    >
      <main>
        <div className={"space-y-7"}>
          <CategoryPageSection title={"Classes"} items={classes} />
          <CategoryPageSection title={"Functions"} items={functions} />
          <CategoryPageSection title={"Interfaces"} items={interfaces} />
          <CategoryPageSection title={"Type Aliases"} items={typeAliases} />
        </div>
      </main>
    </ReferencePage>
  );
}

function CategoryPageSection(
  { title, items }: { title: string; items: DocNodeBase[] },
) {
  const anchorId = title.replace(" ", "-").toLocaleLowerCase();
  return (
    <section id={anchorId} className={"section"}>
      <AnchorableHeading anchor={anchorId}>{title}</AnchorableHeading>
      <div className={"namespaceSection"}>
        {items.map((item) => <CategoryPageItem item={item} />)}
      </div>
    </section>
  );
}

function CategoryPageItem(
  { item }: { item: DocNodeBase & MightHaveNamespace },
) {
  const displayName = item.fullName || item.name;
  const firstLineOfJsDoc = item.jsDoc?.doc?.split("\n")[0] || "";
  const descriptionWithLinkCode = insertLinkCodes(firstLineOfJsDoc);

  return (
    <div className={"namespaceItem"}>
      <CodeIcon glyph={item.kind} />
      <div className={"namespaceItemContent"}>
        <a href={`~/${displayName}`}>
          {displayName}
        </a>
        <p>
          {descriptionWithLinkCode}
        </p>
        <MethodLinks item={item} />
      </div>
    </div>
  );
}

function MethodLinks({ item }: { item: DocNodeBase }) {
  if (item.kind !== "class") {
    return <></>;
  }

  const asClass = item as DocNodeClass & HasNamespace;
  const methods = asClass.classDef.methods.sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const filteredMethodsList = [
    "[Symbol.dispose]",
    "[Symbol.asyncDispose]",
    "[Symbol.asyncIterator]",
  ];

  const filteredMethods = methods.filter((method) =>
    !filteredMethodsList.includes(method.name)
  );

  const methodLinks = filteredMethods.map((method) => {
    return (
      <li>
        <a href={`~/${asClass.fullName}#${method.name}`}>
          {method.name}
        </a>
      </li>
    );
  });

  return (
    <ul className={"namespaceItemContentSubItems"}>
      {methodLinks}
    </ul>
  );
}
