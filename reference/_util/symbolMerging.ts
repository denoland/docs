import {
  DocNodeClass,
  DocNodeInterface,
  DocNodeNamespace,
} from "@deno/doc/types";
import { SymbolDoc } from "../types.ts";

export function mergeSymbolsWithCollidingNames(
  symbolsByIdentifier: Map<string, SymbolDoc[]>,
) {
  const mergedSymbols = Array.from(symbolsByIdentifier.values()).map(
    (items) => {
      if (items.length === 1) {
        return items[0];
      }

      // Sort by priority (class > interface > other)
      const sorted = items.sort((a, b) => {
        if (a.data.kind === "class") return -1;
        if (b.data.kind === "class") return 1;
        if (a.data.kind === "interface") return -1;
        if (b.data.kind === "interface") return 1;
        return 0;
      });

      // Merge docs if available
      const primary = sorted[0];
      const jsDoc = sorted
        .map((s) => s.data.jsDoc?.doc)
        .filter(Boolean)
        .join("\n\n");

      if (jsDoc) {
        primary.data.jsDoc = { ...primary.data.jsDoc, doc: jsDoc };
      }

      // merge members
      if (primary.data.kind === "namespace") {
        mergeSymbolCollections(
          sorted.map((s) =>
            s.data.kind === "namespace" &&
            (s.data as DocNodeNamespace).namespaceDef
          ),
        );
      }

      if (primary.data.kind === "class") {
        mergeSymbolCollections(
          sorted.map((s) =>
            s.data.kind === "class" && (s.data as DocNodeClass).classDef
          ),
        );
      }

      if (primary.data.kind === "interface") {
        mergeSymbolCollections(
          sorted.map((s) =>
            s.data.kind === "interface" &&
            (s.data as DocNodeInterface).interfaceDef
          ),
        );
      }

      return primary;
    },
  );

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
