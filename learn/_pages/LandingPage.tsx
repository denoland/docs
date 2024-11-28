import { LearningList } from "../_components/LearningList.tsx";
import { sidebar } from "../tutorials/_data.ts";

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
      className="w-full px-8 mx-8 pt-6 mt-16 mb-20"
    >
      <div className="w-full mb-8 flex justify-between gap-8
      max-w-screen-xl mx-auto">
        <div className="max-w-prose">
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl mb-3">
            Learning hub
          </h1>
          <p>
            A collection of walkthrough tutorials, examples, videos and guides
            to teach you about the Deno runtime and how to use it with your
            favorite tools.
          </p>
        </div>
        <div className="mt-2 ml-5 border-l border-foreground-tertiary dark:border-background-tertiary py-4 pl-4">
          <h2 className="text-lg font-semibold mb-2 whitespace-nowrap">
            Filter by type
          </h2>

          <label for="example" className="block text-[13px]">
            <input
              type="checkbox"
              id="example"
              value="Examples"
              className="mr-2"
              checked
            />Examples
          </label>

          <label for="tutorial" className="block text-[13px]">
            <input
              type="checkbox"
              id="tutorial"
              value="Tutorials"
              className="mr-2"
              checked
            />Tutorials
          </label>

          <label for="video" className="block text-[13px]">
            <input
              type="checkbox"
              id="video"
              value="Videos"
              className="mr-2"
              checked
            />Videos
          </label>
        </div>
      </div>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
        {componentsPerSidebarItem}
      </div>
      <p class="max-w-prose mx-auto text-center">
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
