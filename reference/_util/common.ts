import { DocNode, DocNodeBase } from "@deno/doc/types";
import {
  containsNamespaceDef,
  containsWrappedElements,
  SymbolDoc,
} from "../types.ts";

export const sections = [
  ["Classes", "class"],
  ["Enums", "enum"],
  ["Functions", "function"],
  ["Interfaces", "interface"],
  ["Namespaces", "namespace"],
  ["Type Aliases", "typeAlias"],
  ["Variables", "variable"],
];

export function flattenItems(
  items: (SymbolDoc<DocNode | DocNodeBase>)[],
) {
  const flattened: SymbolDoc<DocNode | DocNodeBase>[] = [];
  for (const item of items) {
    if (item.data.kind === "namespace") {
      if (
        containsNamespaceDef(item.data) &&
        containsWrappedElements(item.data.namespaceDef)
      ) {
        const eles = item.data.namespaceDef.wrappedElements as SymbolDoc<
          DocNode
        >[];

        flattened.push(...flattenItems(eles));
      } else {
        throw new Error("NamespaceDef does not have wrappedElements");
      }
    } else {
      flattened.push(item);
    }
  }
  return flattened;
}

export const nbsp = "\u00A0";
