import { walk } from "@std/fs/walk";
import { dirname, extname } from "@std/path";
import { pooledMap } from "@std/async/pool";
import { DOMParser } from "@b-fuze/deno-dom";

const nav = await Deno.readTextFile("nav.html");

const navHead = `
<link rel="stylesheet" href="/docusaurus.css">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-Italic.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-SemiBold.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-SemiBoldItalic.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="stylesheet" href="/fonts/inter.css">`;

const res = pooledMap(
  10,
  walk("gen", {
    includeDirs: false,
  }),
  async (entry) => {
    const outPath = `./api${entry.path.slice(3)}`;
    await Deno.mkdir(dirname(outPath), { recursive: true });

    if (extname(entry.path) === ".html") {
      const file = await Deno.readTextFile(entry.path);
      const document = new DOMParser().parseFromString(file, "text/html");
      document.head.innerHTML = document.head.innerHTML + navHead;
      document.body.innerHTML = nav + document.body.innerHTML;

      await Deno.writeTextFile(outPath, "<!DOCTYPE html>" + document.documentElement!.outerHTML, {
        create: true,
      });
    } else {
      await Deno.copyFile(entry.path, outPath);
    }
  }
);

await Array.fromAsync(res);
