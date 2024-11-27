export function TutorialList(
  props: { title: string; items: ({ label: string; id: string })[] },
) {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold mb-3">{props.title}</h2>
      <ul className="">
        {props.items.map((item) => (
          <li>
            <a className="homepage-link mb-1 runtime-link" href={item.id}>{item.label}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
