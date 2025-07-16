export default function Heading(
  props: { children: Element; type: string; level: 1 | 2 | 3 | 4 | 5 | 6 },
) {
  let headingTypeClass = "";
  if (props.type === "purple") {
    headingTypeClass = "decoration-purple-500";
  } else if (props.type === "deploy") {
    headingTypeClass = "decoration-deploy-500";
  } else if (props.type === "runtime") {
    headingTypeClass = "decoration-runtime-500";
  }
  if (props.level == 1) {
    return (
      <h1 className={headingTypeClass}>
        {props.children}
      </h1>
    );
  } else if (props.level == 2) {
    return (
      <h2
        className={`text-3xl md:text-4xl font-semibold underline underline-offset-8 mb-6 ${headingTypeClass}`}
      >
        {props.children}
      </h2>
    );
  } else if (props.level == 3) {
    return (
      <h3
        className={`text-xl md:text-2xl font-semibold underline underline-offset-8 mb-4 ${headingTypeClass}`}
      >
        {props.children}
      </h3>
    );
  } else if (props.level == 4) {
    return (
      <h4>
        {props.children}
      </h4>
    );
  } else if (props.level == 5) {
    return (
      <h5>
        {props.children}
      </h5>
    );
  } else if (props.level == 6) {
    return (
      <h6>
        {props.children}
      </h6>
    );
  }
  return null;
}
