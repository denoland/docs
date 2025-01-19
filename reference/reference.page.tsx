import generatePageFor from "./pageFactory.ts";
import getCategoryPages from "./_pages/Category.tsx";
import { countSymbols, decorateNodesWithExtraData } from "./_util/common.ts";
import { getSymbols } from "./_dataSources/dtsSymbolSource.ts";
import webCategoryDocs from "./_categories/web-categories.json" with {
  type: "json",
};
import denoCategoryDocs from "./_categories/deno-categories.json" with {
  type: "json",
};
import { DocNode } from "@deno/doc/types";
import { HasNamespace } from "./types.ts";
import { mergeSymbolsWithCollidingNames } from "./_util/symbolMerging.ts";
import { categoryDataFrom, parseCategories } from "./_util/categoryBuilding.ts";
import { cliNow } from "../timeUtils.ts";

export const layout = "raw.tsx";

const root = "/api";
const sections = [
  { name: "Deno APIs", path: "deno", categoryDocs: denoCategoryDocs },
  { name: "Web APIs", path: "web", categoryDocs: webCategoryDocs },
  { name: "Node APIs", path: "node", categoryDocs: undefined },
];

export const sidebar = [
  {
    items: sections.map((section) => ({
      label: section.name,
      id: `${root}/${section.path}/`,
    })),
  },
];

export default async function* () {
  let skipped = 0;
  const generated: string[] = [];

  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }

    const allSymbols = await getAllSymbols();

    for (const [packageName, symbols] of allSymbols.entries()) {
      const descriptions = categoryDataFrom(sections, packageName);
      const categories = parseCategories(symbols, descriptions);

      const context = {
        root,
        packageName,
        symbols,
        currentCategoryList: categories,
      };

      for (const p of getCategoryPages(context)) {
        yield p;
        generated.push(p.url);
      }

      for (const item of symbols) {
        const pages = generatePageFor(item, context);

        for await (const page of pages) {
          if (generated.includes(page.url)) {
            //console.warn(`⚠️ Skipping duplicate page: ${page.url}!`);
            skipped++;
            continue;
          }

          yield page;
          generated.push(page.url);
        }
      }
    }
  } catch (ex) {
    console.warn(`"${cliNow()} ⚠️ Reference docs were not generated.` + ex);
  }

  console.log(
    `${cliNow()} Generated ${generated.length} pages, skipped ${skipped}`,
  );
}

async function getAllSymbols() {
  const allSymbols = new Map<string, DocNode[]>();
  for await (const { packageName, symbols, sourceFileName } of getSymbols()) {
    console.log(
      `${cliNow()} 📚 ${packageName}:${sourceFileName} has ${
        countSymbols(symbols)
      } symbols`,
    );

    const enrichedItems = decorateNodesWithExtraData(
      symbols,
    ) as (DocNode & HasNamespace)[];

    const symbolsByName = new Map<string, (DocNode & HasNamespace)[]>();

    for (const symbol of enrichedItems) {
      const existing = symbolsByName.get(symbol.fullName) || [];
      symbolsByName.set(symbol.name, [...existing, symbol]);
    }

    const mergedSymbols = mergeSymbolsWithCollidingNames(symbolsByName);

    allSymbols.set(packageName, mergedSymbols);
  }

  return allSymbols;
}
