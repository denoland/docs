import type { Sidebar as Sidebar_, SidebarItem } from "../types.ts";

function generateCrumbs(
  url: string,
  title: string,
  items: SidebarItem[],
  current: SidebarItem[] = [],
): SidebarItem[] {
  for (const item of items) {
    const foundTargetPage = item.href === url;

    if (foundTargetPage) {
      current.push({ title: title });
      return current;
    }

    if (item.items) {
      const childItems: SidebarItem[] = [];
      generateCrumbs(url, title, item.items, childItems);

      if (childItems.length > 0) {
        if (item.href) {
          current.push({ title: item.title, href: item.href });
        }
        current.push(...childItems);
        return current;
      }
    }
  }

  return current;
}

export default function (props: {
  title: string;
  sidebar: Sidebar_;
  url: string;
  sectionTitle: string;
  sectionHref: string;
}, helpers: Lume.Helpers) {
  const crumbs: SidebarItem[] = [];

  for (const section of props.sidebar) {
    if (section.href === props.url) {
      crumbs.push({ title: props.title });
      break;
    }

    const rootItem = { title: section.title, href: section.href };
    const potentialCrumbs = generateCrumbs(
      props.url,
      props.title,
      section?.items || [],
      [rootItem],
    );

    if (potentialCrumbs.length > 1) {
      crumbs.push(...potentialCrumbs);
      break;
    }
  }

  const chevronClasses =
    `after:w-4 after:h-4 after:[background:url(./img/chevron.svg)_no-repeat_center] after:inline-block after:ml-2`;

  return (
    <nav>
      <ul
        class="flex flex- items-center text-center mt-2 -ml-3 text-foreground-secondary sm:mt-4"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
      >
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <a
            class={`flex items-center pl-3 py-1.5 underline underline-offset-4 decoration-foreground-tertiary hover:text-foreground-secondary hover:underline-medium hover:bg-foreground-quaternary dark:hover:bg-background-secondary dark:hover:text-foreground-primary rounded transition duration-100 text-sm ${chevronClasses}`}
            itemprop="item"
            href={props.sectionHref}
          >
            <span
              itemprop="name"
              dangerouslySetInnerHTML={{ __html: props.sectionTitle }}
            />
          </a>
          <meta itemprop="position" content="1" />
        </li>
        {crumbs.map((crumb, i) => (
          <>
            <li
              itemprop="itemListElement"
              itemscope
              itemtype="https://schema.org/ListItem"
            >
              {crumb.href
                ? (
                  <a
                    href={crumb.href}
                    itemprop="item"
                    class={`flex items-center pl-3 py-1.5 underline underline-offset-4 decoration-foreground-tertiary hover:text-foreground-secondary hover:underline-medium hover:bg-foreground-quaternary dark:hover:bg-background-secondary dark:hover:text-foreground-primary rounded transition duration-100 text-sm ${chevronClasses}`}
                  >
                    <span itemprop="name">{crumb.title}</span>
                  </a>
                )
                : (
                  <span
                    itemprop="name"
                    class={`flex items-center pl-2 py-1.5 text-sm ${
                      i < crumbs.length - 1 ? chevronClasses : ""
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: helpers.md(crumb.title, true),
                    }}
                  />
                )}
              <meta itemprop="position" content={String(i + 2)} />
            </li>
          </>
        ))}
      </ul>
    </nav>
  );
}
