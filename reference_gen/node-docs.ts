import { Node, Project, ts } from "ts-morph";
import EXCLUDE_MAP from "./node-exclude-map.json" with { type: "json" };

await Deno.mkdir("types/node", { recursive: true });

const cleanProject = new Project();
const files = cleanProject.addSourceFilesAtPaths(
  "./node_modules/@types/node/**/*.d.ts",
);

const modules: Record<string, string> = {};

function rewriteModuleName(name: string): string {
  return name.slice(1, -1).replaceAll("/", "--").replaceAll(":", "__");
}

for (const file of files) {
  const fileName = file.getBaseName();
  for (
    const importOrExportDecl of file.getDescendants().filter((descendant) =>
      descendant.getKind() === ts.SyntaxKind.ImportDeclaration ||
      descendant.getKind() === ts.SyntaxKind.ExportDeclaration
    )
  ) {
    const specifier = importOrExportDecl.getModuleSpecifier();
    if (specifier) {
      importOrExportDecl.setModuleSpecifier(
        `./${rewriteModuleName(specifier.getText())}.d.ts`,
      );
    }
  }

  const ambientModules = file.getDescendantsOfKind(
    ts.SyntaxKind.ModuleDeclaration,
  )
    .filter((node) => node.hasModuleKeyword());

  for (const ambientModule of ambientModules) {
    for (
      const exportable of ambientModule.getDescendants().filter((descendant) =>
        Node.isExportable(descendant)
      )
    ) {
      if (
        exportable.getKind() !== ts.SyntaxKind.ImportEqualsDeclaration &&
        !(exportable.getKind() === ts.SyntaxKind.ModuleDeclaration &&
          exportable.getName() === "global")
      ) {
        exportable.setIsExported(
          !EXCLUDE_MAP[fileName]?.includes(exportable.getName?.()),
        );
      }
    }

    for (
      const namespace of ambientModule.getBody()!.getStatements().filter(
        (statement) => statement.getKind() === ts.SyntaxKind.ModuleDeclaration,
      )
    ) {
      if (!namespace.hasNamespaceKeyword()) {
        continue;
      }

      const statements = namespace.getBody().getStatements();

      let removed = 0;

      for (const statement of statements) {
        if (
          statement.getKind() === ts.SyntaxKind.FunctionDeclaration &&
          statement.getName() === "__promisify__"
        ) {
          statement.remove();
          removed++;
        }
      }

      if (removed === statements.length) {
        namespace.remove();
      }
    }

    for (
      const global of ambientModule.getBody()!.getStatements().filter(
        (statement) =>
          statement.getKind() === ts.SyntaxKind.ModuleDeclaration &&
          statement.getName() === "global",
      )
    ) {
      const exportAssignment = global.getNextSiblingIfKind(
        ts.SyntaxKind.ExportAssignment,
      );
      if (exportAssignment) {
        exportAssignment.remove();
      }

      for (
        const namespace of global.getStatements().filter(
          (statement) =>
            statement.getKind() === ts.SyntaxKind.ModuleDeclaration &&
            statement.hasNamespaceKeyword() && statement.getName() === "NodeJS",
        )
      ) {
        namespace.replaceWithText(namespace.getBodyText());
      }

      global.replaceWithText(global.getBodyText());
    }

    for (
      const qualifiedName of ambientModule.getDescendantsOfKind(
        ts.SyntaxKind.QualifiedName,
      )
    ) {
      const left = qualifiedName.getLeft();
      if (left.getText() === "NodeJS") {
        qualifiedName.replaceWithText(qualifiedName.getRight().getText());
      }
    }

    const moduleName = rewriteModuleName(ambientModule.getName());

    modules[moduleName] ??= "";
    const jsdoc = ambientModule.getFirstChildIfKind(ts.SyntaxKind.JSDoc);

    if (jsdoc) {
      jsdoc.addTag({
        tagName: "module",
      });
      modules[moduleName] = jsdoc.getText() + "\n\n" +
        modules[moduleName];
    }

    modules[moduleName] += ambientModule.getBodyText()!;
  }
}

for (const key of Object.keys(modules)) {
  if (key.endsWith("-posix") || key.endsWith("-win32")) {
    delete modules[key];
  }
}

const requireReexport =
  /^import .+? = require\("(.+?)"\);\s+export = .+?;\s*?$/;

const mergeProject = new Project();
for (const [module, content] of Object.entries(modules)) {
  mergeProject.createSourceFile(`${module}.d.ts`, content);
}

// mapping of old to new module names
const rewrittenModules: Record<string, string> = {};
for (const file of mergeProject.getSourceFiles()) {
  const moduleName = file.getFilePath().slice(Deno.cwd().length + 1, -5);
  const syntaxList = file.getChildSyntaxList();
  if (syntaxList) {
    const children = syntaxList.getChildren();
    // check there is only an export, and that it has a direct child of an asterisk. if it would be an aliased re-export, and not have an asterisk as direct child.
    if (
      (children.length === 1 || children.length === 2) &&
      children[0].getKind() === ts.SyntaxKind.ExportDeclaration &&
      children[0].getFirstChildByKind(ts.SyntaxKind.AsteriskToken) &&
      (children.length === 1 ||
        (children[1].getKind() === ts.SyntaxKind.ExportDeclaration &&
          children[1].getFirstChildByKind(ts.SyntaxKind.NamedExports)))
    ) {
      const importedModule = children[0].getModuleSpecifier().getLiteralValue()
        .slice(2, -5);
      modules[moduleName] = modules[importedModule];
      delete modules[importedModule];
      rewrittenModules[importedModule] = moduleName;
    } else if (requireReexport.test(file.getText())) {
      const importedModule = file.getText().match(requireReexport)![1];
      const jsdoc = file.getFirstDescendantByKind(ts.SyntaxKind.JSDoc);

      if (importedModule.startsWith("node:")) {
        const reversePrefixModuleName = "node__" + moduleName;
        const reverseTrimmedImportedModule = importedModule.slice(5);

        if (jsdoc) {
          modules[reversePrefixModuleName] = jsdoc.getText() +
            modules[reversePrefixModuleName];
        }

        delete modules[reverseTrimmedImportedModule];
        rewrittenModules[reversePrefixModuleName] = reversePrefixModuleName;
      } else {
        if (jsdoc) {
          modules[importedModule] = jsdoc.getText() + modules[importedModule];
        }

        modules[moduleName] = modules[importedModule];
        delete modules[importedModule];
        rewrittenModules[importedModule] = moduleName;
      }
    }
  }
}

// update imports that were rewritten
const importRewriteProject = new Project();
for (const [module, content] of Object.entries(modules)) {
  importRewriteProject.createSourceFile(`${module}.d.ts`, content);
}
for (const file of importRewriteProject.getSourceFiles()) {
  const moduleName = file.getFilePath().slice(Deno.cwd().length + 1, -5);

  for (
    const importOrExportDecl of file.getDescendants().filter((descendant) =>
      descendant.getKind() === ts.SyntaxKind.ImportDeclaration ||
      descendant.getKind() === ts.SyntaxKind.ExportDeclaration
    )
  ) {
    const specifier = importOrExportDecl.getModuleSpecifier();
    if (specifier) {
      const name = specifier.getLiteralValue().slice(2, -5);
      if (name in rewrittenModules) {
        importOrExportDecl.setModuleSpecifier(
          `./${rewrittenModules[name]}.d.ts`,
        );
      }
    }
  }

  modules[moduleName] = file.getFullText();
}

for await (const file of Deno.readDir("types/node")) {
  Deno.removeSync(`types/node/${file.name}`);
}

// temporary, to work around swc bug
delete modules["node__test"];

// weird, investigate how to handle, or just ignore as assert references it
delete modules["assert--strict"];
delete modules["node__assert--strict"];

await Promise.all(
  Object.entries(modules).map(([name, content]) => {
    if (!name.startsWith("node__")) {
      console.warn(`Module '${name}' is not a 'node:' prefixed module`);
    } else {
      //name = name.slice(6);
    }

    return Deno.writeTextFile(`types/node/${name}.d.ts`, content);
  }),
);
