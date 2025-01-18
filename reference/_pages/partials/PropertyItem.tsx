import { PropertyName } from "../primitives/PropertyName.tsx";
import { DetailedSection } from "./DetailedSection.tsx";
import { MarkdownContent } from "../primitives/MarkdownContent.tsx";
import { PropertyBadges } from "./Badges.tsx";
import { ValidPropertyWithOptionalJsDoc } from "../../types.ts";

export function PropertyItem(
  { property }: {
    property: ValidPropertyWithOptionalJsDoc;
  },
) {
  const jsDocSection = property.jsDoc?.doc
    ? (
      <DetailedSection>
        <MarkdownContent text={property.jsDoc?.doc} />
      </DetailedSection>
    )
    : null;

  return (
    <div>
      <h3>
        <PropertyBadges property={property} />
        <PropertyName property={property} />
      </h3>
      {jsDocSection}
    </div>
  );
}
