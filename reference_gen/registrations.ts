import { GenerateOptions } from "@deno/doc";
import {
    hrefResolver,
    renderMarkdown,
    stripMarkdown,
} from "./common.ts";
import webCategoryDocs from "./web-categories.json" with { type: "json" };
import denoCategoryDocs from "./deno-categories.json" with { type: "json" };
import symbolRedirectMap from "./node-symbol-map.json" with { type: "json" };
import defaultSymbolMap from "./node-default-map.json" with { type: "json" };
import rewriteMap from "./node-rewrite-map.json" with { type: "json" };
import { expandGlob } from "@std/fs";

export type SourceRegistration = {
    sources: string[];
    generateOptions: GenerateOptions;
}

async function getNodeTypeFiles() {
    const urls: string[] = [];
    for await (const file of expandGlob("./types/node/[!_]*")) {
        urls.push(file.path);
    }
    return urls;
}

function buildNewRewriteMap() {
    return Object.fromEntries(
        Object.entries(rewriteMap).map((
            [key, val],
        ) => [import.meta.resolve(val), key]),
    );
}

const defaultGenerateOptions: Partial<GenerateOptions> = {
    disableSearch: true,
    hrefResolver,
    usageComposer: {
        singleMode: true,
        compose(_currentResolve, _usageToMd) {
            return new Map();
        },
    },
    markdownRenderer: renderMarkdown,
    markdownStripper: stripMarkdown,
}

export default [
    {
        sources: ["./types/web.d.ts"],
        generateOptions: {
            ...defaultGenerateOptions,
            packageName: "Web",
            categoryDocs: webCategoryDocs,
        } as GenerateOptions
    },
    {
        sources: ["./types/deno.d.ts"],
        generateOptions: {
            ...defaultGenerateOptions,
            packageName: "Deno",
            categoryDocs: denoCategoryDocs,
        } as GenerateOptions
    },
    {
        sources: await getNodeTypeFiles(),
        generateOptions: {
            ...defaultGenerateOptions,
            packageName: "Node",
            categoryDocs: undefined,
            usageComposer: {
                singleMode: true,
                compose(currentResolve, usageToMd) {
                    if ("file" in currentResolve) {
                        return new Map([[
                            {
                                name: "",
                            },
                            usageToMd(`node:${currentResolve.file.path}`, undefined),
                        ]]);
                    } else {
                        return new Map();
                    }
                },
            },
            symbolRedirectMap,
            defaultSymbolMap,
            rewriteMap: buildNewRewriteMap(),
        } as GenerateOptions
    }
] as SourceRegistration[];