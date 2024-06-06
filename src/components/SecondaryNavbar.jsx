import React from "react";
import NavbarNavLink from "@theme/NavbarItem/NavbarNavLink";

function SecondaryNavbar() {
  return (
    <div className="secondary-navbar w-full">
      <div className="secondary-navbar-content">
        <NavbarNavLink
          activeClassName="navbar__link--active"
          className="navbar__item navbar__link"
          to="/api/deno"
          position="left"
          label="Deno"
        />
        <NavbarNavLink
          activeClassName="navbar__link--active"
          className="navbar__item navbar__link"
          to="/api/web"
          position="left"
          label="Web"
        />
        <NavbarNavLink
          activeClassName="navbar__link--active"
          className="navbar__item navbar__link"
          to="/api/node"
          position="left"
          label="Node"
        />
      </div>
    </div>
  );
}

export default SecondaryNavbar;
