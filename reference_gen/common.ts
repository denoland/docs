import { ShortPath, HrefResolver } from "@deno/doc";
import { join, dirname } from "@std/path";
import { pooledMap } from "@std/async";

export function renderMarkdown(md: string, titleOnly: boolean, _filePath: ShortPath | undefined, anchorizer: (content: string, depthLevel: number) => string): string | undefined {
  return md;
}

export function stripMarkdown(md: string): string {
  return md;
}

export const hrefResolver: HrefResolver = {
  resolvePath(_current, _target, defaultResolve) {
    let path = defaultResolve();

    if (path.endsWith("index.html")) {
      path = path.slice(0, -"index.html".length);
    } else if (path.endsWith(".html")) {
      path = path.slice(0, -".html".length);
    }

    return path;
  }
};

export async function writeFiles(root: string, files: Record<string, string>) {
  await Deno.remove(root, { recursive: true });

  const pool = pooledMap(300, Object.entries(files), async ([path, content]) => {
    const joined = join(root, path);

    await Deno.mkdir(dirname(joined), { recursive: true });
    await Deno.writeTextFile(joined, content);
  });

  for await (const _ of pool) {
    //
  }

  console.log(`Written ${Object.keys(files).length} files`);
}