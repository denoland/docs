import { NavData } from "../types.ts";

export default function (data: Lume.Data) {
  return (
    <header>
      <a href="/" title="Deno docs home" className="logo-link">
        <data.comp.Logo />
      </a>
      <nav>
        {data.navigation.map((nav: NavData) => (
          <a href={nav.url} className="header-nav-link blocklink" data-active={data.currentUrl === nav.url}>{nav.name}</a>
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

export const css = "@import './_components/Header_new.css';";
