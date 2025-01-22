export type Sidebar = SidebarSection[];

export type Path = string;

export type SidebarItem = string | SidebarDoc | SidebarLink | SidebarCategory;

export interface SidebarSection {
  title: string;
  href?: string;
  items: (string | SidebarItem)[];
}

export interface SidebarDoc {
  label: string;
  id: string;
}

export interface SidebarLink {
  label: string;
  href: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SidebarCategory {
  label: string;
  href?: string;
  items: SidebarItem[];
}

export type TableOfContents = TableOfContentsItem[];

export interface TableOfContentsItem {
  text: string;
  slug: string;
  children: TableOfContentsItem[];
}

export function isSidebarLink(b: SidebarItem): b is SidebarLink {
  return (b as SidebarLink).href !== undefined;
}

export function isSidebarDoc(b: SidebarItem): b is SidebarDoc {
  return (b as SidebarDoc).id !== undefined;
}

export function isSidebarCategory(b: SidebarItem): b is SidebarCategory {
  return (b as SidebarCategory).items !== undefined;
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
