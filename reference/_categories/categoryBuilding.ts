import { DocNode, JsDocTagDoc } from "@deno/doc/types";
import { WebCategoryDetails } from "../types.ts";
// deno-lint-ignore no-explicit-any
type CategoryDescription = { path: string; categoryDocs: any };

export function getCategories(
  packageName: string,
  symbols: DocNode[],
  descriptionsConfig: CategoryDescription[],
) {
  const descriptions = descriptionsConfig.filter((x) =>
    x.path === packageName.toLocaleLowerCase()
  )[0]!.categoryDocs as Record<string, string | undefined>;

  const catsFromSymbols = getCategoriesFromSymbols(symbols, descriptions);

  catsFromSymbols.set("All Symbols", {
    description: "All symbols in this package",
    urlStub: "all_symbols",
  });

  return catsFromSymbols;
}

export function getCategoriesFromSymbols(
  symbols: DocNode[],
  descriptions: Record<string, string | undefined>,
): Map<string, WebCategoryDetails> {
  const allCategoriesFromJsDocTags = symbols.map((item) =>
    item.jsDoc?.tags?.filter((tag) => tag.kind === "category")
  ).flat() as JsDocTagDoc[];

  const distinctCategories = [
    ...new Set(allCategoriesFromJsDocTags.map((tag) => tag?.doc?.trim())),
  ];

  const categoriesWithDescriptions = distinctCategories
    .filter((x) => x !== undefined)
    .sort()
    .reduce((acc, category) => {
      const description = descriptions[category] || "";
      acc.set(category, description);
      return acc;
    }, new Map<string, string>());

  const enrichedWitUrls = new Map<string, WebCategoryDetails>();

  categoriesWithDescriptions.forEach((description, category) => {
    enrichedWitUrls.set(category, {
      description: description,
      urlStub: createCategoryUrl(category),
    });
  });

  return enrichedWitUrls;
}

function createCategoryUrl(category: string) {
  let categoryUrl = category.replace(/\s/g, "_").toLocaleLowerCase();
  categoryUrl = categoryUrl.replace(/[^a-zA-Z0-9-_]/g, "");
  categoryUrl = categoryUrl.toLocaleLowerCase();

  return categoryUrl;
}
