import { NavData } from "../types.ts";

export default function (
  { data, currentSection, currentUrl }: {
    data: Lume.Data;
    currentSection: string;
    currentUrl: string;
  },
) {
  return (
    <header class="w-full h-auto sticky top-0 border-b border-b-foreground-tertiary z-[100] bg-background-raw">
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
              className={`header-nav-link ${
                nav.href.includes(currentSection) ? "font-bold" : ""
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
          {
            /* <data.comp.ExternalLink href="https://deno.com">
            deno.com
          </data.comp.ExternalLink> */
          }
          <data.comp.SearchInput />
          <data.comp.ThemeToggle />
          <data.comp.Hamburger />
        </div>
      </div>
      <data.comp.SubNav
        data={data}
        currentUrl={currentUrl}
      />
    </header>
  );
}

export const css = "@import './_components/Header.css';";
