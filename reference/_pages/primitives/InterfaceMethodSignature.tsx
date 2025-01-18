import { InterfaceMethodDef } from "@deno/doc/types";
import { interfaceSignature } from "../../_util/symbolStringBuilding.ts";
import { FunctionDefinitionParts } from "./FunctionDefinitionParts.tsx";

export function InterfaceMethodSignature(
  { method }: { method: InterfaceMethodDef },
) {
  const asParts = interfaceSignature(method);
  const partElements = FunctionDefinitionParts({
    asParts,
    forceLineBreaks: method.params.length > 1,
  });

  return (
    <>
      {partElements}
    </>
  );
}
