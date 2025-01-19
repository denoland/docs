import { DocNode, DocNodeBase, DocNodeNamespace } from "@deno/doc/types";
import { cliNow } from "../timeUtils.ts";
import { getSymbols } from "./_dataSources/dtsSymbolSource.ts";
import { HasFullName, HasNamespace } from "./types.ts";
import { mergeSymbolsWithCollidingNames } from "./_util/symbolMerging.ts";

export async function getAllSymbols() {
  const allSymbols = new Map<string, DocNode[]>();
  for await (const { packageName, symbols, sourceFileName } of getSymbols()) {
    console.log(
      `${cliNow()} 📚 ${packageName}:${sourceFileName} has ${
        countSymbols(symbols)
      } symbols`,
    );

    const enrichedItems = decorateNodesWithExtraData(
      symbols,
    ) as (DocNode & HasNamespace)[];

    const symbolsByName = new Map<string, (DocNode & HasNamespace)[]>();

    for (const symbol of enrichedItems) {
      const existing = symbolsByName.get(symbol.fullName) || [];
      symbolsByName.set(symbol.name, [...existing, symbol]);
    }

    const mergedSymbols = mergeSymbolsWithCollidingNames(symbolsByName);

    if (allSymbols.has(packageName)) {
      const existingSymbols = allSymbols.get(packageName) || [];
      allSymbols.set(packageName, [...existingSymbols, ...mergedSymbols]);
    } else {
      allSymbols.set(packageName, mergedSymbols);
    }
  }

  return allSymbols;
}

function decorateNodesWithExtraData(
  items: DocNode[],
  populateNamespace = true,
  ns = "",
): (DocNodeBase & HasNamespace)[] {
  const flattened: (DocNodeBase & HasNamespace)[] = [];

  for (const item of items) {
    const withFullName = item as DocNodeBase & HasFullName;
    withFullName.fullName = item.name;

    if (item.kind === "namespace") {
      const withNamespace = item as DocNodeNamespace & HasNamespace;
      withNamespace.namespace = "";
      withNamespace.fullName = item.name;
      flattened.push(withNamespace);

      const namespace = ns + (ns ? "." : "") + item.name;

      flattened.push(
        ...decorateNodesWithExtraData(
          item.namespaceDef.elements,
          populateNamespace,
          namespace,
        ),
      );
    } else {
      const withNamespace = item as DocNodeBase & HasNamespace;
      withNamespace.namespace = ns;
      withNamespace.fullName = ns ? `${ns}.${item.name}` : item.name;

      flattened.push(withNamespace);
    }
  }

  return flattened;
}

export function countSymbols(symbols: DocNode[]): number {
  let count = 0;
  for (const symbol of symbols) {
    count++;
    if (symbol.kind === "namespace" && symbol.namespaceDef) {
      count += countSymbols(symbol.namespaceDef.elements);
    }
  }
  return count;
}
