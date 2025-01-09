import {
  ClassMethodDef,
  ParamDef,
  ParamIdentifierDef,
  ParamRestDef,
  TsTypeDef,
} from "@deno/doc/types";

export function methodSignature(method: ClassMethodDef) {
  const parts = [];
  if (method.accessibility) {
    parts.push(method.accessibility);
  }

  if (method.isStatic) {
    parts.push("static ");
  }

  if (method.isAbstract) {
    parts.push("abstract ");
  }

  if (method.isOverride) {
    parts.push("override ");
  }

  parts.push(method.functionDef.defName || method.name);

  if (method.functionDef.params.length > 0) {
    console.log(method.functionDef);
    const params = method.functionDef.params.map((param) => (
      methodParameter(param)
    ));

    parts.push(`(${params.join(", ")})`);
  } else {
    parts.push("()");
  }

  return parts.join("");
}

export function methodParameter(param: ParamDef): string {
  console.log(param);
  const parts = [];

  if (param.kind === "rest") {
    parts.push(restParameter(param));
  }

  if (param.kind === "identifier") {
    parts.push(identifier(param));
  }

  if (param.kind === "array") {
    parts.push("[]");
  }

  return parts.join("");
}

export function restParameter(param: ParamRestDef) {
  const parts = [];
  parts.push("...");
  parts.push(methodParameter(param.arg));
  return parts.join("");
}

export function identifier(param: ParamIdentifierDef) {
  const parts = [];
  parts.push(param.name);
  if (param.optional) {
    parts.push("?");
  }

  if (param.tsType) {
    parts.push(typeInformation(param.tsType));
  }
  return parts.join("");
}

export function typeInformation(type: TsTypeDef | undefined) {
  if (!type) {
    return "";
  }

  const parts = [];
  parts.push(": ");
  parts.push(type.repr);
  if (type.kind === "array") {
    parts.push("[]");
  }

  return parts.join("");
}
