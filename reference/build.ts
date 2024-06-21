import { walk } from "@std/fs/walk";
import { dirname, extname } from "@std/path";
import { pooledMap } from "@std/async/pool";
import { DOMParser } from "@b-fuze/deno-dom";

const nav = await Deno.readTextFile("nav.html");
const navDeno = await Deno.readTextFile("nav_deno.html");
const navWeb = await Deno.readTextFile("nav_web.html");
const navNode = await Deno.readTextFile("nav_node.html");

let navHead = `
<link rel="stylesheet" href="/docusaurus.css">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-Italic.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-SemiBold.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="preload" href="/fonts/inter/Inter-SemiBoldItalic.woff2" as="font" type="font/woff2" crossorigin="true">
<link data-rh="true" rel="stylesheet" href="/fonts/inter.css">`;

for await (const entry of walk("../build/assets/js", {
  includeDirs: false,
  exts: ["js"],
})) {
  if (entry.name.includes("main")) {
    navHead = `<script href="/assets/js/${entry.name}" defer="defer"></script>` + navHead;
  } else {
    navHead += `<link rel="prefetch" href="/assets/js/${entry.name}">`;
  }
}

const res = pooledMap(
  100,
  walk("gen", {
    includeDirs: false,
  }),
  async (entry) => {
    const outPath = `./api${entry.path.slice(3)}`;
    await Deno.mkdir(dirname(outPath), { recursive: true });

    if (extname(entry.path) === ".html") {
      const file = await Deno.readTextFile(entry.path);
      const document = new DOMParser().parseFromString(file, "text/html");

      let subNav = "";
      if (entry.path.startsWith("gen/deno")) {
        subNav = navDeno;
      } else if (entry.path.startsWith("gen/web")) {
        subNav = navWeb;
      } else if (entry.path.startsWith("gen/node")) {
        subNav = navNode;
      }

      document.head.innerHTML = document.head.innerHTML + navHead;
      document.body.innerHTML = nav + subNav + document.body.innerHTML;

      await Deno.writeTextFile(outPath, "<!DOCTYPE html>" + document.documentElement!.outerHTML, {
        create: true,
      });
    } else {
      await Deno.copyFile(entry.path, outPath);
    }
  }
);

await Array.fromAsync(res);
