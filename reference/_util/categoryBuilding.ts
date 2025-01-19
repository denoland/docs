import { DocNode, JsDocTagDoc } from "@deno/doc/types";

// deno-lint-ignore no-explicit-any
type CategoryDescription = { path: string, categoryDocs: any };

export function getCategories(packageName: string, symbols: DocNode[], descriptionsConfig: CategoryDescription[]) {
    const descriptions = descriptionsConfig.filter((x) =>
        x.path === packageName.toLocaleLowerCase()
    )[0]!.categoryDocs as Record<string, string | undefined>;

    return getCategoriesFromSymbols(symbols, descriptions);
}

export function getCategoriesFromSymbols(symbols: DocNode[], descriptions: Record<string, string | undefined>): Map<string, string> {
    const allCategoriesFromJsDocTags = symbols.map((item) =>
        item.jsDoc?.tags?.filter((tag) => tag.kind === "category")
    ).flat() as JsDocTagDoc[];

    const distinctCategories = [...new Set(allCategoriesFromJsDocTags.map((tag) => tag?.doc?.trim()))];

    return distinctCategories
        .filter(x => x !== undefined)
        .sort()
        .reduce((acc, category) => {
            const description = descriptions[category] || "";
            acc.set(category, description);
            return acc;
        }, new Map<string, string>());
}
