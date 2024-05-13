import React from "react";
import Layout from "@theme/Layout";
import Footer from "@theme/Footer";

export default function Index({ examplesList }) {

    const groupMap: [string, string][] = [
        ["Basics", "IconFlag3"],
        ["Encoding", "IconTransform"],
        ["CLI", "IconTerminal2"],
        ["Network", "IconNetwork"],
        ["System", "IconDeviceDesktop"],
        ["File System", "IconFiles"],
        ["Databases", "IconDatabase"],
        ["Scheduled Tasks", "IconClock"],
        ["Cryptography", "IconFileShredder"],
        ["Advanced", "IconStars"],
    ];

    for (let example of examplesList) {
        example.group = example.group || "Basics";
    }

    const groups = examplesList.reduce((acc, example) => {
        const lowerGroup = example.group.toLowerCase();

        if (!acc[lowerGroup]) {
            acc[lowerGroup] = [];
        }

        if (!groupMap.find(([category]) => category.toLowerCase() === lowerGroup)) {
            groupMap.push([example.group.toLowerCase(), "IconFlag3"]);
        }

        acc[lowerGroup].push(example);
        return acc;
    }, {});


    const elements = groupMap.map(([category, icon]) => {
        const group = groups[category.toLowerCase()];

        if (!group) {
            return null;
        }

        return (
            <section key={category} className="mb-12 [-webkit-column-break-inside:avoid;]">
                <h2 className="text-xl mb-2 block border-solid border-t-0 border-x-0 border-b border-b-gray-300 dark:border-b-gray-600 pb-1">{category}</h2>
                <ul className="list-none pl-0">
                    {group.map((example) => {
                        return (
                            <li key={example.id} className="leading-loose">
                                <a href={"/" + example.id} className="text-inherit underline decoration-gray-300 dark:decoration-gray-600">{example.title}</a>
                            </li>
                        );
                    })}
                </ul>
            </section>
        );
    });


    return (
        <Layout
            title={"Deno: the easiest, most secure JavaScript runtime"}
            description="Reference documentation for the Deno runtime and Deno Deploy"
        >
            <div className="w-full flex flex-col px-8 pt-6 mt-20 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-screen-xl mx-auto mb-24">
                <div className="pb-16 align-middle md:pb-0 w-full">
                    <div className="mb-16 md:mb-24 text-center">
                        <img
                            className="w-full max-w-32 h-auto mb-4"
                            alt="Deno Examples"
                            src="/examples.png"
                        />
                        <h1 className="text-4xl md:text-6xl">Deno by Example</h1>
                        <p className="max-w-prose mx-auto">
                            A collection of annotated Deno examples, to be used as a reference for how to build with Deno, or as a guide to learn about many of Deno's features.
                        </p>
                    </div>
                    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4" style={{ columnGap: '3rem'}}>
                        {elements}
                    </div>
                    <div className="w-full flex flex-col px-8 pt-6 mt-20 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-screen-xl mx-auto mb-24">
                        <p className="max-w-prose mx-auto text-center">Need an example that isn't here? Or want to add one of your own?<br/> We welcome contributions! <br/>You can request more examples, or add your own at our <a href="https://github.com/denoland/deno-docs?tab=readme-ov-file#examples">GitHub repository</a></p>
                    </div>

                </div>
            </div>
            <Footer />
        </Layout>
    );
}
