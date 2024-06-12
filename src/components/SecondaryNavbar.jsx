import React from "react";
import NavbarNavLink from "@theme/NavbarItem/NavbarNavLink";

const NavLink = ({ to, label }) => (
  <li className="list-none">
    <NavbarNavLink
      activeClassName="navbar__link--active"
      className="navbar__item navbar__link"
      to={to}
      position="left"
      label={label}
    />
  </li>
);

function SecondaryNavbar() {
  const links = [
    { to: "/api/deno", label: "Deno" },
    { to: "/api/web", label: "Web" },
    { to: "/api/node", label: "Node" },
  ];

  return (
    <nav className="secondary-navbar w-full">
      <ul className="secondary-navbar-content flex">
        {links.map((link) => <NavLink key={link.to} {...link} />)}
      </ul>
    </nav>
  );
}

export default SecondaryNavbar;
