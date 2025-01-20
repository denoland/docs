import { DocNode, DocNodeBase, NamespaceDef } from "@deno/doc/types";
import { cliNow } from "../timeUtils.ts";
import { getSymbols } from "./_dataSources/dtsSymbolSource.ts";
import { HasWrappedElements, SymbolDoc } from "./types.ts";
import { mergeSymbolsWithCollidingNames } from "./_util/symbolMerging.ts";

export async function getAllSymbols() {
  const allSymbols = new Map<string, SymbolDoc[]>();
  for await (const { packageName, symbols, sourceFileName } of getSymbols()) {
    console.log(
      `${cliNow()} 📚 ${packageName}:${sourceFileName} has ${
        countSymbols(symbols)
      } symbols`,
    );

    const enrichedItems = decorateNodesWithExtraData(
      symbols,
      packageName,
    );

    const symbolsByName = new Map<string, SymbolDoc[]>();

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
  packageName: string,
  populateNamespace = true,
  ns = "",
): SymbolDoc[] {
  const flattened: SymbolDoc[] = [];

  for (const item of items) {
    const wrapped = createSymbolWrapper(item, packageName, ns);

    if (item.kind === "namespace") {
      flattened.push(wrapped);

      const childrensNamespace = ns + (ns ? "." : "") + item.name;
      const children = decorateNodesWithExtraData(
        item.namespaceDef.elements,
        packageName,
        populateNamespace,
        childrensNamespace,
      );

      const asWrappedContainer = item.namespaceDef as
        & NamespaceDef
        & HasWrappedElements;

      asWrappedContainer.wrappedElements = children;

      flattened.push(...children);
    } else {
      flattened.push(wrapped);
    }
  }

  return flattened;
}

function createSymbolWrapper(
  data: DocNodeBase,
  packageName: string,
  ns = "",
): SymbolDoc {
  const nameString = ns ? `${ns}.${data.name}` : data.name;
  return {
    name: data.name,
    fullName: nameString,
    namespace: ns,
    package: packageName,
    identifier: data.kind + "_" + [packageName, nameString].join("."),
    data,
  };
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
