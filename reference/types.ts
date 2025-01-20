import {
  ClassConstructorDef,
  ClassMethodDef,
  ClassPropertyDef,
  DocNode,
  DocNodeBase,
  InterfaceCallSignatureDef,
  InterfaceIndexSignatureDef,
  InterfaceMethodDef,
  InterfacePropertyDef,
  LiteralCallSignatureDef,
  LiteralMethodDef,
  LiteralPropertyDef,
  NamespaceDef,
} from "@deno/doc/types";
import { JSX } from "npm:preact/jsx-runtime";

export interface SymbolDoc<T = DocNodeBase> {
  name: string;
  fullName: string;
  namespace: string;
  package: string;
  identifier: string;

  data: T;
}

export interface HasWrappedElements {
  wrappedElements: SymbolDoc<DocNodeBase>[];
}

export interface HasNamespaceDef {
  namespaceDef: NamespaceDef;
}

export interface HasModuleDoc {
  moduleDoc: DocNode;
}

export function containsWrappedElements(
  method: unknown,
): method is HasWrappedElements {
  return (method as HasWrappedElements).wrappedElements !== undefined;
}

export function containsNamespaceDef(
  method: unknown,
): method is HasNamespaceDef {
  return (method as HasNamespaceDef).namespaceDef !== undefined;
}

export function containsModuleDoc(
  method: unknown,
): method is HasModuleDoc {
  return (method as HasModuleDoc).moduleDoc !== undefined;
}

export type LumeDocument = {
  title: string;
  url: string;
  content: JSX.Element;
};

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
};

export type ReferenceDocContext = {
  categories: ReferenceDocCategory[];
};

export type Navigation = {
  category: string;
  currentItemName: string;
};

export type WebCategoryDetails = {
  title: string;
  description: string;
  urlStub: string;
};

export type ReferenceContext = {
  root: string;
  packageName: string;
  symbols: SymbolDoc[];
  currentCategoryList: Map<string, WebCategoryDetails>;
};

export type ReferenceDocumentFactoryFunction<
  T extends DocNodeBase = DocNodeBase,
> = (
  item: SymbolDoc<T>,
  context: ReferenceContext,
) => IterableIterator<LumeDocument>;

export type ValidPropertyType =
  | ClassPropertyDef
  | InterfacePropertyDef
  | LiteralPropertyDef;
export type ValidMethodType =
  | ClassMethodDef
  | InterfaceMethodDef
  | LiteralMethodDef;
export type ValidCallSignaturesType =
  | InterfaceCallSignatureDef
  | LiteralCallSignatureDef;
export type ValidIndexSignaturesType =
  | InterfaceIndexSignatureDef
  | InterfaceIndexSignatureDef;

export type HasJsDoc = {
  jsDoc: { doc: string };
};

export type ValidPropertyWithOptionalJsDoc = ValidPropertyType & {
  jsDoc?: { doc: string };
};

export function isClassMethodDef(
  method: ValidMethodType,
): method is ClassMethodDef {
  return (method as ClassMethodDef).functionDef !== undefined;
}

export function isInterfaceMethodDef(
  method: ValidMethodType,
): method is InterfaceMethodDef {
  return (method as InterfaceMethodDef).location !== undefined &&
    (method as ClassMethodDef).functionDef === undefined;
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
