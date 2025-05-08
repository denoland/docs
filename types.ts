export type Sidebar = SidebarItem[];
export type Path = string;

export interface SidebarItem {
  title: string;
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
  id?: string | null;
  comment?: string;
  contact?: string;
}

export interface GoogleSheetsUpdateResponse {
  updates: {
    updatedRange: string;
    updatedRows: number;
    updatedColumns: number;
    updatedCells: number;
  };
}

export type NavData = { name: string; href: string; style?: string };

export type SecondaryNav = SecondaryNavItem[];

export interface SecondaryNavItem {
  title: string;
  href: string;
  items?: NavData[];
}

export interface SecondaryNavProps {
  secondaryNav: SecondaryNav[];
  currentUrl: string;
}
