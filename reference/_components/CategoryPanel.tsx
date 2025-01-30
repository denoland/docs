import type { CategoriesPanelCtx } from "@deno/doc";

export default function (
  { categoryPanel, comp, url }: {
    categoryPanel: CategoriesPanelCtx | null;
    comp: any;
    url: string;
  },
) {
  if (!categoryPanel) {
    return null;
  }

  return (
    <div
      id="categoryPanel"
      className="w-74 pt-2 h-full shrink-0 grow-0 sticky top-16 hidden xl:block border-r border-foreground-tertiary dark:border-background-tertiary"
    >
      <ul class="border-bg-tertiary bg-background-secondary m-2 mt-0 mb-4 py-2 rounded-md border border-background-tertiary">
        <li className="mx-2">
          <comp.HeaderItem
            url="/api/deno"
            active={url.includes("/api/deno")}
            href="/api/deno"
            name="Deno APIs"
          />
        </li>
        <li className="mx-2">
          <comp.HeaderItem
            url="/api/web"
            active={url.includes("/api/web")}
            href="/api/web"
            name="Web APIs"
          />
        </li>
        <li className="mx-2">
          <comp.HeaderItem
            url="/api/node"
            active={url.includes("/api/node")}
            href="/api/node"
            name="Node APIs"
          />
        </li>
      </ul>

      <ul className="mb-4">
        {categoryPanel.categories.map((category) => (
          <li key={category} class={category.active ? "active mx-2" : "mx-2"}>
            <a
              className="block px-3 py-1.5 text-[.8125rem] leading-4 font-normal text-foreground-secondary rounded-md ring-1 ring-transparent hover:ring-background-tertiary hover:bg-background-secondary current:bg-background-secondary current:text-blue-500 current:font-semibold transition-colors duration-200 ease-in-out select-none"
              href={category.href}
              title={category.name}
            >
              {category.name}
            </a>
          </li>
        ))}

        <li className="mx-2">
          <a
            href={categoryPanel.all_symbols_href}
            className="block px-3 py-1.5 text-[.8125rem] leading-4 font-bold text-foreground-secondary rounded-md ring-1 ring-transparent hover:ring-background-tertiary hover:bg-background-secondary current:bg-background-secondary current:text-blue-500 current:font-semibold transition-colors duration-200 ease-in-out select-none"
            title={`View all ${categoryPanel.total_symbols} symbols`}
          >
            View all {categoryPanel.total_symbols} symbols
          </a>
        </li>
      </ul>
    </div>
  );
}
