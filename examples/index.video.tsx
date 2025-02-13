import VideoPage from "./_pages/VideoPage.tsx";
import { sidebar as sidebar_ } from "./_data.ts";

export const layout = "doc.tsx";

export const sidebar = sidebar_;
export const toc = [];

export default function* (_data: Lume.Data, helpers: Lume.Helpers) {
  // flatten the sidebar object into a single array of items
  const flattenedVideos = sidebar.flatMap((item) => item.items);
  const videos = flattenedVideos.filter((item) => item.type === "video");

  // Generate a page for each item listed in the data
  for (const video of videos) {
    if (!video.externalURL) {
      continue;
    }

    yield {
      url: `${video.href}/index.html`,
      title: `${video.title}`,
      content: <VideoPage video={video} />,
    };
  }
}
