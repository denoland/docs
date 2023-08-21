import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "@site/src/components/HomepageFeatures";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className={clsx("container", styles.overlayContainer)}>
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className={clsx(
              "button button--secondary button--lg",
              styles.linkButton,
            )}
            to="/runtime"
          >
            Build an app 🛠️
          </Link>
          <Link
            className={clsx(
              "button button--secondary button--lg",
              styles.linkButton,
            )}
            to="/deploy"
          >
            Deploy globally 🚀
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  // const { siteConfig } = useDocusaurusContext();
  const ctaLinks =
    `border-2 border-solid rounded-xl px-4 py-2 hover:no-underline font-bold inline-block hover:opacity-80`;
  return (
    <Layout
      title={`Deno: the easiest, most secure JavaScript runtime`}
      description="Reference documentation for the Deno runtime and Deno Deploy"
    >
      <div className="container flex flex-col items-center justify-center md:flex-row gap-8">
        <div className="flex-1 py-4">
          <h1>Deno Documentation</h1>
          <p className="my-4">
            Reference documentation for the Deno JavaScript runtime and Deno
            Deploy.
          </p>
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <a
              className={ctaLinks}
              href="/runtime"
            >
              Build with Deno
            </a>
            <a
              className={ctaLinks}
              href="/deploy"
            >
              Deploy to the edge
            </a>
          </div>
        </div>
        <div className="flex-1 text-center">
          <img
            className="h-48 md:h-96"
            alt="Deno logo"
            src="/deno-looking-up.svg"
          />
        </div>
      </div>
    </Layout>
  );
}
