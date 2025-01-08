import { DocNode, DocNodeBase } from "@deno/doc/types";
import { JSX } from "npm:preact/jsx-runtime";

export type LumeDocument = {
    title: string;
    url: string;
    content: JSX.Element;
}

export type HasNamespace = {
    namespace: string;
    fullName: string;
}

export type MightHaveNamespace = {
    namespace?: string;
    fullName?: string;
}

export type ReferenceDocCategory = {
    id: string;
    label: string;
}

export type ReferenceDocContext = {
    categories: ReferenceDocCategory[];
}

export type ReferenceContext = {
    root: string;
    section: string;
    dataCollection: DocNode[];
    definitionFile: string;
    parentName: string;
    referenceDocContext: ReferenceDocContext;
}

export type ReferenceDocumentFactoryFunction<T extends DocNodeBase = DocNodeBase> = (item: T, context: ReferenceContext) => IterableIterator<LumeDocument>;
