import generatePageFor from "./pageFactory.ts";
import getCategoryPages from "./_pages/Category.tsx";
import { populateItemNamespaces } from "./_util/common.ts";
import { getSymbols } from "./_dataSources/dtsSymbolSource.ts";
import webCategoryDocs from "./_categories/web-categories.json" with {
  type: "json",
};
import denoCategoryDocs from "./_categories/deno-categories.json" with {
  type: "json",
};
import { DocNode } from "@deno/doc/types";

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

const generated: string[] = [];

export default async function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }

    for await (const { packageName, symbols } of getSymbols()) {
      const cleanedSymbols = populateItemNamespaces(symbols) as DocNode[];

      const currentCategoryList = sections.filter((x) =>
        x.path === packageName.toLocaleLowerCase()
      )[0]!.categoryDocs as Record<string, string | undefined>;

      const context = {
        root,
        packageName,
        symbols: cleanedSymbols,
        currentCategoryList: currentCategoryList,
      };

      for (const p of getCategoryPages(context)) {
        yield p;
        generated.push(p.url);
      }

      for (const item of cleanedSymbols) {
        const pages = generatePageFor(item, context);

        for await (const page of pages) {
          if (generated.includes(page.url)) {
            console.warn(`⚠️ Skipping duplicate page: ${page.url}!`);
            continue;
          }

          yield page;
          generated.push(page.url);
          console.log("Generated", page.url);
        }
      }
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }

  console.log("Generated", generated.length, "reference pages");
}
