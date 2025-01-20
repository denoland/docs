import { DocNode } from "@deno/doc/types";
import { SymbolDoc } from "../types.ts";

export function classFor(name: string): SymbolDoc<DocNode> {
  return wrap({
    kind: "class",
    name: "A",
    classDef: {
      isAbstract: false,
      extends: "",
      constructors: [],
      implements: [],
      typeParams: [],
      indexSignatures: [],
      methods: [],
      superTypeParams: [],
      properties: [],
      decorators: [],
    },
    declarationKind: "private",
    location: {
      filename: "a.ts",
      line: 1,
      col: 1,
    },
    jsDoc: {
      tags: [
        {
          kind: "category",
          doc: name,
        },
      ],
    },
  });
}

export function wrap(data: DocNode) {
  return {
    name: data.name,
    fullName: data.name,
    namespace: "namespace",
    package: "packageName",
    identifier: data.kind + "_" + ["packageName", data.name].join("."),
    data,
  };
}
