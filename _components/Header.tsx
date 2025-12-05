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
      href === "/services/" &&
        ["deploy", "subhosting", "services", "sandboxes"].includes(
          currentSection,
        );
  };

  return (
    <header
      class={`w-full h-auto sticky top-0 z-[100] bg-background-raw ${
        hasSubNav ? "" : "border-b border-b-foreground-tertiary"
      }`}
    >
      <div class="grid grid-cols-[auto_1fr] md:grid-cols-[auto_auto_1fr] h-[var(--header-height)] gap-x-4 items-center justify-between px-4 w-full max-w-7xl mx-auto xlplus:px-0">
        <a
          href="https://deno.com"
          title="Deno main website"
          className="block h-8 w-8 xs:w-auto md:h-10 md:mr-auto overflow-hidden"
        >
          <data.comp.DenoLogo />
        </a>
        <nav
          id="main-nav"
          class="flex h-full items-center row-start-2 col-span-2 md:row-auto md:col-auto -mx-4 md:mx-0 overflow-x-auto md:overflow-clip"
        >
          {data.navigation.map((nav: NavData) => (
            <a
              href={nav.href}
              className={`font-[clamp(0.8rem,1.5vw,1rem)] whitespace-nowrap relative py-0 px-4 h-full flex justify-center items-center text-foreground-primary hover:text-gray-800 transition-colors duration-200 ${
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
                  class="absolute inset-0 bg-header-highlight -z-10 transition-transform duration-200 easing-[cubic-bezier(0.5,0,0.5,1)] origin-left"
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
