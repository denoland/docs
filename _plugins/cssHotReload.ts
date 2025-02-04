import { walk } from "@std/fs";

export async function enableCssHotReload() {
    const cssFiles = [];
    for await (const entry of walk(".", {
        includeDirs: false,
        match: [/\.css$/],
        skip: [/_site/, /node_modules/],
    })) {
        cssFiles.push(entry.path);
    }

    const watcher = Deno.watchFs(cssFiles);

    for await (const event of watcher) {
        const filePath = event.paths[0];
        const speculativeTsx = filePath.replace(".css", ".tsx");
        Deno.utime(speculativeTsx, new Date(), new Date());
    }
}

export function styledComponent(path: string) {
    const parts = path.split("#")[0].replace("file:///", "");
    const cssPath = parts.replace(".tsx", ".css");
    return Deno.readTextFileSync(cssPath);
}
