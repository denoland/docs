import { CodePart } from "../../_util/symbolStringBuilding.ts";

export function FunctionDefinitionParts(
  { asParts, forceLineBreaks = false }: {
    asParts: CodePart[];
    forceLineBreaks?: boolean;
  },
) {
  const partElements = [];
  for (const part of asParts) {
    if (
      part.kind === "method-brace" && part.value.trim() === ")" &&
      forceLineBreaks
    ) {
      partElements.push(<br />);
    }

    partElements.push(<span className={part.kind}>{part.value}</span>);

    if (
      part.kind === "method-brace" && part.value.trim() === "(" &&
      forceLineBreaks
    ) {
      partElements.push(<br />);
    }

    if (part.kind === "param-separator") {
      partElements.push(<br />);
    }
  }

  return (
    <code>
      {partElements}
    </code>
  );
}
