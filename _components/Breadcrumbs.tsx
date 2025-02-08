import type { Sidebar as Sidebar_, SidebarItem } from "../types.ts";

export function generateCrumbs(
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

export function Breadcrumbs(props: {
  title: string;
  sidebar: Sidebar_;
  url: string;
  sectionTitle: string;
  sectionHref: string;
}) {
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

  return (
    <nav class="mb-4">
      <ul
        class="flex flex-wrap text-foreground-secondary items-center -ml-3"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
      >
        <li
          itemprop="itemListElement"
          itemscope
          itemtype="https://schema.org/ListItem"
        >
          <a
            class="block px-3 py-1.5 underline underline-offset-4 decoration-foreground-tertiary hover:text-foreground-secondary hover:underline-medium hover:bg-foreground-tertiary dark:hover:bg-background-secondary dark:hover:text-foreground-primary rounded transition duration-100 text-sm"
            itemprop="item"
            href={props.sectionHref}
          >
            <span itemprop="name">{props.sectionTitle}</span>
          </a>
          <meta itemprop="position" content="1" />
        </li>
        <li>
          <svg
            class="size-4 text-foreground-secondary rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
            />
          </svg>
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
                    class="block px-3 py-1.5 underline underline-offset-4 decoration-foreground-tertiary hover:text-foreground-secondary hover:underline-medium hover:bg-foreground-tertiary dark:hover:bg-background-secondary dark:hover:text-foreground-primary rounded transition duration-100 text-sm"
                  >
                    <span itemprop="name">{crumb.title}</span>
                  </a>
                )
                : (
                  <span itemprop="name" class="block px-3 py-1.5 text-sm">
                    {crumb.title}
                  </span>
                )}
              <meta itemprop="position" content={String(i + 2)} />
            </li>
            {i < crumbs.length - 1 && (
              <li>
                <svg
                  class="size-4 text-foreground-secondary rotate-90"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
                  >
                  </path>
                </svg>
              </li>
            )}
          </>
        ))}
      </ul>
    </nav>
  );
}
