import { SidebarItem } from "../../types.ts";
import { ExampleIcon } from "./ExampleIcon.tsx";
import { TutorialIcon } from "./TutorialIcon.tsx";
import { VideoIcon } from "./VideoIcon.tsx";

export function TypeIcon({ type }: { type: string }) {
  switch (type) {
    case "tutorial":
      return <TutorialIcon size="1.25rem" />;
    case "video":
      return <VideoIcon size="1.25rem" />;
    default:
      return <ExampleIcon size="1.25rem" />;
  }
}

const difficultyDot: Record<string, string> = {
  beginner: "bg-green-500",
  intermediate: "bg-yellow-500",
  advanced: "bg-red-500",
};

export function LearningList(
  props: {
    title: string;
    items: SidebarItem[];
    descriptions?: Record<string, string>;
    difficulties?: Record<string, string>;
    isReference?: boolean;
  },
) {
  const anchor = props.title.toLowerCase().replace(/\s+/g, "-");
  return (
    <section className="mb-10">
      <h2 id={anchor} className="text-lg md:text-xl font-semibold mb-4 mt-0">
        {props.title}
        {props.isReference && (
          <span className="ml-2 align-middle text-xs font-medium uppercase tracking-wide text-foreground-secondary border border-foreground-tertiary rounded px-1.5 py-0.5">
            Reference
          </span>
        )}
        &nbsp;
        <a class="header-anchor" href={`#${anchor}`}>
          <span class="sr-only">Jump to heading</span>
          <span aria-hidden="true" class="anchor-end">#</span>
        </a>
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 !pl-0 !list-none">
        {props.items.map((item) => {
          const description = props.descriptions?.[item.href];
          const difficulty = props.difficulties?.[item.href];
          return (
            <li className="!mt-0" data-category={item.type}>
              <a
                className="group relative flex h-full flex-col gap-1 p-4 pr-12 rounded-lg border border-foreground-tertiary bg-background-secondary !no-underline font-normal hover:border-primary transition-colors duration-150"
                href={item.href}
              >
                <span
                  className="absolute top-4 right-4"
                  title={item.type}
                  aria-label={item.type}
                >
                  <TypeIcon type={item.type} />
                </span>
                <span className="font-semibold !text-foreground-primary group-hover:underline underline-offset-4 decoration-primary">
                  {item.title}
                </span>
                {description && (
                  <span className="text-sm text-foreground-secondary line-clamp-2">
                    {description}
                  </span>
                )}
                {difficulty && (
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-xs capitalize text-foreground-secondary">
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        difficultyDot[difficulty] ?? "bg-foreground-tertiary"
                      }`}
                      aria-hidden="true"
                    >
                    </span>
                    {difficulty}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
