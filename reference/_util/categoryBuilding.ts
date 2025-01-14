import { DocNode, JsDocTagDoc } from "@deno/doc/types";

export function parseCategories(
  symbols: DocNode[],
  categoryDescriptionMap: Record<string, string | undefined>,
): Map<string, string> {
  const allCategoriesFromJsDocTags = symbols.map((item) =>
    item.jsDoc?.tags?.filter((tag) => tag.kind === "category")
  ).flat() as JsDocTagDoc[];

  const distinctCategories = [
    ...new Set(allCategoriesFromJsDocTags.map((tag) => tag?.doc?.trim())),
  ];

  return distinctCategories
    .filter((x) => x !== undefined)
    .sort()
    .reduce((acc, category) => {
      const description = categoryDescriptionMap[category] || "";
      acc.set(category, description);
      return acc;
    }, new Map<string, string>());
}

// deno-lint-ignore no-explicit-any
export function categoryDataFrom(
  sections: { path: string; categoryDocs: any }[],
  packageName: string,
): Record<string, string | undefined> {
  return sections.filter((x) => x.path === packageName.toLocaleLowerCase())[0]!
    .categoryDocs as Record<string, string | undefined>;
}
