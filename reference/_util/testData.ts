import { DocNode } from "@deno/doc/types";

export function classFor(name: string): DocNode {
    return {
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
        }
    };
}
