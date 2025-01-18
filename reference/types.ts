import { ClassConstructorDef, ClassMethodDef, ClassPropertyDef, DocNode, DocNodeBase, InterfaceCallSignatureDef, InterfaceIndexSignatureDef, InterfaceMethodDef, InterfacePropertyDef, LiteralCallSignatureDef, LiteralMethodDef, LiteralPropertyDef } from "@deno/doc/types";
import { JSX } from "npm:preact/jsx-runtime";

export type LumeDocument = {
    title: string;
    url: string;
    content: JSX.Element;
}

export interface HasFullName {
    fullName: string;
}

export interface HasNamespace extends HasFullName {
    namespace: string;
    fullName: string;
}

export interface MightHaveNamespace {
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

export type Navigation = {
    category: string;
    currentItemName: string;
}

export type ReferenceContext = {
    root: string;
    packageName: string;
    symbols: DocNode[];
    currentCategoryList: Map<string, string>;
}

export type ReferenceDocumentFactoryFunction<T extends DocNodeBase = DocNodeBase> = (item: T, context: ReferenceContext) => IterableIterator<LumeDocument>;

export type ValidPropertyType = | ClassPropertyDef | InterfacePropertyDef | LiteralPropertyDef;
export type ValidMethodType = ClassMethodDef | InterfaceMethodDef | LiteralMethodDef;
export type ValidCallSignaturesType = InterfaceCallSignatureDef | LiteralCallSignatureDef;
export type ValidIndexSignaturesType = InterfaceIndexSignatureDef | InterfaceIndexSignatureDef;

export type HasJsDoc = {
    jsDoc: { doc: string };
}

export type ValidPropertyWithOptionalJsDoc = ValidPropertyType & {
    jsDoc?: { doc: string };
};

export function isClassMethodDef(method: ValidMethodType): method is ClassMethodDef {
    return (method as ClassMethodDef).functionDef !== undefined;
}

export function isInterfaceMethodDef(method: ValidMethodType): method is InterfaceMethodDef {
    return (method as InterfaceMethodDef).location !== undefined
        && (method as ClassMethodDef).functionDef === undefined;
}

// deno-lint-ignore no-explicit-any
export function hasJsDoc(obj: any): obj is HasJsDoc {
    return obj.jsDoc !== undefined;
}

export interface ClosureContent {
    kind: string;
    constructors: ClassConstructorDef[];
    methods: ValidMethodType[];
    properties: ValidPropertyWithOptionalJsDoc[];
    callSignatures: ValidCallSignaturesType[];
    indexSignatures: ValidIndexSignaturesType[];

    instanceMethods?: ClassMethodDef[];
    staticMethods?: ClassMethodDef[];
}