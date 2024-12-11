import { walk } from "jsr:@std/fs";
import { basename } from "jsr:@std/path";

export const sidebar = [];
export const sectionTitle = "Lint rules";
export const sectionHref = "/lint/";

interface LintRuleDescription {
  name: string;
  mdContent: string;
}
export async function generateLintRuleList() {
  const lintRules: LintRuleDescription[] = [];

  for await (
    const dirEntry of walk(
      new URL(import.meta.resolve("../lint_rules/")),
      { exts: ["md"] },
    )
  ) {
    const snakeCaselintRuleName = basename(dirEntry.path).split(".")[0];
    const lintRuleName = snakeCaselintRuleName.replaceAll("_", "-");
    const mdContent = await Deno.readTextFile(dirEntry.path);
    lintRules.push({
      name: lintRuleName,
      mdContent,
    });
  }

  lintRules.sort((a, b) => a.name.localeCompare(b.name));

  return lintRules;
}
