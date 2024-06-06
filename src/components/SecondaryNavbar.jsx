import React from "react";

function SecondaryNavbar() {
  return (
    <div className="secondary-navbar w-full">
      <div className="secondary-navbar-content">
        {/* Your nav items here */}

        <a className="navbar__item navbar__link" href="/api/deno">Deno</a>
        <a className="navbar__item navbar__link" href="/api/web">Web</a>
        <a className="navbar__item navbar__link" href="/api/node">Node</a>
      </div>
    </div>
  );
}

export default SecondaryNavbar;
