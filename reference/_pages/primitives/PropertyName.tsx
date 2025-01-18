import {
  ClassPropertyDef,
  InterfacePropertyDef,
  LiteralPropertyDef,
} from "@deno/doc/types";
import { nbsp } from "../../_util/common.ts";
import { TypeSummary } from "./TypeSummary.tsx";

export function PropertyName(
  { property }: {
    property: ClassPropertyDef | InterfacePropertyDef | LiteralPropertyDef;
  },
) {
  const propertyNameClass = "identifier font-bold font-lg link";
  const propertyTypeClass = "type font-medium text-stone-500";

  const typeInfoElements = property.tsType
    ? (
      <>
        <span className={propertyTypeClass}>:{nbsp}</span>
        <TypeSummary
          typeDef={property.tsType}
          extraClasses={["font-medium", "text-stone-500"]}
        />
      </>
    )
    : <></>;

  return (
    <>
      <span className={propertyNameClass}>{property.name}</span>
      {typeInfoElements}
    </>
  );
}
