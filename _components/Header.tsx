import { NavData } from "../types.ts";

export default function (data: Lume.Data) {
  return (
    <header>
      <a href="/" title="Deno docs home" className="logo-link">
        <data.comp.Logo />
      </a>
      <nav>
        {data.navigation.map((nav: NavData) => (
          <a
            href={nav.href}
            className="header-nav-link blocklink"
            data-active={nav.href.includes(data.currentSection)}
          >
            {nav.name}
          </a>
        ))}
      </nav>
      <data.comp.ExternalLink url="https://deno.com">
        deno.com
      </data.comp.ExternalLink>
      <data.comp.SearchInput />
      <data.comp.ThemeToggle />
    </header>
  );
}

export const css = "@import './_components/Header.css';";
