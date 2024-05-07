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
            return <></>;
        }

        return (
            <section key={category}>
                <h2>{category}</h2>
                <ul>
                    {group.map((example) => {
                        return (
                            <li key={example.id}>
                                <a href={"/" + example.id}>{example.title}</a>
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
            <div className="flex flex-col px-8 pt-6 mt-20 md:items-center md:justify-center md:flex-row gap-0 md:gap-16 max-w-[1200px] mx-auto mb-24">
                <div className="pb-16 align-middle md:pb-0">
                    <div className="mb-16 md:mb-24 text-center">
                        <img
                            className="h-64 w-auto"
                            alt="Deno Examples"
                            src="/examples.png"
                        />
                        <h1 className="text-4xl md:text-6xl">Deno by Example</h1>
                        <p>
                            A collection of annotated examples for how to use Deno, and the various features it provides. These examples are a reference for how to build with Deno and can also be used as a guide to learn about many of the features Deno provides.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {elements}
                    </div>
                </div>
            </div>
            <Footer />
        </Layout>
    );
}
