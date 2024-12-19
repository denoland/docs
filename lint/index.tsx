type LintIconType = "jsr" | "react" | "jsx" | "recommended" | "fresh";

export const title = "Overview";
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

      <div class="flex mb-8">
        <input
          type="text"
          id="lint-rule-search"
          placeholder="Search..."
          className="
          w-full
          lg:flex
          rounded-lg
          items-center
          text-sm
          leading-6
          py-1.5 pl-2 pr-3
          border
          text-slate-600
          bg-slate-100
          dark:bg-background-secondary
          dark:text-slate-200
          dark:highlight-white/5
          dark:hover:bg-slate-700
          dark:border-foreground-tertiary
          hover:bg-slate-200
          duration-150 ease-in-out"
        />
      </div>

      <ul class="flex flex-col gap-4 !list-none !pl-0">
        {data.lintRulePages.map((lintRule) => (
          <li
            class="border-t md:border md:rounded-md pt-8 pb-4 md:p-4 lint-rule-box"
            id={lintRule.label}
          >
            <div class="flex flex-row justify-start items-center gap-4 mb-4">
              <a href={lintRule.href} class="block text-lg font-mono">
                {lintRule.label}
              </a>{" "}
              {lintRule.tags.map((tag: LintIconType) => getLintIcon(tag))}
            </div>
            <div>
              Lorem ipsum dolor sit amet, <code>consectetur</code>{" "}
              adipiscing elit, sed do eiusmod tempor.
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
