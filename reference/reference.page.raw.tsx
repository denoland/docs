import { doc } from "@deno/doc";
import registrations from "../reference_gen/registrations.ts";
import factoryFor from "./pageFactory.ts";
import getCategoryPages from "./_pages/Category.tsx";

export const layout = "raw.tsx";
const root = "/new_api";

export const sidebar = [
  {
    items: [
      { label: "Deno APIs", id: `${root}/deno/` },
      { label: "Web APIs", id: `${root}/web/` },
      { label: "Node APIs", id: `${root}/node/` },
    ],
  },
];

const generated: string[] = [];

export default async function* () {
  try {
    if (Deno.env.has("SKIP_REFERENCE")) {
      throw new Error();
    }

    for await (
      const { key, dataCollection, generateOptions } of referenceItems()
    ) {
      const section = generateOptions.packageName || "unknown";
      const definitionFile = key;

      const context = {
        root,
        section,
        dataCollection,
        definitionFile,
        parentName: "",
      };

      for (
        const catPage of getCategoryPages(
          generateOptions.categoryDocs!,
          context,
        )
      ) {
        yield catPage;
        generated.push(catPage.url);
      }

      for (const item of dataCollection) {
        const factory = factoryFor(item);
        const pages = factory(item, context);

        if (!pages) {
          continue;
        }

        for await (const page of pages) {
          if (generated.includes(page.url)) {
            console.warn(
              `⚠️ Skipping duplicate page: ${page.url} - NEED TO MERGE THESE DOCS`,
            );
            continue;
          }

          yield page;
          generated.push(page.url);
        }
      }
    }
  } catch (ex) {
    console.warn("⚠️ Reference docs were not generated." + ex);
  }

  console.log("Generated", generated.length, "reference pages");
}

async function* referenceItems() {
  for (const { sources, generateOptions } of registrations) {
    const paths = sources.map((file) => {
      if (!file.startsWith("./")) {
        return `file://${file}`;
      } else {
        const newPath = file.replace("./", "../reference_gen/");
        return import.meta.resolve(newPath);
      }
    });

    const docs = await loadDocumentation(paths);

    for (const key of Object.keys(docs)) {
      const dataCollection = docs[key];
      yield { key, dataCollection, generateOptions };
    }
  }
}

async function loadDocumentation(paths: string[]) {
  const docGenerationPromises = paths.map(async (path) => {
    return await doc([path]);
  });

  const nodes = await Promise.all(docGenerationPromises);
  return nodes.reduce((acc, val) => ({ ...acc, ...val }), {});
}
