import React from "react";
import clsx from "clsx";
import Head from "@docusaurus/Head";
import ErrorBoundary from "@docusaurus/ErrorBoundary";
import {
  PageMetadata,
  SkipToContentFallbackId,
  ThemeClassNames,
} from "@docusaurus/theme-common";
import { useKeyboardNavigation } from "@docusaurus/theme-common/internal";
import SkipToContent from "@theme/SkipToContent";
import AnnouncementBar from "@theme/AnnouncementBar";
import Navbar from "@theme/Navbar";
import LayoutProvider from "@theme/Layout/Provider";
import ErrorPageContent from "@theme/ErrorPageContent";
import styles from "./styles.module.css";

export default function Layout(props) {
  const {
    children,
    noFooter,
    wrapperClassName,
    // Not really layout-related, but kept for convenience/retro-compatibility
    title,
    description,
  } = props;
  useKeyboardNavigation();
  return (
    <LayoutProvider>
      <Head>
        <link
          rel="preload"
          href="/fonts/inter/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
        <link
          rel="preload"
          href="/fonts/inter/Inter-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="true"
        />
        <script src="/trackjs.js"></script>
        <script src="https://cdn.trackjs.com/releases/current/tracker.js">
        </script>
        <link rel="stylesheet" href="/fonts/inter.css" />
      </Head>

      <PageMetadata title={title} description={description} />

      <SkipToContent />

      <AnnouncementBar />

      <Navbar />

      <div
        id={SkipToContentFallbackId}
        className={clsx(
          ThemeClassNames.wrapper.main,
          styles.mainWrapper,
          wrapperClassName,
        )}
      >
        <ErrorBoundary fallback={(params) => <ErrorPageContent {...params} />}>
          {children}
        </ErrorBoundary>
      </div>
    </LayoutProvider>
  );
}
