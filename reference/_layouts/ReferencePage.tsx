import React from "npm:@preact/compat";
import { Navigation, ReferenceContext } from "../types.ts";

export default function Layout(
  { context, navigation, children }: {
    context: ReferenceContext;
    navigation?: Navigation;
    children: React.ReactNode;
  },
) {
  return (
    <>
      {/* sorry mum, put these somewhere good */}
      <link rel="stylesheet" href="/reference-styles/styles.css" />
      <link rel="stylesheet" href="/reference-styles/page.css" />
      <link rel="stylesheet" href="/reference-styles/extra-styles.css" />

      <div className={"ddoc"}>
        <CategoryPanel context={context} />
        <div>
          {navigation && <TopNav {...navigation} />}
          <div id={"content"}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

function CategoryPanel({ context }: { context: ReferenceContext }) {
  const categories = context.currentCategoryList;

  const categoryListItems = categories.entries().map(([key, details]) => {
    const categoryLinkUrl =
      `${context.root}/${context.packageName.toLocaleLowerCase()}/${details.urlStub}`;

    return (
      <li>
        <a href={categoryLinkUrl}>{key}</a>
      </li>
    );
  }).toArray();

  return (
    <div id={"categoryPanel"}>
      <ul>
        {categoryListItems}
      </ul>
    </div>
  );
}

function TopNav(
  { category, currentItemName }: Navigation,
) {
  return (
    <nav id={"topnav"} className={"top-0 sticky bg-white z-50 py-3 h-14"}>
      <div className={"h-full"}>
        <div>
          <ul className={"breadcrumbs"}>
            <li>
              <a href="./" className={"contextLink"}>{category}</a>
            </li>
            <span class="text-[#0F172A]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M5.76748 11.8159C5.5378 11.577 5.54525 11.1972 5.78411 10.9675L8.93431 8L5.78411 5.0325C5.54525 4.80282 5.5378 4.423 5.76748 4.18413C5.99715 3.94527 6.37698 3.93782 6.61584 4.1675L10.2158 7.5675C10.3335 7.68062 10.4 7.83679 10.4 8C10.4 8.16321 10.3335 8.31938 10.2158 8.4325L6.61584 11.8325C6.37698 12.0622 5.99715 12.0547 5.76748 11.8159Z"
                  fill="currentColor"
                >
                </path>
              </svg>
            </span>
            <li>{currentItemName}</li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
