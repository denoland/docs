import { walkSync } from "@std/fs/walk";
import { basename } from "@std/path";
import { extractYaml } from "@std/front-matter";
export { sectionHref, sidebar } from "./_data.ts";

export const sectionTitle = "Lint rules";

export const layout = "lintRule.tsx";

export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  const files = walkSync("lint/rules/", { exts: [".md"] });

  for (const file of files) {
    const content = Deno.readTextFileSync(file.path);
    let fmData = {
      body: "",
      attrs: {},
    };

    try {
      fmData = extractYaml(content);
    } catch {
      fmData.body = content;
    }

    const ruleName = basename(file.path).slice(0, -3);

    yield {
      url: `/lint/rules/${ruleName}/`,
      title: ruleName,
      content: helpers.md(fmData.body),
      data: {
        tags: fmData.attrs.tags,
      },
    };
  }
}
