import { DocNode, DocNodeBase, NamespaceDef } from "@deno/doc/types";
import { cliNow } from "../timeUtils.ts";
import { getSymbols } from "./_dataSources/dtsSymbolSource.ts";
import { HasWrappedElements, SymbolDoc } from "./types.ts";
import { mergeSymbolsWithCollidingNames } from "./_util/symbolMerging.ts";
import { generateSymbolIdentity } from "./_util/identityGenerator.ts";

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

    const symbolsByIdentifier = new Map<string, SymbolDoc[]>();

    for (const symbol of enrichedItems) {
      const existing = symbolsByIdentifier.get(symbol.identifier) || [];
      symbolsByIdentifier.set(symbol.identifier, [...existing, symbol]);
    }

    const mergedSymbols = mergeSymbolsWithCollidingNames(symbolsByIdentifier);

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
  namespace: string,
): SymbolDoc {
  const nameString = generateSymbolIdentity(data, packageName, namespace);
  return {
    name: data.name,
    fullName: nameString,
    namespace: namespace,
    package: packageName,
    identifier: nameString,
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
