import { walkSync } from "@std/fs/walk";
import { basename } from "@std/path";
export { sectionHref, sectionTitle, sidebar } from "./lint/_data.ts";
import { extractYaml } from "jsr:@std/front-matter@1.0.5";

export const layout = "doc.tsx";

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
    };
  }
}
