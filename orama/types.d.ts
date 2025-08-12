
type DocType = "markdown" | "api-reference";

interface OramaDocument {
  id: string;
  title: string;
  content: string;
  url: string;
  category: string;
  section: string;
  subsection?: string;
  description?: string;
  tags: string[];
  headings: string[];
  lastModified: number;
  docType: DocType;
  apiInfo?: {
    symbolType: string; // "function", "interface", "class", etc.
    symbolPath: string; // "Deno.readFile", "web.fetch", etc.
    packageName: string; // "Deno", "Web", "Node"
  };
}

interface IIndexDocuments {
    isValidIndexer(file: InputFileReference): boolean;
    tryIndex(file: InputFileReference): Promise<OramaDocument | null>;
}

interface InputFileReference {
    path: string;
    docType: DocType;
}

interface IOutputFormat {
    write(index: IndexCollection): Promise<void>;
}