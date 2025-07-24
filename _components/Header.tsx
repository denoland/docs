import { NavData } from "../types.ts";

export default function (
  { data, currentSection, currentUrl }: {
    data: Lume.Data;
    currentSection: string;
    currentUrl: string;
  },
) {
  const hasSubNav = data.page?.data?.secondaryNav?.length ||
    currentUrl.startsWith("/api");

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
        <nav class="flex h-full items-center row-start-2 col-span-2 md:row-auto md:col-auto -mx-4 md:mx-0 overflow-x-auto">
          {data.navigation.map((nav: NavData) => (
            <a
              href={nav.href}
              className={`font-[clamp(0.8rem,1.5vw,1rem)] whitespace-nowrap relative py-0 px-4 h-full flex justify-center items-center transition-colors ease-in-out duration-200 text-foreground-primary after:h-full after:w-full after:bg-header-highlight after:absolute after:bottom-0 after:left-0 after:transition-transform after:duration-200 after:ease-[cubic-bezier(0.86,0,0.07,1)] after:origin-right after:scale-x-0 after:-z-10 hover:text-gray-800 hover:after:origin-left hover:after:scale-x-100 ${
                nav.href.includes(currentSection)
                  ? "font-bold text-gray-800 after:origin-left after:scale-x-100"
                  : ""
              } ${nav.style ?? ""}`}
              {...(nav.href.includes(currentSection)
                ? { "data-active": true, "aria-current": "location" }
                : {})}
              {...(nav.href === "/services/" &&
                  ["deploy", "subhosting", "services"].includes(
                    currentSection,
                  )
                ? { "data-active": true, "aria-current": "location" }
                : {})}
            >
              {nav.name}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-x-2 sm:gap-x-4 ml-auto">
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
