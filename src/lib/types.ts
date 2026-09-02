export interface DocPage {
  slug: string;
  title: string;
  description: string;
  section: string;
  sectionSlug: string;
  headings: DocHeading[];
  content: React.ComponentType;
}

export interface DocHeading {
  id: string;
  text: string;
  level: number;
}

export interface NavSection {
  title: string;
  slug: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  slug: string;
  badge?: string;
}

export interface SearchResult {
  title: string;
  section: string;
  slug: string;
  description: string;
}
