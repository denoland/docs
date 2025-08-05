import type { Sidebar as Sidebar_, SidebarItem } from "../types.ts";

function buildBreadcrumbPath(
  url: string,
  title: string,
  items: SidebarItem[],
  breadcrumbPath: SidebarItem[] = [],
): SidebarItem[] | null {
  for (const item of items) {
    // Check if this is the target page
    if (item.href === url) {
      return [...breadcrumbPath, { title }];
    }

    // If item has children, search recursively
    if (item.items && item.items.length > 0) {
      const childPath = buildBreadcrumbPath(
        url,
        title,
        item.items,
        [...breadcrumbPath, { title: item.title, href: item.href }],
      );

      if (childPath) {
        return childPath;
      }
    }
  }

  return null;
}

export default function Breadcrumbs(props: {
  title: string;
  sidebar: Sidebar_;
  url: string;
}) {
  let breadcrumbs: SidebarItem[] = [];

  // Extract the top-level section from the URL (e.g., "runtime", "deploy")
  const topLevelSection = props.url.split("/").filter(Boolean)[0];

  // Define section name mappings for better display
  const sectionNames: Record<string, string> = {
    "runtime": "Runtime",
    "services": "Services",
    "deploy": "Deploy",
    "subhosting": "Subhosting",
    "examples": "Examples",
    "lint": "Lint",
    "api": "API Reference",
  };

  // Search through all sidebar sections to find the breadcrumb path
  for (const section of props.sidebar) {
    // Check if the current URL is a top-level section
    if (section.href === props.url) {
      // If this page IS the section, just show the page title
      breadcrumbs = [{ title: props.title }];
      break;
    }

    // Search within section items if they exist
    if (section.items) {
      const foundPath = buildBreadcrumbPath(
        props.url,
        props.title,
        section.items,
        [], // Start with empty path, we'll add section as base
      );

      if (foundPath) {
        // Add the top-level section as the base breadcrumb
        const sectionDisplayName = sectionNames[topLevelSection] ||
          (topLevelSection?.charAt(0).toUpperCase() +
            topLevelSection?.slice(1)) ||
          "Docs";

        breadcrumbs = [
          { title: sectionDisplayName, href: `/${topLevelSection}/` },
          ...foundPath,
        ];
        break;
      }
    }
  }

  // If no breadcrumbs found, just show the current page title
  if (breadcrumbs.length === 0) {
    breadcrumbs = [{ title: props.title }];
  }

  const linkClasses =
    "flex items-center pl-3 py-1.5 underline underline-offset-4 decoration-foreground-tertiary hover:text-foreground-secondary hover:underline-medium hover:bg-foreground-quaternary dark:hover:bg-background-secondary dark:hover:text-foreground-primary rounded transition duration-100 text-xs";

  const chevronClasses =
    "after:w-4 after:h-4 after:[background:url(./img/chevron.svg)_no-repeat_center] after:inline-block after:ml-2";

  return (
    <nav>
      <ul
        class="flex items-center text-center mt-2 -ml-3 text-foreground-secondary sm:mt-4"
        itemscope
        itemtype="https://schema.org/BreadcrumbList"
      >
        {breadcrumbs.map((crumb, i) => (
          <li
            key={i}
            itemprop="itemListElement"
            itemscope
            itemtype="https://schema.org/ListItem"
          >
            {crumb.href
              ? (
                <a
                  href={crumb.href}
                  itemprop="item"
                  class={`${linkClasses} ${
                    i < breadcrumbs.length - 1 ? chevronClasses : ""
                  }`}
                >
                  <span itemprop="name">
                    {typeof crumb.title === "string"
                      ? crumb.title
                      : crumb.title}
                  </span>
                </a>
              )
              : (
                <span
                  itemprop="name"
                  class={`flex items-center pl-2 py-1.5 text-xs ${
                    i < breadcrumbs.length - 1 ? chevronClasses : ""
                  }`}
                >
                  {typeof crumb.title === "string" ? crumb.title : crumb.title}
                </span>
              )}
            <meta itemprop="position" content={String(i + 1)} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
