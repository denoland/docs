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
              data-active={nav.href.includes(data.currentSection)}
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
