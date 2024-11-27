import { TutorialList } from "../_components/TutorialList.tsx";
import { sidebar } from "../tutorials/_data.ts";

export default function TutorialPage() {
  const componentsPerSidebarItem = sidebar.map((item) => {
    return (
      <TutorialList
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
      <div className="pb-16 md:pb-0 w-full flex items-center">
        <div className="align-middle gap-8 mb-20">
          <h1 className="text-4xl md:text-6xl font-semibold mb-4">
            Tutorials and guides
          </h1>
          <p className="max-w-prose mx-auto">
            Walkthrough tutorials and guides to teach you about the Deno runtime
            and how to use it with your favorite tools.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {componentsPerSidebarItem}
      </div>
    </main>
  );
}
