import { ReferenceDocumentFactoryFunction } from "./types.ts";
import getPagesForNamespace from "./_pages/Namespace.tsx";
import getPagesForNotImplemented from "./_pages/NotImplemented.tsx";
import getPagesForModule from "./_pages/Module.tsx";
import getPagesForClass from "./_pages/Class.tsx";
import getPagesForInterface from "./_pages/Interface.tsx";
import getPagesForImport from "./_pages/Import.tsx";
import getPagesForFunction from "./_pages/Function.tsx";
import getPagesForTypeAlias from "./_pages/TypeAlias.tsx";
import getPagesForVariable from "./_pages/Variable.tsx";
import { DocNodeBase } from "@deno/doc/types";

const factories = new Map<string, ReferenceDocumentFactoryFunction<DocNodeBase>>();
factories.set("moduleDoc", getPagesForModule as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("namespace", getPagesForNamespace as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("function", getPagesForFunction as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("variable", getPagesForVariable as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("enum", getPagesForNotImplemented as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("class", getPagesForClass as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("typeAlias", getPagesForTypeAlias as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("interface", getPagesForInterface as ReferenceDocumentFactoryFunction<DocNodeBase>);
factories.set("import", getPagesForImport as ReferenceDocumentFactoryFunction<DocNodeBase>);

export default function factoryFor<T extends DocNodeBase>(item: T): ReferenceDocumentFactoryFunction<T> {
    return factories.get(item.kind) || getPagesForNotImplemented;
}