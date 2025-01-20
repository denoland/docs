import { TsTypeDef } from "@deno/doc/types";
import { TypeSummary } from "../primitives/TypeSummary.tsx";

export function ImplementsSummary({ typeDef }: { typeDef: TsTypeDef[] }) {
  if (typeDef.length === 0) {
    return null;
  }

  const spans = typeDef.map((iface) => {
    return <TypeSummary typeDef={iface} />;
  });

  if (spans.length === 0) {
    return null;
  }

  return (
    <div class="symbolSubtitle">
      <div>
        <span class="type">implements{" "}</span>
        {spans}
      </div>
    </div>
  );
}
