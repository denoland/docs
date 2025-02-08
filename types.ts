export type Sidebar = SidebarItem[];
export type Path = string;

export interface SidebarItem {
  title: string;
  href?: string;
  items?: SidebarItem[];
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

export type NavData = { name: string; href: string };
