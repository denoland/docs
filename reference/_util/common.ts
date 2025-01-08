import { DocNode, DocNodeBase } from "@deno/doc/types";
import { HasNamespace, MightHaveNamespace } from "../types.ts";

export function flattenItems(items: (DocNode & MightHaveNamespace)[]): (DocNodeBase & MightHaveNamespace)[] {
    return populateItemNamespaces(items, true);
}

export function populateItemNamespaces(items: DocNode[], populateNamespace = true, ns = ""): (DocNodeBase & HasNamespace)[] {
    const flattened: (DocNodeBase & HasNamespace)[] = [];

    for (const item of items) {

        if (item.kind === "namespace") {
            const namespace = ns + (ns ? "." : "") + item.name;
            flattened.push(...populateItemNamespaces(item.namespaceDef.elements, populateNamespace, namespace));
        }
        else {
            const withNamespace = { ...item, namespace: "" } as DocNodeBase & HasNamespace;
            withNamespace.namespace = ns;
            withNamespace.fullName = ns
                ? `${ns}.${item.name}`
                : item.name;

            flattened.push(withNamespace);
        }
    }

    return flattened;
}
