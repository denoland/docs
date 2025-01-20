import {
  DocNode,
  DocNodeClass,
  DocNodeInterface,
  DocNodeNamespace,
} from "@deno/doc/types";
import { HasNamespace } from "../types.ts";

export function mergeSymbolsWithCollidingNames(
  symbolsByName: Map<string, (DocNode & HasNamespace)[]>,
) {
  const mergedSymbols = Array.from(symbolsByName.values()).map((items) => {
    if (items.length === 1) {
      return items[0];
    }

    // Sort by priority (class > interface > other)
    const sorted = items.sort((a, b) => {
      if (a.kind === "class") return -1;
      if (b.kind === "class") return 1;
      if (a.kind === "interface") return -1;
      if (b.kind === "interface") return 1;
      return 0;
    });

    // Merge docs if available
    const primary = sorted[0];
    const jsDoc = sorted
      .map((s) => s.jsDoc?.doc)
      .filter(Boolean)
      .join("\n\n");

    if (jsDoc) {
      primary.jsDoc = { ...primary.jsDoc, doc: jsDoc };
    }

    // merge members
    if (primary.kind === "namespace") {
      const asType = sorted as (DocNodeNamespace & HasNamespace)[];
      const namespaceDefs = asType.map((s) => s.namespaceDef);
      mergeSymbolCollections(namespaceDefs);
    }

    if (primary.kind === "class") {
      const asType = sorted as (DocNodeClass & HasNamespace)[];
      const classDefs = asType.map((s) => s.classDef);
      mergeSymbolCollections(classDefs);
    }

    if (primary.kind === "interface") {
      const asType = sorted as (DocNodeInterface & HasNamespace)[];
      const interfaceDefs = asType.map((s) => s.interfaceDef);
      mergeSymbolCollections(interfaceDefs);
    }

    return primary;
  });

  return mergedSymbols;
}

// deno-lint-ignore no-explicit-any
function mergeSymbolCollections(matchingSymbols: any[]) {
  if (matchingSymbols.length < 2) {
    return;
  }

  const primary = matchingSymbols[0];
  if (!primary) {
    return;
  }

  const props = [
    "constructors",
    "methods",
    "properties",
    "indexSignatures",
    "decorators",
    "typeParams",
    "implements",
  ];

  for (const prop of props) {
    if (primary[prop]) {
      const others = matchingSymbols.slice(1);
      for (const source of others) {
        if (!source || !source[prop]) {
          continue;
        }

        primary[prop].push(...source[prop]);
      }
    }
  }
}
