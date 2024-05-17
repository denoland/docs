import fs from "node:fs";
import { Example, parseExample } from "./example";

type LoadContext = {
  siteDir: string;
  generatedFilesDir: string;
  siteConfig: any;
  outDir: string;
  baseUrl: string;
};

type ReturnedContent = {
  name: string;
  content: string;
  label: string;
  parsed: Example;
};

export default async function denoByExamplePlugin(
  context: LoadContext,
  options,
) {
  const denoExamplePath = `${context.siteDir}/by-example`;
  const files = fs.readdirSync(denoExamplePath);

  const examples = files.map((file) => {
    const fileContent = fs.readFileSync(`${denoExamplePath}/${file}`, "utf-8");
    const example = {
      name: file,
      content: fileContent,
      label: file.replace(".ts", ""),
      parsed: parseExample(file, fileContent),
    } as ReturnedContent;

    return example;
  });

  const examplesList = examples.map((example) => {
    return {
      id: `examples/${example.label}`,
      title: example.parsed.title,
      tags: example.parsed.tags,
      difficulty: example.parsed.difficulty,
      group: example.parsed.group,
      sortOrder: example.parsed.sortOrder,
    };
  });

  return {
    name: "deno-by-example",
    examples: examples,
    examplesList: examplesList,

    async loadContent() {
      return examples;
    },

    async contentLoaded({ content, actions }) {
      const { addRoute, createData } = actions;
      const callbackContent = content as Promise<ReturnedContent>[];

      const examplesListModule = `export default ${
        JSON.stringify(examplesList)
      }`;
      const examplesListPath = await createData(
        `exampleList.js`,
        examplesListModule,
      );

      addRoute({
        path: "/examples",
        component: "@site/src/components/DenoByExample/index.tsx",
        exact: true,
        modules: {
          examplesList: examplesListPath,
        },
      });

      for (const example of callbackContent) {
        const { name, content, label } = await example;
        const url = `/examples/${label}`;

        const fileContent = "export default " +
          JSON.stringify({ name, content });
        const path = await createData(`example-${name}.js`, fileContent);

        addRoute({
          path: url,
          component: "@site/src/components/DenoByExample/ByExample.tsx",
          exact: true,
          modules: {
            example: path,
            examplesList: examplesListPath,
          },
        });
      }
    },
  };
}
