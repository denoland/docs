import { TsTypeDef } from "@deno/doc/types";
import { typeInformation } from "../../_util/symbolStringBuilding.ts";
import { JSX } from "npm:preact/jsx-runtime";

type Props = {
  typeDef: TsTypeDef | undefined;
  extraClasses?: string[];
  beforeEach?: JSX.Element;
};

export function TypeSummary(
  { typeDef, extraClasses = [], beforeEach }: Props,
) {
  if (!typeDef) {
    return null;
  }

  const parts = typeInformation(typeDef);

  const elements = parts.map((part) => {
    const classes = [part.kind, ...extraClasses].join(" ");
    return (
      <>
      <div></div>
        {part.kind === "separator" && beforeEach}
        <span className={classes}>{part.value}</span>
      </>
    );
  });

  return <>{elements}</>;
}
