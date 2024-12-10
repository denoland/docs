import { TutorialIcon } from "./TutorialIcon.tsx";
import { ExampleIcon } from "./ExampleIcon.tsx";
import { VideoIcon } from "./VideoIcon.tsx";

export function LearningList(
  props: {
    title: string;
    items: ({ label: string; id: string; type: string })[];
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
              href={item.id}
            >
              {item.type === "tutorial" && <TutorialIcon />}
              {item.type === "example" && <ExampleIcon />}
              {item.type === "video" && <VideoIcon />}

              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
