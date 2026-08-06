import { SidebarNavItem } from "../types.ts";

export default function (
  { data, currentUrl }: {
    data: Lume.Data;
    currentUrl: string;
  },
) {
  const navData = data.page?.data?.SidebarNav;
  const isReference = currentUrl.startsWith("/api");

  // Don't render SubNav for API reference pages - these will be handled in the sidebar
  if (isReference) {
    return null;
  }

  const getActiveHref = (): string | null => {
    if (!Array.isArray(navData) || navData.length === 0) return null;

    const urlNoQuery = currentUrl.split("?")[0].split("#")[0];

    const isSegmentPrefix = (href: string, url: string): boolean => {
      if (!url.startsWith(href)) return false;
      if (url.length === href.length) return true; // exact match
      // If href does not end with a slash, ensure the next char is a boundary
      if (!href.endsWith("/")) {
        const next = url[href.length];
        return next === "/" || next === "?" || next === "#";
      }
      // href ends with "/"; consider it matching a segment prefix
      return true;
    };

    const matches = navData
      .map((n: SidebarNavItem) => n.href)
      .filter((href: string) =>
        typeof href === "string" && isSegmentPrefix(href, urlNoQuery)
      )
      .sort((a, b) => b.length - a.length); // longest prefix wins

    return matches[0] ?? null;
  };

  const activeHref = getActiveHref();

  return (
    <nav className="flex items-center z-10 h-(--subnav-height) overflow-x-auto border-t border-foreground-tertiary -margin-t-px">
      <ul className="flex w-full h-full mx-auto items-stretch">
        {navData.map((nav: SidebarNavItem) => (
          <li
            key={nav.href}
            className={`h-full flex items-center px-4 justify-center ${
              nav.href === activeHref ? "bg-header-highlight text-gray-800" : ""
            }`}
          >
            <a
              className={`whitespace-nowrap text-sm p-0 block relative ${
                nav.href === activeHref ? "font-bold" : ""
              }`}
              data-active={nav.href === activeHref}
              {...(currentUrl === nav.href
                ? { "aria-current": "page" }
                : nav.href === activeHref
                ? { "aria-current": "location" }
                : {})}
              href={nav.href}
            >
              {typeof nav.title === "string"
                ? <span dangerouslySetInnerHTML={{ __html: nav.title }}></span>
                : nav.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
