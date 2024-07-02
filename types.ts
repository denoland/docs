export type Sidebar = SidebarSection[];

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export type SidebarItem = string | SidebarDoc | SidebarLink | SidebarCategory;

export interface SidebarDoc {
  label: string;
  id: string;
}

export interface SidebarLink {
  label: string;
  href: string;
}

export interface SidebarCategory {
  label: string;
  items: (string | SidebarDoc)[];
}

export type TableOfContents = TableOfContentsItem[];

export interface TableOfContentsItem {
  text: string;
  slug: string;
  children: TableOfContentsItem[];
}
