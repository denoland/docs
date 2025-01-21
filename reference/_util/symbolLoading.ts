import { DocNode, NamespaceDef } from "@deno/doc/types";
import { cliNow } from "../../timeUtils.ts";
import { getSymbols } from "../_dataSources/dtsSymbolSource.ts";
import { HasWrappedElements, PackageConfig, SymbolDoc } from "../types.ts";
import { mergeSymbolsWithCollidingNames } from "./symbolMerging.ts";
import { generateSymbolIdentity } from "./identityGenerator.ts";

export async function getAllSymbols(packages: PackageConfig[]) {
  const allSymbols = new Map<string, SymbolDoc[]>();
  for await (
    const { packageName, symbols, sourceFileName } of getSymbols(packages)
  ) {
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
  namespace = "",
): SymbolDoc[] {
  const flattened: SymbolDoc[] = [];

  for (const item of items) {
    const identity = generateSymbolIdentity(item, packageName, namespace);
    const wrapped = {
      name: item.name,
      fullName: identity,
      namespace: namespace,
      package: packageName,
      identifier: identity,
      data: item,
    };

    if (item.kind === "namespace") {
      flattened.push(wrapped);

      const childrensNamespace = namespace + (namespace ? "." : "") + item.name;
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
