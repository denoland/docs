import { Project, ts } from "ts-morph";
import $ from "dax";

await Deno.mkdir("types", { recursive: true });

const tempFile = await Deno.makeTempFile();

await $`deno types`.stdout($.path(tempFile));

const project = new Project();
const file = project.addSourceFileAtPath(tempFile);

const modules: Record<string, string> = {
  "deno": "",
};

const UNSTABLE_PREFIX = "**UNSTABLE**: New API, yet to be vetted.";

for (const jsdoc of file.getDescendantsOfKind(ts.SyntaxKind.JSDoc)) {
  const text = jsdoc.getText();
  if (text?.includes?.(UNSTABLE_PREFIX)) {
    jsdoc.replaceWithText(text.replace(UNSTABLE_PREFIX, ""));
  }
}

for (
  const denoNs of file.getDescendantsOfKind(ts.SyntaxKind.ModuleDeclaration)
    .filter((descendant) => descendant.getName() === "Deno")
) {
  const denoNsJSDoc = denoNs.getFirstChildIfKind(ts.SyntaxKind.JSDoc);
  if (denoNsJSDoc) {
    denoNsJSDoc.addTag({
      tagName: "module",
    });
    modules["deno"] = denoNsJSDoc.getText() + "\n\n  " + modules["deno"];
    denoNsJSDoc.remove();
  }

  modules["deno"] += denoNs.getFullText();
  denoNs.remove();
}

modules["web"] = file.getFullText();

await Promise.all(
  Object.entries(modules).map(([name, content]) =>
    Deno.writeTextFile(`types/${name}.d.ts`, content)
  ),
);
