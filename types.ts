// Type-only import of Lume's JSX runtime (ssx), which declares the global
// `JSX` namespace used by `TitleContent` below. It must stay type-only: this
// file is also imported in contexts that build without the root import map
// (e.g. the deployed middleware), where a value import fails to resolve.
import type {} from "lume/jsx-runtime";

export type Sidebar = SidebarSection[];
export type Path = string;

export type NavData = {
  name: string;
  href: string;
  style?: string;
};

export type SidebarNav = SidebarNavItem[];

export interface SidebarNavItem {
  title: string;
  href: string;
  items?: NavData[];
}

export interface SidebarSection {
  title?: string;
  href?: string;
  items?: SidebarItem[];
}

export interface SidebarCategory {
  label?: string;
  items?: SidebarItem[];
}

export interface SidebarDoc {
  label?: string;
  id?: string;
}

export interface SidebarLink {
  label: string;
  href?: string;
  id?: string;
}

export interface SidebarSectionProps {
  section: SidebarSection;
  search: import("lume/core/searcher.ts").default;
  url: string;
  headerPath: string;
}

// `JSX.Children` is the renderable-content type from Lume's JSX runtime (ssx),
// which — unlike React — does not expose a `JSX.Element` type. The global `JSX`
// namespace comes from the type-only import at the top of this file.
export type TitleContent = string | JSX.Children;

export interface SidebarItem {
  title: TitleContent;
  label?: string;
  href?: string;
  items?: SidebarItem[];
  // Opt in to the link-plus-chevron disclosure rendering for a group whose
  // item has its own landing page. Groups without this keep the legacy
  // accordion (CLI reference, Standard library).
  disclosure?: boolean;
  externalUrl?: string;
  type?: "video" | "example" | "tutorial";
}

export interface NavigationData {
  sectionData: SidebarItem[];
  currentUrl: string;
}

export type TableOfContents = TableOfContentsItem[];

export interface TableOfContentsItem {
  text: string;
  slug: string;
  children: TableOfContentsItem[];
}

export interface FeedbackSubmission {
  path: string;
  sentiment: "yes" | "no";
  comment?: string;
  contact?: string; // Now represents GitHub username instead of email
  id?: string | null;
}

export interface GoogleSheetsUpdateResponse {
  updates: {
    updatedRange: string;
    updatedRows: number;
    updatedColumns: number;
    updatedCells: number;
  };
}
