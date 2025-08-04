export default function ColumnCard(
  props: {
    headingText: string | JSX.Element;
    text: string | JSX.Element;
    linkHref: string;
    linkText: string;
  },
) {
  return (
    <div className="flex flex-col justify-between">
      <div>
        {typeof props.headingText === "string"
          ? <h4 class="text-lg font-bold mb-2">{props.headingText}</h4>
          : <h4 class="text-lg font-bold mb-2" />}
        <p>{props.text}</p>
      </div>
      <a class="homepage-link deploy-link" href={props.linkHref}>
        {props.linkText}{" "}
        <span aria-hidden="true" class="whitespace-pre">-&gt;</span>
      </a>
    </div>
  );
}
