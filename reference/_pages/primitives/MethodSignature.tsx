import {
  CodePart,
  interfaceSignature,
  methodSignature,
} from "../../_util/symbolStringBuilding.ts";
import { FunctionDefinitionParts } from "./FunctionDefinitionParts.tsx";
import {
  isClassMethodDef,
  isInterfaceMethodDef,
  ValidMethodType,
} from "../../types.ts";

export function MethodSignature({ method }: { method: ValidMethodType }) {
  let asParts: CodePart[] = [];
  let forceBreaks = false;

  if (isClassMethodDef(method)) {
    asParts = methodSignature(method);
    forceBreaks = method.functionDef.params.length > 1;
  } else if (isInterfaceMethodDef(method)) {
    asParts = interfaceSignature(method);
    forceBreaks = method.params.length > 1;
  }

  const partElements = FunctionDefinitionParts({
    asParts,
    forceLineBreaks: forceBreaks,
  });

  return (
    <>
      {partElements}
    </>
  );
}
