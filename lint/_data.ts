import { extractYaml } from "jsr:@std/front-matter@1.0.5";
import { walk } from "jsr:@std/fs";
import { basename } from "jsr:@std/path";
import { Sidebar, SidebarLink } from "../types.ts";

async function generateSidebarItems() {
  const sidebarItems = [];

  for await (
    const dirEntry of walk(
      new URL(import.meta.resolve("./rules/")),
      { exts: ["md"] },
    )
  ) {
    const lintRuleName = basename(dirEntry.path).split(".")[0];
    const mdContent = await Deno.readTextFile(dirEntry.path);
    let frontMatterData = { body: "", attrs: {} };
    try {
      frontMatterData = extractYaml(mdContent);
    } catch {
      frontMatterData.body = mdContent;
    }
    const tags = frontMatterData.attrs.tags ?? [];
    // TODO(bartlomieju): handle descriptions properly
    // const description = frontMatterData.body.split(".")[0];

    sidebarItems.push(
      {
        href: `/lint/rules/${lintRuleName}/`,
        label: lintRuleName,
        tags,
        // description,
      } satisfies SidebarLink,
    );
  }

  sidebarItems.sort((a, b) => a.label.localeCompare(b.label));

  return sidebarItems;
}

export const lintRulePages = await generateSidebarItems();

export const sectionTitle = "Lint rules";

export const sectionHref = "/lint/";

export const sidebar = [
  {
    title: sectionTitle,
    href: sectionHref,
    items: lintRulePages,
  },
] satisfies Sidebar;
