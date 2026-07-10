import { NavData } from "../types.ts";

export default function (
  { data, currentSection, currentUrl, hasSubNav }: {
    data: Lume.Data;
    currentSection: string;
    currentUrl: string;
    hasSubNav: boolean;
  },
) {
  const hrefIsInCurrentSection = (href: string, currentSection: string) => {
    return href.includes(currentSection) ||
      href === "/deploy/" &&
        ["deploy", "subhosting", "services", "sandbox"].includes(
          currentSection,
        );
  };

  return (
    <header
      className={`w-full h-auto sticky top-0 z-100 bg-background-raw border-b border-b-foreground-tertiary`}
    >
      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto_1fr] h-(--header-height) gap-x-4 items-center justify-between px-4 w-full mx-auto">
        <a
          href="https://deno.com"
          title="Deno main website"
          className="block h-8 w-8 xs:w-auto md:h-10 md:mr-auto md:w-10 lg:w-auto overflow-hidden"
        >
          <data.comp.DenoLogo />
        </a>
        <nav
          id="main-nav"
          className="flex h-full items-center row-start-2 col-span-2 md:row-auto md:col-auto -mx-4 md:mx-0 overflow-x-auto md:overflow-clip"
        >
          {data.navigation.map((nav: NavData) => (
            <a
              href={nav.href}
              className={`text-sm md:text-base whitespace-nowrap relative py-0 px-4 md:px-3 lg:px-4 h-full flex justify-center items-center text-foreground-primary hover:text-gray-800 transition-colors duration-200 ${
                hrefIsInCurrentSection(nav.href, currentSection)
                  ? "font-bold text-gray-800 bg-header-highlight"
                  : ""
              } ${nav.style ?? ""}`}
              {...(hrefIsInCurrentSection(nav.href, currentSection)
                ? { "data-active": true, "aria-current": "location" }
                : {})}
            >
              {hrefIsInCurrentSection(nav.href, currentSection) && (
                <div
                  id="current-nav-item"
                  className="absolute inset-0 bg-header-highlight -z-10 transition-transform duration-200 easing-[cubic-bezier(0.5,0,0.5,1)] origin-left"
                  style="--left: 0px; --scaleX: 1; transform: translateX(var(--left)) scaleX(var(--scaleX));"
                />
              )}
              {nav.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-x-2 sm:gap-x-4 ml-auto w-full max-w-80">
          <data.comp.SearchInput />
          <data.comp.ThemeToggle />
          <data.comp.Hamburger />
        </div>
      </div>
      {hasSubNav &&
        (
          <data.comp.SubNav
            data={data}
            currentUrl={currentUrl}
          />
        )}
    </header>
  );
}
