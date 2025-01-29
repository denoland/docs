import type { CategoriesPanelCtx } from "@deno/doc";

export default function (
  { categoryPanel, comp }: {
    categoryPanel: CategoriesPanelCtx | null;
    comp: any;
  },
) {
  if (!categoryPanel) {
    return null;
  }

  return (
    <div id="categoryPanel">
      <ul>
        {categoryPanel.categories.map((category) => (
          <li key={category} class={category.active ? "active" : ""}>
            <a href={category.href} title={category.name}>{category.name}</a>
          </li>
        ))}

        <li>
          <a
            className="!flex items-center gap-0.5"
            href={categoryPanel.all_symbols_href}
          >
            <span className="leading-none">
              view all {categoryPanel.total_symbols} symbols
            </span>
            <comp.Arrow />
          </a>
        </li>
      </ul>
    </div>
  );
}
