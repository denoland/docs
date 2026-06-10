import "lume/jsx-runtime";

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
  // When true, this item is only highlighted on an exact URL match, not as a
  // path prefix. Used for section-root targets like "/runtime/" that would
  // otherwise match every page in the section.
  exact?: boolean;
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
// which — unlike React — does not expose a `JSX.Element` type. The import pulls
// in ssx's global `JSX` namespace so this resolves under `deno check`/`deno test`
// (the site itself builds with --no-check).
export type TitleContent = string | JSX.Children;

export interface SidebarItem {
  title: TitleContent;
  label?: string;
  href?: string;
  items?: SidebarItem[];
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
