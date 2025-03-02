type LintIconType = "jsr" | "react" | "jsx" | "recommended" | "fresh";

export const title = "List of rules";
export const toc = [];
export const oldUrl = "/lint/rules";

const getReadableIconName = (iconType: LintIconType) => {
  if (["jsx", "jsr"].includes(iconType)) {
    return iconType.toUpperCase();
  }
  return iconType.charAt(0).toUpperCase() + iconType.slice(1);
};

export const getLintIcon = (
  type: LintIconType,
) => {
  const svgFileName = type === "recommended" ? "checkmark" : type;
  return (
    <img
      src={`/img/${svgFileName}.svg`}
      class="size-6 !bg-transparent"
      alt={getReadableIconName(type)}
      title={getReadableIconName(type)}
    />
  );
};

export default function LintRulesIndex(
  data: Lume.Data,
  helpers: Lume.Helpers,
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
      <div class="flex flex-col gap-4 mb-8">
        <p>
          These lint rules are provided by the{" "}
          <a href="/runtime/reference/cli/lint/">
            <code>deno lint</code>
          </a>{" "}
          command. You can enable sets of rules in <code>deno.json(c)</code>
          {" "}
          by adding their tags (e.g. <code>recommended</code>,{" "}
          <code>react</code>) to the <code>lint.rules.tags</code> array.
        </p>
        <input
          type="text"
          id="lint-rule-search"
          placeholder="Search lint rules"
          className="
          w-full
          lg:flex
          rounded-md
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

        <ul
          class="flex flex-wrap gap-2 mb-8 !list-none !pl-0"
          aria-labelledby="lint-rules-key"
        >
          {TYPES.map((iconType) => (
            <li class="p-1.5 px-3 rounded-md bg-background-secondary/30 border border-background-secondary w-max max-w-full !m-0 whitespace-pre-wrap">
              {getLintIcon(iconType)}&ensp;{getReadableIconName(iconType)}
            </li>
          ))}
        </ul>
      </div>

      <ul class="flex flex-col gap-4 !list-none !pl-0">
        {data.lintRulePages.map((lintRule, idx: number) => (
          <li
            class="border-t md:border md:rounded-md pt-8 pb-4 md:p-4 lint-rule-box dark:border-gray-700"
            id={lintRule.title}
          >
            <div class="flex flex-row justify-start items-center gap-4 mb-2">
              <a href={lintRule.href} class="block font-mono">
                {lintRule.title}
              </a>{" "}
              {lintRule.tags.map((tag: LintIconType) => (
                <div class="bg-background-secondary/30 border border-background-secondary rounded-md p-1">
                  {getLintIcon(tag)}
                </div>
              ))}
            </div>
            <div
              class="text-sm [&>*]:last:mb-0"
              dangerouslySetInnerHTML={{
                __html: helpers.md(
                  lintRule.content.split(/\n\n/)[0] +
                    ` <a href="${lintRule.href}">Details<span class="sr-only"> about ${lintRule.label}</span></a>`,
                ),
              }}
            >
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
