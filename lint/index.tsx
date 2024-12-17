type LintIconType = "jsr" | "react" | "jsx" | "recommended" | "fresh";

export const title = "Lint rules";
export const toc = [];

const getReadableIconName = (iconType: LintIconType) => {
  if (["jsx", "jsr"].includes(iconType)) {
    return iconType.toUpperCase();
  }
  return iconType.charAt(0).toUpperCase() + iconType.slice(1);
};

const getLintIcon = (
  type: LintIconType,
) => {
  const svgFileName = type === "recommended" ? "checkmark" : type;
  return (
    <img
      src={`/img/${svgFileName}.svg`}
      class="size-6"
      alt={type}
    />
  );
};

export default function LintRulesIndex(
  data: Lume.Data,
  _helpers: Lume.Helpers,
) {
  const TYPES = [
    "recommended",
    "fresh",
    "jsx",
    "react",
    "jsr",
  ] as LintIconType[];
  return (
    <div>
      <ul class="flex gap-1 flex-col mb-8 !list-none !pl-0">
        {TYPES.map((iconType) => (
          <li>
            {getLintIcon(iconType)} = {getReadableIconName(iconType)}
          </li>
        ))}
      </ul>

      <ul class="flex flex-col gap-4 !list-none !pl-0">
        {data.lintRulePages.map((lintRule) => (
          <li class="border-t md:border md:rounded-md pt-8 pb-4 md:p-4">
            <div class="flex flex-row justify-start items-center gap-4 mb-4">
              <a href={lintRule.href} class="block text-lg font-mono">
                {lintRule.label}
              </a>{" "}
              {lintRule.tags.map((tag: LintIconType) => getLintIcon(tag))}
            </div>
            <div>
              Lorem ipsum dolor sit amet, <pre>consectetur</pre>{" "}
              adipiscing elit, sed do eiusmod tempor.
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
