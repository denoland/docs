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

export function LearningList(
  props: {
    title: string;
    items: SidebarItem[];
    descriptions?: Record<string, string>;
  },
) {
  const anchor = props.title.toLowerCase().replace(/\s+/g, "-");
  return (
    <section className="mb-10">
      <h2 id={anchor} className="text-lg md:text-xl font-semibold mb-4 mt-0">
        {props.title}&nbsp;
        <a class="header-anchor" href={`#${anchor}`}>
          <span class="sr-only">Jump to heading</span>
          <span aria-hidden="true" class="anchor-end">#</span>
        </a>
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 !pl-0 !list-none">
        {props.items.map((item) => {
          const description = props.descriptions?.[item.href];
          return (
            <li className="!mt-0" data-category={item.type}>
              <a
                className="group relative flex h-full flex-col gap-1 p-4 pr-12 rounded-lg border border-foreground-tertiary bg-background-raw no-underline! font-normal hover:border-primary transition-colors duration-150"
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
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
