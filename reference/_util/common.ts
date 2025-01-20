import { DocNode, DocNodeBase } from "@deno/doc/types";
import { MightHaveNamespace } from "../types.ts";

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
  items: DocNode[],
): (DocNodeBase & MightHaveNamespace)[] {
  const flattened: (DocNodeBase)[] = [];
  for (const item of items) {
    if (item.kind === "namespace") {
      flattened.push(...flattenItems(item.namespaceDef.elements));
    } else {
      flattened.push(item);
    }
  }
  return flattened;
}
