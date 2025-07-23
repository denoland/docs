import { NavData } from "../types.ts";

export default function (data: Lume.Data) {
  return (
    <div class="header-wrapper w-full h-[var(--header-height)] sticky top-0 border-b border-b-foreground-tertiary z-[100] bg-background-raw">
      <header class="flex gap-4 items-center justify-between px-4 h-full w-full max-w-7xl mx-auto xlplus:px-0">
        <data.comp.Hamburger />
        <a href="/" title="Deno docs home" className="logo-link">
          <data.comp.DenoLogo />
        </a>
        <nav class="hidden lg:flex h-full items-center">
          {data.navigation.map((nav: NavData) => (
            <a
              href={nav.href}
              className={`header-nav-link ${nav.style ?? ""}`}
              {...(nav.href.includes(data.currentSection)
                ? { "data-active": true, "aria-current": "location" }
                : {})}
              {...(nav.href === "/services/" &&
                  ["deploy", "subhosting", "services"].includes(
                    data.currentSection,
                  )
                ? { "data-active": true, "aria-current": "location" }
                : {})}
            >
              {nav.name}
            </a>
          ))}
        </nav>
        <data.comp.ExternalLink href="https://deno.com">
          deno.com
        </data.comp.ExternalLink>
        <data.comp.SearchInput />
        <data.comp.ThemeToggle />
      </header>
    </div>
  );
}

export const css = "@import './_components/Header.css';";
