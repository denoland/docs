import { TsTypeDef } from "@deno/doc/types";
import { typeInformation } from "../../_util/symbolStringBuilding.ts";

type Props = {
  typeDef: TsTypeDef | undefined;
  extraClasses?: string[];
};

export function TypeSummary(
  { typeDef, extraClasses = [] }: Props,
) {
  if (!typeDef) {
    return null;
  }

  const parts = typeInformation(typeDef);

  const elements = parts.map((part) => {
    const classes = [part.kind, ...extraClasses].join(" ");
    return <span className={classes}>{part.value}</span>;
  });

  return <>{elements}</>;
}
