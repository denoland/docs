import React from "react";

function SecondaryNavbar() {
  return (
    <div className="secondary-navbar w-full">
      <div className="secondary-navbar-content">
        {/* Your nav items here */}
        <a className="navbar__item navbar__link" href="/link1">Link 1</a>
        <a className="navbar__item navbar__link" href="/link2">Link 2</a>
      </div>
    </div>
  );
}

export default SecondaryNavbar;

// TODO MIGRATE STYLES FROM NAVBAR TO NAVBAR PRIMARY AND SECONDARY
