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
      <div class="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] h-[var(--header-height)] gap-x-4 items-center justify-between px-4 w-full max-w-7xl mx-auto xlplus:px-0">
        <div className="flex items-center gap-x-4">
          <data.comp.Hamburger />
          <a
            href="/"
            title="Deno docs home"
            className="flex h-8 md:h-10 md:mr-auto"
          >
            <data.comp.DenoLogo />
          </a>
        </div>
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
        <div className="flex items-center gap-x-4 ml-auto">
          {
            /* <data.comp.ExternalLink href="https://deno.com">
            deno.com
          </data.comp.ExternalLink> */
          }
          <data.comp.SearchInput />
          <data.comp.ThemeToggle />
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
