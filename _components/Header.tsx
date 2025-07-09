import { NavData } from "../types.ts";

export default function (data: Lume.Data) {
  return (
    <header>
      <a href="/" title="Deno docs home" className="logo-link">
        {["services", "deploy", "subhosting"].includes(data.currentSection)
          ? <data.comp.DeployLogo />
          : <data.comp.Logo />}
      </a>
      <nav>
        {data.navigation.map((nav: NavData) => (
          <a
            href={nav.href}
            className={`header-nav-link blocklink ${nav.style ?? ""}`}
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
  );
}

export const css = "@import './_components/Header.css';";
