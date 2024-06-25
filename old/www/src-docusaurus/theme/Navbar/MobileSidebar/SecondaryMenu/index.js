import React from "react";
import { useThemeConfig } from "@docusaurus/theme-common";
import { useNavbarSecondaryMenu } from "@docusaurus/theme-common/internal";
import { useLocation } from "@docusaurus/router";
import { products } from "../../../../../sidebars/products";

function SecondaryMenuBackButton(props) {
  return (
    <button
      type="button"
      {...props}
      className="secondary-menu__product__button [font:inherit]"
    >
      <span
        aria-hidden="true"
        className="inline-block transform rotate-180 [font-family:inherit]"
      >
        &ensp;-&gt;
      </span>
      All docs
    </button>
  );
}

function ProductNameWithSwitcher() {
  const secondaryMenu = useNavbarSecondaryMenu();
  const location = useLocation();

  const currentProduct = products.find((product) =>
    location.pathname.includes(product.slug)
  );

  return (
    <div>
      {currentProduct && (
        <div className="secondary-menu__product">
          <div className="secondary-menu__product__name">
            {currentProduct.name}
          </div>
          <SecondaryMenuBackButton onClick={() => secondaryMenu.hide()} />
        </div>
      )}
    </div>
  );
}

// The secondary menu slides from the right and shows contextual information
// such as the docs sidebar
export default function NavbarMobileSidebarSecondaryMenu() {
  const isPrimaryMenuEmpty = useThemeConfig().navbar.items.length === 0;
  const secondaryMenu = useNavbarSecondaryMenu();

  return (
    <>
      <ProductNameWithSwitcher />
      {/* edge-case: prevent returning to the primaryMenu when it's empty */}
      {
        /* {!isPrimaryMenuEmpty && (
        <SecondaryMenuBackButton onClick={() => secondaryMenu.hide()} />
      )} */
      }
      {secondaryMenu.content}
    </>
  );
}
