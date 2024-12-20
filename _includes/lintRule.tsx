import { getLintIcon } from "../lint/index.tsx";

export const layout = "doc.tsx";

export default function LintRule(props: Lume.Data, _helpers: Lume.Helpers) {
  return (
    <>
      {props.data.tags.map((tag) => getLintIcon(tag))}
      {props.children}
    </>
  );
}
