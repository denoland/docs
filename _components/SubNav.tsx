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

  return (
    <nav
      id="refheader"
      class="flex items-center pl-4 bg-header-highlight z-10 h-[var(--subnav-height)] overflow-x-auto xlplus:pl-0"
    >
      <ul class="flex w-full max-w-7xl mx-auto items-center gap-6">
        {navData.map((nav: SidebarNavItem) => (
          <li key={nav.href}>
            <a
              className={`whitespace-nowrap text-sm md:text-base p-0 text-gray-800 block relative after:absolute after:bottom-0 after:left-0 after:origin-right after:transition-transform after:scale-x-0 after:block after:w-full after:h-px after:bg-gray-800 hover:after:scale-x-100 hover:after:origin-left ${
                currentUrl.includes(nav.href) ? "font-bold" : ""
              }`}
              data-active={currentUrl.includes(nav.href)}
              {...(currentUrl === nav.href
                ? { "aria-current": "page" }
                : currentUrl.includes(nav.href)
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
