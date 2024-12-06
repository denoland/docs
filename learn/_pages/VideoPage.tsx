import { EmbedVideo } from "../_components/EmbedVideo.tsx";
import { ExampleFromFileSystem } from "../types.ts";

type Props = { example: ExampleFromFileSystem };

export default function VideoPage({ example }: Props) {
  return (
    <>
      <EmbedVideo id={example.externalURL} />
      <div className="my-12">
        Find more videos in the <a href="/learn/">Learning Hub</a> and on our
        {"  "}<a href="https://www.youtube.com/@deno_land">YouTube channel</a>.
      </div>
    </>
  );
}
