import { ExampleIcon } from "../examples/_components/ExampleIcon.tsx";
import { LearningList } from "../examples/_components/LearningList.tsx";
import { TutorialIcon } from "../examples/_components/TutorialIcon.tsx";
import { VideoIcon } from "../examples/_components/VideoIcon.tsx";
import { sidebar } from "../examples/_data.ts";

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
    <>
      <main
        id="content"
        className="flex flex-col px-8 xl:px-0 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-12"
      >
        <div className="flex flex-col md:flex-row w-full mb-8 max-w-screen-xl justify-between hub-header">
          <div className="max-w-prose mb-8">
            <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl mb-3">
              Examples
            </h1>
            <p>
              A collection of walkthrough tutorials, examples, videos and guides
              to teach you about the Deno runtime and how to use it with your
              favorite tools.
            </p>
          </div>
          <div className="flex flex-col gap-1 md:ml-4 mb-8">
            <h2 className="text-xs font-semibold mb-1">
              Filter by type
            </h2>
            <label for="example" className="flex gap-2 items-center">
              <span className="switch">
                <input
                  type="checkbox"
                  id="example"
                  value="Examples"
                  className="filter mr-2"
                  checked
                />
                <span className="slider"></span>
              </span>
              <ExampleIcon />
              <span>Examples</span>
            </label>

            <label for="tutorial" className="flex gap-2 items-center">
              <span className="switch">
                <input
                  type="checkbox"
                  id="tutorial"
                  value="Tutorials"
                  className="filter mr-2"
                  checked
                />
                <span className="slider"></span>
              </span>
              <TutorialIcon />
              <span>
                Tutorials
              </span>
            </label>

            <label for="video" className="flex gap-2 items-center">
              <span className="switch">
                <input
                  type="checkbox"
                  id="video"
                  value="Videos"
                  className="filter mr-2"
                  checked
                />
                <span className="slider"></span>
              </span>
              <VideoIcon />
              <span>
                Videos
              </span>
            </label>
          </div>
        </div>
        <div className="unfiltered columns-1 sm:columns-2 lg:columns-3 gap-8 mb-8">
          {componentsPerSidebarItem}
        </div>
        <div className="fully-filtered">
          <h2 class="text-2xl font-semibold sm:text-3xl md:text-4xl">
            Oops! You've filtered everything
          </h2>
          <p class="md:text-lg mt-4">
            Maybe remove a filter to see some examples?
          </p>
          <img
            src="/examples/tutorials/images/deno-educator.png"
            alt="sad Deno with a grad cap"
          />
        </div>
      </main>
      <aside class="px-8 xl:px-0 max-w-[1200px] mx-auto mb-24 space-y-4 border-t pt-8">
        <h2 class="text-2xl md:text-3xl font-bold">
          We welcome contributions!
        </h2>
        <p class="text-balance pt-4 mt-3">
          Looking for an example that isn't here? Or want to add one of your
          own? Check out our{" "}
          <a
            href="https://github.com/denoland/deno-docs?tab=readme-ov-file#examples"
            class="text-primary hover:underline focus:underline"
          >
            GitHub repository
          </a>.
        </p>
        <p>
          <a
            href="/runtime/contributing/examples/"
            class="text-primary hover:underline focus:underline text-center mt-4 font-bold"
          >
            Commit an example and we'll send you stickers!
          </a>
        </p>
      </aside>
    </>
  );
}
