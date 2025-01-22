// deno-lint-ignore-file no-explicit-any
import {
  ReferenceContext,
  ReferenceDocumentFactoryFunction,
  SymbolDoc,
} from "../types.ts";
import getPagesForNamespace from "./Namespace.tsx";
import getPagesForNotImplemented from "./NotImplemented.tsx";
import getPagesForModule from "./Module.tsx";
import getPagesForClass from "./Class.tsx";
import getPagesForInterface from "./Interface.tsx";
import getPagesForImport from "./Import.tsx";
import getPagesForFunction from "./Function.tsx";
import getPagesForTypeAlias from "./TypeAlias.tsx";
import getPagesForVariable from "./Variable.tsx";
import getPagesForEnum from "./Enum.tsx";
import { DocNodeBase } from "@deno/doc/types";

const factories = new Map<
  string,
  ReferenceDocumentFactoryFunction<DocNodeBase>
>();

// Any types used here because denofmt ruins the formatting
// Safe because this factories collection never escapes this file
// Actual type: ReferenceDocumentFactoryFunction<DocNodeBase>

factories.set("moduleDoc", getPagesForModule as any);
factories.set("namespace", getPagesForNamespace as any);
factories.set("function", getPagesForFunction as any);
factories.set("variable", getPagesForVariable as any);
factories.set("enum", getPagesForEnum as any);
factories.set("class", getPagesForClass as any);
factories.set("typeAlias", getPagesForTypeAlias as any);
factories.set("interface", getPagesForInterface as any);
factories.set("import", getPagesForImport as any);

function factoryFor<T extends DocNodeBase>(
  item: SymbolDoc<T>,
): ReferenceDocumentFactoryFunction<T> {
  return factories.get(item.data.kind) || getPagesForNotImplemented;
}

export default function generatePageFor<T extends DocNodeBase>(
  item: SymbolDoc<T>,
  context: ReferenceContext,
) {
  const factory = factoryFor(item);
  return factory(item, context) || [];
}
