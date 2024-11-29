import { walkSync } from "@std/fs/walk";
import ExamplePage from "./_pages/ExamplePage.tsx";
import VideoPage from "./_pages/VideoPage.tsx";
import { ExampleFromFileSystem } from "./types.ts";
import { parseExample } from "./utils/parseExample.ts";
import { sidebar as sidebar_ } from "./tutorials/_data.ts";

export const layout = "raw_with_sidebar.tsx";

export const sidebar = sidebar_;
export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  // flatten the sidebar object into a single array of items
  const flattenedVideos = sidebar.flatMap((item) => item.items);
  const videos = flattenedVideos.filter((item) => item.type === "video");

  // Generate a page for each item listed in the data
  for (const video of videos) {
    yield {
      url: `${video.id}/index.html`,
      title: `${video.label} - Deno by Example`,
      content: <VideoPage example={video} />,
    };
  }
}
