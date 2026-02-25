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
    <nav class="flex items-center pl-4 bg-header-highlight z-10 h-[var(--subnav-height)] overflow-x-auto xlplus:pl-0">
      <ul class="flex w-full max-w-7xl mx-auto items-center gap-6">
        {navData.map((nav: SidebarNavItem) => (
          <li key={nav.href}>
            <a
              className={`whitespace-nowrap text-sm md:text-base p-0 text-gray-800 block relative after:absolute after:bottom-0 after:left-0 after:origin-right after:transition-transform after:scale-x-0 after:block after:w-full after:h-px after:bg-gray-800 hover:after:scale-x-100 hover:after:origin-left ${
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
