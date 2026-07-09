import { ExampleIcon } from "../examples/_components/ExampleIcon.tsx";
import {
  LearningList,
  TypeIcon,
} from "../examples/_components/LearningList.tsx";
import { TutorialIcon } from "../examples/_components/TutorialIcon.tsx";
import { VideoIcon } from "../examples/_components/VideoIcon.tsx";
import { featuredItems, sidebar } from "../examples/_data.ts";

function FeaturedStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="0.95rem"
      height="0.95rem"
      className="inline-block align-baseline fill-primary shrink-0"
      aria-hidden="true"
    >
      <path d="M12 2l2.92 6.26 6.58.84-4.84 4.57 1.26 6.53L12 17l-5.92 3.2 1.26-6.53L2.5 9.1l6.58-.84z" />
    </svg>
  );
}

export default function LandingPage(
  { descriptions }: { descriptions?: Record<string, string> },
) {
  const counts = { example: 0, tutorial: 0, video: 0 };
  for (const category of sidebar) {
    for (const item of category.items) {
      counts[item.type as keyof typeof counts]++;
    }
  }
  const total = counts.example + counts.tutorial + counts.video;
  const componentsPerSidebarItem = sidebar.map(
    (item: { title: string; items: any[] }) => {
      return (
        <LearningList
          title={item.title}
          items={item.items}
          descriptions={descriptions}
        />
      );
    },
  );

  return (
    <>
      <div>
        <div className="flex flex-col md:flex-row w-full mb-8 max-w-screen-xl justify-between">
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
          <img
            className="w-full max-w-32 mx-auto h-auto mb-4 hidden md:block"
            alt="Deno Examples"
            src="/examples.png"
          />
        </div>
        <details
          id="guide-request-box"
          className="mb-8 p-4 border border-blue-100 dark:border-background-tertiary bg-blue-50 dark:bg-background-secondary rounded"
        >
          <summary className="cursor-pointer">
            <span className="font-semibold">
              Can't find what you're looking for?
            </span>{" "}
            <span className="text-primary underline underline-offset-4">
              Request a new guide
            </span>
          </summary>
          <form id="guide-request-form" className="mt-4 max-w-prose space-y-3">
            <textarea
              className="block w-full p-2 border border-foreground-tertiary bg-white dark:bg-background-primary rounded"
              name="guide-request-comment"
              required
              minLength={3}
              placeholder="What would you like a guide or example for?"
            >
            </textarea>
            <input
              type="text"
              className="block w-full p-2 border border-foreground-tertiary bg-white dark:bg-background-primary rounded"
              name="guide-request-contact"
              placeholder="GitHub username (optional, you'll be @mentioned)"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 italic">
              Your request will be posted as an issue in the denoland/docs
              GitHub repo.
            </p>
            <button type="submit" className="btn">Request guide</button>
          </form>
        </details>

        <section className="mb-10">
          <h2 className="text-lg md:text-xl font-semibold mb-4">Featured</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {featuredItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative flex flex-col gap-2 p-4 pr-12 rounded-lg border border-background-tertiary bg-background-raw dark:bg-background-primary no-underline! hover:border-primary transition-colors duration-150"
              >
                <span
                  className="absolute top-4 right-4"
                  title={item.type}
                  aria-label={item.type}
                >
                  <TypeIcon type={item.type} />
                </span>
                <span className="leading-none font-semibold !text-foreground-primary group-hover:underline underline-offset-4 decoration-primary">
                  <FeaturedStar /> {item.title}
                </span>
                <span className="text-xs text-foreground-secondary">
                  {item.description}
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 w-full mb-4 mt-16 p-4 border border-blue-100 dark:border-background-tertiary bg-blue-50 dark:bg-background-secondary rounded md:flex-wrap md:justify-start md:items-center md:flex-row">
          <h2 className="font-semibold">
            Filter by type:
          </h2>
          <label for="example" className="flex gap-2 items-center mr-4">
            <ExampleIcon size="1.5rem" />
            <span>Examples ({counts.example})</span>
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
          </label>

          <label for="tutorial" className="flex gap-2 items-center mr-4">
            <TutorialIcon size="1.5rem" />
            <span>Tutorials ({counts.tutorial})</span>
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
          </label>

          {counts.video > 0 && (
            <label for="video" className="flex gap-2 items-center mr-4">
              <VideoIcon size="1.5rem" />
              <span>Videos ({counts.video})</span>
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
            </label>
          )}
          <span className="md:ml-auto text-sm text-foreground-secondary">
            {total} items total
          </span>
        </section>

        <nav
          className="flex flex-wrap gap-1 mb-10"
          aria-label="Example categories"
        >
          {sidebar.map((category: { title: string }) => (
            <a
              key={category.title}
              href={`#${category.title.toLowerCase().replace(/\s+/g, "-")}`}
              className="px-2 py-1 rounded-full border border-foreground-tertiary text-xs !no-underline text-foreground-secondary hover:border-primary hover:text-primary transition-colors duration-150"
            >
              {category.title}
            </a>
          ))}
        </nav>

        <section className="unfiltered mb-8 w-full markdown-body">
          {componentsPerSidebarItem}
        </section>
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
      </div>
    </>
  );
}
