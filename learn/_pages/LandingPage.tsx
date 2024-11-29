import { LearningList } from "../_components/LearningList.tsx";
import { sidebar } from "../tutorials/_data.ts";
import { TutorialIcon } from "../_components/TutorialIcon.tsx";
import { ExampleIcon } from "../_components/ExampleIcon.tsx";
import { VideoIcon } from "../_components/VideoIcon.tsx";

export default function LandingPage() {
  const componentsPerSidebarItem = sidebar.map(
    (item: { title: string; items: any[] }) => {
      return (
        <LearningList
          title={item.title}
          items={item.items}
        />
      );
    },
  );

  return (
    <main
      id="content"
      className="flex flex-col px-8 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-48"
    >
      <div className="w-full mb-6 max-w-screen-xl mx-auto hub-header">
        <div className="max-w-prose mb-8">
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl mb-3">
            Learning hub
          </h1>
          <p>
            A collection of walkthrough tutorials, examples, videos and guides
            to teach you about the Deno runtime and how to use it with your
            favorite tools.
          </p>
        </div>
        <div className=" mb-2 flex gap-2 flex-wrap items-center">
        <h2 className="font-semibold mb-2 mt-2">
          Filter by type:
        </h2>
          <label for="example" className="mr-4 ml-4 flex items-center">
            <ExampleIcon color="#9d9d9d" />Examples:
            <span className="switch">
              <input
                type="checkbox"
                id="example"
                value="Examples"
                className="mr-2"
                checked
              />
              <span className="slider"></span>
            </span>
          </label>

          <label for="tutorial" className="mr-4 ml-4 flex items-center">
            <TutorialIcon color="#9d9d9d" />Tutorials:
            <span className="switch">
              <input
                type="checkbox"
                id="tutorial"
                value="Tutorials"
                className="mr-2"
                checked
              />
              <span className="slider"></span>
            </span>
          </label>

          <label for="video" className="mr-4 ml-4 flex items-center">
            <VideoIcon color="#9d9d9d" />Videos:
            <span className="switch">
              <input
                type="checkbox"
                id="video"
                value="Videos"
                className="mr-2"
                checked
              />
              <span className="slider"></span>
            </span>
          </label>
        </div>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8 mb-8">
        {componentsPerSidebarItem}
      </div>
      <p class="max-w-prose mx-auto text-center pt-4 mt-3">
        Need an example that isn't here? Or want to add one of your own?<br />
        {" "}
        We welcome contributions!{" "}
        <br />You can request more examples, or add your own at our{" "}
        <a
          href="https://github.com/denoland/deno-docs?tab=readme-ov-file#examples"
          class="text-primary hover:underline focus:underline"
        >
          GitHub repository
        </a>
      </p>
      <a
        href="/runtime/contributing/examples/"
        class="homepage-link runtime-link text-center mt-4"
      >
        Commit an example and we'll send you some stickers!
      </a>
    </main>
  );
}
