import { SidebarItem } from "../../types.ts";
import { ExampleIcon } from "./ExampleIcon.tsx";
import { TutorialIcon } from "./TutorialIcon.tsx";
import { VideoIcon } from "./VideoIcon.tsx";

export function LearningList(
  props: {
    title: string;
    items: SidebarItem[];
  },
) {
  const anchor = props.title.toLowerCase().replace(/\s+/g, "-");
  return (
    <section className="break-inside-avoid-column">
      <h2 id={anchor} className="text-lg md:text-xl font-semibold mb-3 mt-0">
        {props.title}&nbsp;
        <a class="header-anchor" href={`#${anchor}`}>
          <span class="sr-only">Jump to heading</span>
          <span aria-hidden="true" class="anchor-end">#</span>
        </a>
      </h2>
      <ul className="mb-12 pl-2">
        {props.items.map((item) => (
          <li
            className="learning-list-item"
            data-category={item.type}
          >
            <a
              className="flex dark:text-foreground-primary gap-3 items-center font-normal no-underline underline-offset-4 text-inherit decoration-0 hover:underline hover:decoration-primary hover:decoration-1 hover:text-primary hover:[&_path]:stroke-primary hover:[&_circle]:stroke-primary hover:[&_rect]:stroke-primary"
              href={item.href}
            >
              {item.type === "tutorial" && <TutorialIcon />}
              {item.type === "example" && <ExampleIcon />}
              {item.type === "video" && <VideoIcon />}

              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
