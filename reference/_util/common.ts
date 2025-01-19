import { DocNode, DocNodeBase, DocNodeNamespace } from "@deno/doc/types";
import { HasFullName, HasNamespace, MightHaveNamespace } from "../types.ts";

export const sections = [
    ["Classes", "class"],
    ["Enums", "enum"],
    ["Functions", "function"],
    ["Interfaces", "interface"],
    ["Namespaces", "namespace"],
    ["Type Aliases", "typeAlias"],
    ["Variables", "variable"],
];

export function flattenItems(items: DocNode[]): (DocNodeBase & MightHaveNamespace)[] {
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

export function decorateNodesWithExtraData(items: DocNode[], populateNamespace = true, ns = ""): (DocNodeBase & HasNamespace)[] {
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
            flattened.push(...decorateNodesWithExtraData(item.namespaceDef.elements, populateNamespace, namespace));
        } else {
            const withNamespace = item as DocNodeBase & HasNamespace;
            withNamespace.namespace = ns;
            withNamespace.fullName = ns
                ? `${ns}.${item.name}`
                : item.name;

            flattened.push(withNamespace);
        }
    }

    return flattened;
}

export const nbsp = "\u00A0";

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
