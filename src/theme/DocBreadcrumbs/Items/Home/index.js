import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import {translate} from "@docusaurus/Translate";
import {useLocation} from "@docusaurus/router";

export default function HomeBreadcrumbItem() {
  const homeHref = useBaseUrl("/");

  const getDocsLocation = () => {
    if (useLocation().pathname.startsWith("/deploy")) {
      return {
        href: "/deploy",
        name: "Deploy",
      }
    } else if (useLocation().pathname.startsWith("/kv")) {
      return {
        href: "/kv",
        name: "KV",
      }
    }
    return {
      href: "/runtime",
      name: "Runtime",
    }
  }

	const {href, name} = getDocsLocation()
  return (
    <li className="breadcrumbs__item">
      <Link
        aria-label={translate({
          id: 'theme.docs.breadcrumbs.home',
          message: 'Home page',
          description: 'The ARIA label for the home page in the breadcrumbs',
        })}
        className="breadcrumbs__link"
        href={href}>
        {name}
      </Link>
    </li>
  );
}
