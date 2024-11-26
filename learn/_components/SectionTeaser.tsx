export function SectionTeaser(
  props: { title: string; text: string; link: string; cta: string },
) {
  return (
    <div className="mt-4 text-center">
      <h3 className="text-xl font-semibold">
        <a href={props.link}>{props.title}</a>
      </h3>
      <p className="my-4">{props.text}</p>
      <a className="homepage-link runtime-link" href={props.link}>
        {props.cta}
      </a>
    </div>
  );
}
