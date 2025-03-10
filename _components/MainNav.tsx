import { NavData } from "../types.ts";

export default function (data: Lume.Data) {
  return (
    <nav aria-labelledby="primary-navigation">
      <ul className="main-nav">
        {data.navigation.map((nav: NavData) => (
          <li>
            <a
              href={nav.href}
              className="main-nav-link"
              {...(nav.href.includes(data.currentSection)
                ? { "data-active": true }
                : {})}
            >
              {nav.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export const css = "@import './_components/MainNav.css';";
