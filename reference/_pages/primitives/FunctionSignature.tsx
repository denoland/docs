import { FunctionDef } from "@deno/doc/types";
import { functionSignature } from "../../_util/symbolStringBuilding.ts";
import { FunctionDefinitionParts } from "./FunctionDefinitionParts.tsx";

export function FunctionSignature(
  { functionDef, nameOverride = undefined }: {
    functionDef: FunctionDef;
    nameOverride?: string | undefined;
  },
) {
  const asParts = functionSignature(functionDef, nameOverride);
  const partElements = FunctionDefinitionParts({
    asParts,
    forceLineBreaks: functionDef.params.length > 1,
  });

  return (
    <>
      {partElements}
    </>
  );
}
