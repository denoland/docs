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
  return (
    <section className="break-inside-avoid-column">
      <h2 className="text-lg md:text-xl font-semibold mb-3">{props.title}</h2>
      <ul className="mb-12">
        {props.items.map((item) => (
          <li
            className="learning-list-item"
            data-category={item.type}
          >
            <a
              className="flex dark:text-foreground-primary gap-3 items-center font-normal underline-offset-4 text-inherit decoration-0 hover:underline hover:decoration-primary hover:decoration-1 hover:text-primary hover:[&_path]:stroke-primary"
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
