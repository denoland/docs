import { IndexCollection } from "./indexing/IndexCollection.ts";

export type DocType = "markdown" | "api-reference";

export interface OramaDocument {
  id: string;
  title: string;
  content: string;
  url: string;
  /** Root-relative path (e.g. /runtime/reference/cli/serve) */
  path?: string;
  category: string;
  section: string;
  subsection?: string;
  description?: string;
  tags: string[];
  headings: string[];
  lastModified: number;
  /** Optional kind/category of doc: e.g. "cli", "guide", "api" */
  kind?: string;
  /** CLI command name if applicable, e.g. "serve" */
  command?: string;
  apiInfo?: {
    symbolType: string; // "function", "interface", "class", etc.
    symbolPath: string; // "Deno.readFile", "web.fetch", etc.
    packageName: string; // "Deno", "Web", "Node"
  };
}

export interface IIndexDocuments {
  isValidIndexer(file: InputFileReference): boolean;
  tryIndex(file: InputFileReference): Promise<OramaDocument | null>;
}

export interface InputFileReference {
  path: string;
  fullPath: string;
  docType: DocType;
}

export interface IOutputFormat {
  write(index: IndexCollection): Promise<void>;
}

export interface IndexStats {
  totalDocuments: number;
  totalCharacters: number;
  averageDocumentLength: number;
  categoryCounts: Record<string, number>;
  sectionCounts: Record<string, number>;
  documentsWithTags: number;
  documentsWithDescriptions: number;
  longestDocument: string;
  shortestDocument: string;
  apiDocuments: number;
  markdownDocuments: number;
}
