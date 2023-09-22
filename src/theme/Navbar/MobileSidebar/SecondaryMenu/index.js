import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {useNavbarSecondaryMenu} from '@docusaurus/theme-common/internal';
import { useLocation } from "@docusaurus/router";

function SecondaryMenuBackButton(props) {
  return (
    <button
      type="button"
      {...props}
      className="rounded px-3 py-1 border-none font-semibold text-gray-600"
    >
      Switch product
    </button>
  );
}
// The secondary menu slides from the right and shows contextual information
// such as the docs sidebar
export default function NavbarMobileSidebarSecondaryMenu() {
  const isPrimaryMenuEmpty = useThemeConfig().navbar.items.length === 0;
  const secondaryMenu = useNavbarSecondaryMenu();
  const location = useLocation();

  const products = [
    {
      name: "Deno Runtime",
      slug: "runtime",
    },
    {
      name: "Deno Deploy",
      slug: "deploy",
    },
    {
      name: "Deno KV",
      slug: "kv",
    },
  ];

  const currentProduct = products.find((product) =>
    location.pathname.includes(product.slug)
  );

  return (
    <>
      <div>
        {currentProduct && (
          <div className="flex justify-between items-center pr-4">
            <div className="text-xl px-3 py-2">
              {currentProduct.name}
            </div>
            <SecondaryMenuBackButton onClick={() => secondaryMenu.hide()} />
          </div>
        )}
      </div>
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
