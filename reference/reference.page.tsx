import generatePageFor from "./pageFactory.ts";
import getCategoryPages from "./_pages/Category.tsx";
import webCategoryDocs from "./_categories/web-categories.json" with {
  type: "json",
};
import denoCategoryDocs from "./_categories/deno-categories.json" with {
  type: "json",
};
import { getCategories } from "./_categories/categoryBuilding.ts";
import { cliNow } from "../timeUtils.ts";
import { getAllSymbols } from "./symbolLoading.ts";
import { ReferenceContext } from "./types.ts";

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
      const categories = getCategories(packageName, symbols, sections);

      const context: ReferenceContext = {
        root,
        packageName,
        symbols,
        currentCategoryList: categories,
      };

      console.log(`${cliNow()} 💭 Generating categories for ${packageName}`);

      for (const p of getCategoryPages(context)) {
        yield p;
        console.log(`${cliNow()} 📄 Generated category page: ${p.url}`);
        generated.push(p.url);
      }

      console.log(`${cliNow()} 💭 Generating symbol pages for ${packageName}`);
      console.log(`${cliNow()} ℹ️ Found ${symbols.length} top level symbols`);

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
