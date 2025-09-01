export default function Heading(
  props: { children: Element; type: string; level: 1 | 2 | 3 | 4 | 5 | 6 },
) {
  if (props.level == 1) {
    return (
      <h1 className="text-4xl md:text-5xl font-semibold mb-4 leading-none">
        {props.children}
      </h1>
    );
  } else if (props.level == 2) {
    return (
      <h2
        className={`text-3xl md:text-4xl font-semibold mt-8 mb-4 leading-none`}
      >
        {props.children}
      </h2>
    );
  } else if (props.level == 3) {
    return (
      <h3
        className={`text-2xl md:text-3xl font-semibold mb-4 leading-none`}
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
