import { TutorialIcon } from "./TutorialIcon.tsx";
import { ExampleIcon } from "./ExampleIcon.tsx";

export function LearningList(
  props: {
    title: string;
    items: ({ label: string; id: string; type: string })[];
  },
) {
  return (
    <section className="break-inside-avoid-column">
      <h2 className="text-lg font-semibold mb-3">{props.title}</h2>
      <ul className="mb-8">
        {props.items.map((item) => (
          <li className="leading-7">
            <a
              className={`homepage-link mb-1 runtime-link ${item.type}`}
              href={item.id}
            >
              {item.type === "tutorial" && <TutorialIcon color="#9d9d9d" />}
              {item.type === "example" && <ExampleIcon color="#9d9d9d" />}

              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
