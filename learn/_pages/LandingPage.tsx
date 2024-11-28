import { SectionTeaser } from "../_components/SectionTeaser.tsx";
import { LearningList } from "../_components/LearningList.tsx";
import { sidebar } from "../tutorials/_data.ts";

export default function LandingPage() {
  const componentsPerSidebarItem = sidebar.map((item) => {
    return (
      <LearningList
        title={item.title}
        items={item.items}
      />
    );
  });

  return (
    <main
      id="content"
      className="w-full px-8 pt-6 mt-16 max-w-screen-xl mx-auto mb-20"
    >
      <div className="pb-16 md:pb-0 w-full mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl mb-3">
          Learning hub
        </h1>
        <p className="max-w-prose mb-6">
          Walkthrough tutorials, examples and guides to teach you about the Deno
          runtime <br />and how to use it with your favorite tools.
        </p>
      </div>
      <div className="columns-3 gap-8">
        {componentsPerSidebarItem}
      </div>
    </main>
  );
}
