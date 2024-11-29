import { LearningList } from "../_components/LearningList.tsx";
import { sidebar } from "../tutorials/_data.ts";
import { EmbedVideo } from "../_components/EmbedVideo.tsx";

export default function VideoPage({ example }: Props) {
  return (
    <main
      id="content"
      className="w-full px-8 pt-6 mt-16 max-w-screen-xl mx-auto mb-20"
    >
      <div className="w-full mb-8">
        <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl mb-3">
          {example.label}
        </h1>
        <p className="max-w-prose mb-6">
          Walkthrough tutorials, examples and guides to teach you about the Deno
          runtime <br />and how to use it with your favorite tools.
        </p>
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
        <EmbedVideo id={example.externalURL} />
      </div>
    </main>
  );
}
