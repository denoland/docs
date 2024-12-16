import { extractYaml } from "jsr:@std/front-matter@1.0.5";

interface DenoLintRuleDesc {
  code: string;
  tags: string[];
}

interface DenoLintRulesOutput {
  version: string;
  rules: DenoLintRuleDesc[];
}

async function getCurrentLintRules(): Promise<DenoLintRulesOutput> {
  const output = await new Deno.Command(Deno.execPath(), {
    args: ["lint", "--rules", "--json"],
  }).outputSync();

  if (!output.success) {
    throw new Error("Failed to run `deno lint --rules --json`");
  }

  const data = new TextDecoder().decode(output.stdout);
  return JSON.parse(data) satisfies DenoLintRulesOutput;
}

const missingDocs: string[] = [];

async function checkIfDocsExistAndUpdate(lintRulesData: DenoLintRulesOutput) {
  for (const lintRule of lintRulesData.rules) {
    const name = lintRule.code;

    let content = "";
    try {
      content = await Deno.readTextFile(`./lint/rules/${name}.md`);
    } catch {
      missingDocs.push(name);
      continue;
    }

    let fmData = {
      body: "",
      attrs: {},
    };

    try {
      fmData = extractYaml(content);
    } catch {
      fmData.body = content;
    }

    fmData.attrs.tags = lintRule.tags;

    const newContent = `---
tags: [${fmData.attrs.tags.join(", ")}]
---

${fmData.body}`;
    await Deno.writeTextFile(`./lint/rules/${name}.md`, newContent);
  }
}

const lintRulesData = await getCurrentLintRules();
await checkIfDocsExistAndUpdate(lintRulesData);

if (missingDocs.length !== 0) {
  throw new Error(`Some rules are missing docs:\n${missingDocs.join("\n")}`);
}
