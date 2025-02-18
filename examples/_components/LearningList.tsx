import { TutorialIcon } from "./TutorialIcon.tsx";
import { ExampleIcon } from "./ExampleIcon.tsx";
import { VideoIcon } from "./VideoIcon.tsx";
import { SidebarItem } from "../../types.ts";

export function LearningList(
  props: {
    title: string;
    items: SidebarItem[];
  },
) {
  return (
    <section className="break-inside-avoid-column">
      <h2 className="text-lg font-semibold mb-3">{props.title}</h2>
      <ul className="mb-8 examples-list">
        {props.items.map((item) => (
          <li
            className="learning-list-item"
            data-category={item.type}
          >
            <a
              className="learn-link runtime-link"
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
