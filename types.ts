export type Sidebar = SidebarSection[];
export type Path = string;

export type NavData = {
  name: string;
  href: string;
  style?: string;
};

export type SecondaryNav = SecondaryNavItem[];

export interface SecondaryNavItem {
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

export type TitleContent = string | JSX.Element;

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
