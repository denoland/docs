import generatePageFor from "./_pages/pageFactory.ts";
import getCategoryPages from "./_pages/Category.tsx";
import { getCategories } from "./_categories/categoryBuilding.ts";
import { cliNow } from "../timeUtils.ts";
import { getAllSymbols } from "./_util/symbolLoading.ts";
import { ReferenceContext } from "./types.ts";
import { log } from "lume/core/utils/log.ts";
import { packages, root, sections } from "./config.ts";

export const layout = "raw.tsx";

export const sidebar = [
  {
    items: sections.map((section) => ({
      label: section.name,
      id: `${root}/${section.path}/`,
    })),
  },
];

export default async function* () {
  const generated: string[] = [];
  const skippedPages: string[] = [];

  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }

    const allSymbols = await getAllSymbols(packages);

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
        // console.log(`${cliNow()} 📄 Generated category page: ${p.url}`);
        generated.push(p.url);
      }

      console.log(`${cliNow()} 💭 Generating symbol pages for ${packageName}`);
      console.log(`${cliNow()} ℹ️ Found ${symbols.length} top level symbols`);

      for (const item of symbols) {
        const pages = generatePageFor(item, context);

        for await (const page of pages) {
          if (generated.includes(page.url)) {
            //console.warn(`⚠️ Skipping duplicate page: ${page.url}!`);
            skippedPages.push(page.url);
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
    `${cliNow()} Generated ${generated.length} pages, skipped ${skippedPages.length}`,
  );

  if (skippedPages.length > 0) {
    console.log(
      `${cliNow()} Skipped pages indicate symbol naming conflicts, items will be hidden from the docs.`,
    );
    console.log(
      `${cliNow()} This is normally due to conflicting (matching) names for different symbol types.`,
    );

    log.debug("Pages with naming collisions:");
    for (const page of skippedPages) {
      log.debug(`- ${page}`);
    }
  }
}
