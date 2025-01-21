import { JsDocTagDoc } from "@deno/doc/types";
import { SymbolDoc, WebCategoryDetails } from "../types.ts";
import { getCategoryDescription } from "../_util/queries.ts";

// deno-lint-ignore no-explicit-any
type CategoryDescription = { path: string; categoryDocs: any };

export function getCategories(
  packageName: string,
  symbols: SymbolDoc[],
  descriptionsConfig: CategoryDescription[],
) {
  const descriptions = descriptionsConfig.filter((x) =>
    x.path === packageName.toLocaleLowerCase()
  )[0]!.categoryDocs as Record<string, string | undefined>;

  const catsFromSymbols = getCategoriesFromSymbols(symbols, descriptions);

  if (catsFromSymbols.size > 0) {
    catsFromSymbols.set("All Symbols", {
      title: "All Symbols",
      description: "All symbols in this package",
      urlStub: "all_symbols",
    });
  }

  return catsFromSymbols;
}

export function getCategoriesFromSymbols(
  symbols: SymbolDoc[],
  descriptions: Record<string, string | undefined>,
): Map<string, WebCategoryDetails> {
  const allCategoriesFromJsDocTags = symbols.map((item) =>
    item.data.jsDoc?.tags?.filter((tag) => tag.kind === "category")
  ).flat() as JsDocTagDoc[];

  const distinctCategories = [
    ...new Set(allCategoriesFromJsDocTags.map((tag) => tag?.doc?.trim())),
  ];

  const categoriesWithDescriptions = distinctCategories
    .filter((x) => x !== undefined)
    .sort()
    .reduce((acc, category) => {
      if (!descriptions) {
        const description = getCategoryDescription(symbols, category);
        acc.set(category, description);
        return acc;
      }

      const description = descriptions[category] || "";
      acc.set(category, description);
      return acc;
    }, new Map<string, string>());

  const enrichedWitUrls = new Map<string, WebCategoryDetails>();

  categoriesWithDescriptions.forEach((description, category) => {
    enrichedWitUrls.set(category, {
      title: category,
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
