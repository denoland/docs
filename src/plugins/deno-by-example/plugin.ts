import fs from "node:fs/promises";

type ReturnedContent = { name: string; content: string; };

export default async function denoByExamplePlugin(context, options) {
    return {
        name: "deno-by-example",

        async loadContent() {
            const denoExamplePath = `${context.siteDir}/by-example`;
            const files = await fs.readdir(denoExamplePath);

            const examples = await files.map(async (file) => {
                const content = await fs.readFile(`${denoExamplePath}/${file}`, "utf-8");
                return { name: file, content: content } as ReturnedContent;
            });

            console.log(`Read ${examples.length} examples from ${denoExamplePath}`);

            return examples;
        },

        async contentLoaded({ content, actions }) {
            const { addRoute, createData } = actions;
            const callbackContent = content as Promise<ReturnedContent>[];

            for (const example of callbackContent) {
                const { name, content } = await example;
                const url = `/examples/${name.replace(".ts", "")}`;

                const fileContent = "export default " + JSON.stringify({ name, content });
                const path = await createData(`example-${name}.js`, fileContent);

                console.log(`Data created for ${name} at ${path}`);

                addRoute({
                    path: url,
                    component: '@site/src/components/DenoByExample/ByExample.tsx',
                    exact: true,
                    modules: {
                        example: path,
                    },
                });

                console.log(`Adding route for ${name} at ${url}`);
            }
        },
    };
};
