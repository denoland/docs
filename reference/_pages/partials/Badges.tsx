import { JsDoc } from "@deno/doc/types";
import { ValidPropertyType } from "../../types.ts";

export function StabilitySummary({ jsDoc }: { jsDoc: JsDoc | undefined }) {
  const isUnstable = jsDoc?.tags?.some((tag) =>
    tag.kind === "experimental" as string
  );

  if (!isUnstable) {
    return null;
  }

  return (
    <div class="space-x-2 !mt-2">
      <div class="text-unstable border border-unstable/50 bg-unstable/5 inline-flex items-center gap-0.5 *:flex-none rounded-md leading-none font-bold py-2 px-3">
        Unstable
      </div>
    </div>
  );
}

export function PropertyBadges(
  { property }: {
    property: ValidPropertyType;
  },
) {
  return (
    <>
      <OptionalSummary property={property} />
      <ReadOnlySummary property={property} />
    </>
  );
}

export function OptionalSummary(
  { property }: {
    property: ValidPropertyType;
  },
) {
  if (!property.optional) {
    return null;
  }

  return (
    <div class="space-x-1 mb-1">
      <div class="text-optional border border-optional/50 bg-optional/5 inline-flex items-center gap-0.5 *:flex-none rounded-md leading-none text-sm py-1 px-2">
        optional
      </div>
    </div>
  );
}

export function ReadOnlySummary(
  { property }: {
    property: ValidPropertyType;
  },
) {
  if (!property.readonly) {
    return null;
  }

  return (
    <div class="space-x-1 mb-1">
      <div class="text-optional border border-optional/50 bg-optional/5 inline-flex items-center gap-0.5 *:flex-none rounded-md leading-none text-sm py-1 px-2text-readonly border border-readonly/50 bg-readonly/5 inline-flex items-center gap-0.5 *:flex-none rounded-md leading-none text-sm py-1 px-2">
        readonly
      </div>
    </div>
  );
}
