import { DocNodeBase, DocNodeKind, JsDocTagDoc } from "@deno/doc/types";
import { SymbolDoc } from "../types.ts";

export function firstOrDefaultOfType(
  items: SymbolDoc<DocNodeBase>[],
  type: DocNodeKind,
) {
  return items.find((x) => x.data.kind === type);
}

export function groupBySymbolType(items: SymbolDoc<DocNodeBase>[]) {
  const itemsOfType = new Map<string, SymbolDoc<DocNodeBase>[]>();
  for (const item of items) {
    if (!itemsOfType.has(item.data.kind)) {
      itemsOfType.set(item.data.kind, []);
    }
    const collection = itemsOfType.get(item.data.kind);
    if (!collection?.includes(item)) {
      collection?.push(item);
    }
  }
  return itemsOfType;
}

export function filterByCategory(
  items: SymbolDoc<DocNodeBase>[],
  categoryName: string,
) {
  return items.filter((
    item,
  ) =>
    item.data.jsDoc?.tags?.some((tag) =>
      tag.kind === "category" &&
      tag.doc.toLocaleLowerCase() === categoryName?.toLocaleLowerCase()
    )
  );
}

export function tagIncludes(
  items: SymbolDoc<DocNodeBase>[],
  tagValue: string,
) {
  return items.some((x) =>
    x.data.jsDoc?.tags?.some((tag) =>
      tag.kind === "tags" &&
      tag.tags.includes(tagValue)
    )
  );
}

export function getCategoryFromTag(item: SymbolDoc) {
  const tag = item.data.jsDoc?.tags?.find((tag) => tag.kind === "category") as
    | JsDocTagDoc
    | undefined;

  return tag?.doc || "";
}

export function getCategoryDescription(
  symbols: SymbolDoc<DocNodeBase>[],
  category: string,
) {
  const moduleDoc = symbols.find((x) =>
    x.data.kind === "moduleDoc" &&
    x.data.jsDoc?.tags?.some((tag) =>
      tag.kind === "category" && tag.doc === category
    )
  );

  return (moduleDoc?.data.jsDoc?.doc || "").split("\n\n")[0];
}
