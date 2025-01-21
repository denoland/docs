import { expandGlob } from "@std/fs";
import webCategoryDocs from "./_categories/web-categories.json" with {
  type: "json",
};
import denoCategoryDocs from "./_categories/deno-categories.json" with {
  type: "json",
};
import { PackageConfig } from "./types.ts";

export const root = "/api";
export const sections = [
  { name: "Deno APIs", path: "deno", categoryDocs: denoCategoryDocs },
  { name: "Web APIs", path: "web", categoryDocs: webCategoryDocs },
  { name: "Node APIs", path: "node", categoryDocs: undefined },
];

export const packages: PackageConfig[] = [
  { packageName: "Web", files: ["./types/web.d.ts"] },
  { packageName: "Deno", files: ["./types/deno.d.ts"] },
  { packageName: "Node", files: await getNodeTypeFiles() },
];

async function getNodeTypeFiles() {
  const urls: string[] = [];
  for await (const file of expandGlob("./reference_gen/types/node/[!_]*")) {
    urls.push(file.path);
  }
  return urls;
}
