import React from "react";
import { composeProviders } from "@docusaurus/theme-common";
import {
  AnnouncementBarProvider,
  ColorModeProvider,
  DocsPreferredVersionContextProvider,
  NavbarProvider,
  PluginHtmlClassNameProvider,
  ScrollControllerProvider,
} from "@docusaurus/theme-common/internal";
const Provider = composeProviders([
  ColorModeProvider,
  AnnouncementBarProvider,
  ScrollControllerProvider,
  DocsPreferredVersionContextProvider,
  PluginHtmlClassNameProvider,
  NavbarProvider,
]);
export default function LayoutProvider({ children }) {
  return <Provider>{children}</Provider>;
}
