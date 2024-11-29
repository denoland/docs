export const TAGS = {
  cli: {
    title: "cli",
    description: "Works in Deno CLI",
  },
  deploy: {
    title: "deploy",
    description: "Works on Deno Deploy",
  },
  web: {
    title: "web",
    description: "Works in on the Web",
  },
};

export const DIFFICULTIES = {
  beginner: {
    title: "Beginner",
    description: "No significant prior knowledge is required for this example.",
  },
  intermediate: {
    title: "Intermediate",
    description: "Some prior knowledge is needed for this example.",
  },
};

export type ExampleFromFileSystem = {
  name: string;
  content: string;
  label: string;
  parsed: Example;
  externalURL?: string;
};

export interface Example {
  id: string;
  title: string;
  description: string;
  difficulty: keyof typeof DIFFICULTIES;
  tags: (keyof typeof TAGS)[];
  additionalResources: [string, string][];
  run?: string;
  playground?: string;
  files: ExampleFile[];
  group: string;
  sortOrder: any;
}

export interface ExampleFile {
  name: string;
  snippets: ExampleSnippet[];
}

export interface ExampleSnippet {
  text: string;
  code: string;
}
