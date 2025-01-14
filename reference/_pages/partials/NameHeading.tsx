import { nbsp } from "../../_util/common.ts";

export function NameHeading(
  { fullName, headingType }: {
    fullName: string;
    headingType:
      | "Class"
      | "Function"
      | "Interface"
      | "TypeAlias"
      | "Variable"
      | "Module"
      | "Namespace"
      | "Import";
  },
) {
  const className = "text-" + headingType;
  const displayName = headingType.toLowerCase();

  return (
    <div className={"text-2xl leading-none break-all"}>
      <span class={className}>{displayName}</span>
      <span class="font-bold">
        {nbsp}
        {fullName}
      </span>
    </div>
  );
}
