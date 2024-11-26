export function TutorialList(
  props: { group: string; name: string; link: string },
) {
  return (
    <section>
      <h2>{props.group}</h2>
      <ul>
        <li>
          <a href={props.link}>{props.name}</a>
        </li>
      </ul>
    </section>
  );
}
