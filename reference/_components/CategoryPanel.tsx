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
      className="flex flex-col absolute top-0 xl:top-16 bottom-0 -translate-x-74 xl:left-0 sidebar-open:translate-x-0 w-74 border-r border-foreground-tertiary bg-background-primary z-50 xl:z-0 xl:translate-x-0 transition-transform"
    >
      <ul class=" border-bg-tertiary relative bg-background-secondary m-2 mt-0 mb-4 py-2 rounded-md border border-background-tertiary">
        <li className="mx-2">
          <h1>{url}</h1>
          <comp.HeaderItem
            url="/api/deno"
            active={true}
            href="/api/deno"
            name="Deno APIs"
          />
        </li>
        <li className="mx-2">
          <comp.HeaderItem
            url="/api/web"
            active="/api/web"
            href="/api/web"
            name="Web APIs"
          />
        </li>
        <li className="mx-2">
          <comp.HeaderItem
            url="/api/node"
            active="/api/node"
            href="/api/node"
            name="Node APIs"
          />
        </li>
      </ul>

      <ul className="mb-4 mt-3">
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
