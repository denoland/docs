import {
  ClassMethodDef,
  FunctionDef,
  InterfaceMethodDef,
  LiteralPropertyDef,
  ParamDef,
  ParamIdentifierDef,
  ParamRestDef,
  TsTypeDef,
} from "@deno/doc/types";

export type CodePart = {
  value: string;
  kind: string;
};

function isFunctionDefTypeGuard(
  method: FunctionDef | InterfaceMethodDef,
): method is FunctionDef {
  return (method as FunctionDef).params !== undefined;
}

export function methodSignature(method: ClassMethodDef) {
  const parts: CodePart[] = [];

  if (method.accessibility) {
    parts.push({ value: method.accessibility, kind: "accessibility" });
  }

  if (method.isStatic) {
    parts.push({ value: "static ", kind: "modifier" });
  }

  if (method.isAbstract) {
    parts.push({ value: "abstract ", kind: "modifier" });
  }

  if (method.isOverride) {
    parts.push({ value: "override ", kind: "modifier" });
  }

  parts.push(...functionSignature(method.functionDef, method.name));

  return parts;
}

export function interfaceSignature(iface: InterfaceMethodDef) {
  const parts: CodePart[] = [];
  parts.push(...functionSignature(iface, iface.name));
  return parts;
}

export function functionSignature(
  functionDef: FunctionDef | InterfaceMethodDef,
  nameOverride: string | undefined = undefined,
) {
  const parts: CodePart[] = [];

  const nameValue = isFunctionDefTypeGuard(functionDef)
    ? functionDef.defName || nameOverride || ""
    : functionDef.name || nameOverride || "";

  parts.push({ value: nameValue, kind: "name" });

  if (functionDef.params.length > 0) {
    parts.push({ value: "(", kind: "method-brace" });

    const params = functionDef.params.map((param) => (
      parameter(param)
    ));

    for (const param of params) {
      parts.push(...param);
      parts.push({ value: ", ", kind: "param-separator" });
    }

    parts.pop(); // remove last separator
    parts.push({ value: ")", kind: "method-brace" });
  } else {
    parts.push({ value: "()", kind: "brackets" });
  }

  if (functionDef.returnType) {
    parts.push({ value: ": ", kind: "type" });
    parts.push(...typeInformation(functionDef.returnType));
  }

  return parts;
}

export function parameter(param: ParamDef): CodePart[] {
  const parts: CodePart[] = [];

  if (param.kind === "rest") {
    parts.push(...restParameter(param));
  }

  if (param.kind === "identifier") {
    parts.push(...identifier(param));
  }

  if (param.kind === "array") {
    parts.push({ value: "[]", kind: "identifier" });
  }

  return parts;
}

export function restParameter(param: ParamRestDef): CodePart[] {
  const parts: CodePart[] = [];
  param.arg.tsType = param.tsType; // Fix bug where TSType is not populated.

  parts.push({ value: "...", kind: "identifier" });
  parts.push(...parameter(param.arg));
  return parts;
}

export function identifier(param: ParamIdentifierDef | LiteralPropertyDef) {
  const parts: CodePart[] = [];

  parts.push({ value: "", kind: "identifier-start" });
  parts.push({ value: param.name, kind: "identifier" });

  if (param.optional) {
    parts.push({ value: "?", kind: "identifier" });
  }

  if (param.tsType) {
    parts.push({ value: ": ", kind: "type" });
    parts.push(...typeInformation(param.tsType));
  }

  return parts;
}

export function typeInformation(type: TsTypeDef | undefined): CodePart[] {
  if (!type) {
    return [];
  }

  const parts: CodePart[] = [];

  parts.push({ value: type?.repr || "", kind: "type" });

  if (type.kind === "typeRef") {
    if (type.typeRef && (type.typeRef.typeParams || []).length > 0) {
      const typeParams = type.typeRef.typeParams || [];

      parts.push({ value: "<", kind: "brackets" });

      for (const param of typeParams) {
        parts.push(...typeInformation(param));
        parts.push({ value: ", ", kind: "separator" });
      }

      parts.pop(); // remove last separator
      parts.push({ value: ">", kind: "brackets" });
    }
  }

  if (type.kind === "array") {
    parts.push({ value: type?.array?.repr || "" + "[]", kind: "type" });
    parts.push({ value: "[]", kind: "type" });
  }

  if (type.kind === "literal") {
    parts.push({ value: type.literal.kind, kind: "type" });
  }

  if (type.kind == "typeLiteral") {
    parts.push({ value: "{ ", kind: "brackets" });

    for (const prop of type.typeLiteral.properties) {
      parts.push(...identifier(prop));
      parts.push({ value: "; ", kind: "separator" });
    }

    parts.push({ value: " }", kind: "brackets" });
  }

  if (type.kind === "union") {
    for (const part of type.union) {
      parts.push(...typeInformation(part));
      parts.push({ value: " | ", kind: "separator" });
    }

    parts.pop(); // remove last separator
  }

  if (type.kind === "intersection") {
    for (const part of type.intersection) {
      parts.push(...typeInformation(part));
      parts.push({ value: " & ", kind: "separator" });
    }

    parts.pop(); // remove last separator
  }

  if (type.kind === "parenthesized") {
    parts.push({ value: "(", kind: "brackets" });
    parts.push(...typeInformation(type.parenthesized));
    parts.push({ value: ")", kind: "brackets" });
  }

  if (type.kind === "fnOrConstructor") {
    parts.push({ value: "(", kind: "brackets" });

    if (type.fnOrConstructor.params.length > 0) {
      for (const param of type.fnOrConstructor.params) {
        parts.push(...parameter(param));
        parts.push({ value: ", ", kind: "separator" });
      }

      parts.pop(); // remove last separator
    }

    parts.push({ value: ")", kind: "brackets" });
    parts.push({ value: " => ", kind: "separator" });
    parts.push(...typeInformation(type.fnOrConstructor.tsType));
  }

  if (type.kind === "typeOperator") {
    parts.push({ value: type.typeOperator.operator, kind: "type" });
    parts.push({ value: " ", kind: "type" });
    parts.push(...typeInformation(type.typeOperator.tsType));
  }

  return parts;
}
