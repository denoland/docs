import { EmbedVideo } from "../_components/EmbedVideo.tsx";
import { VideoReference } from "../types.ts";

type Props = { video: VideoReference };

export default function VideoPage({ video }: Props) {
  return (
    <>
      <EmbedVideo id={video.externalURL} />
      <div className="my-12">
        Find more videos in the <a href="/examples/">Learning Hub</a> and on our
        {"  "}<a href="https://www.youtube.com/@deno_land">YouTube channel</a>.
      </div>
    </>
  );
}
