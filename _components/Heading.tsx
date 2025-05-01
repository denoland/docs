export default function Heading(
  props: { children: any; type: string; level: number },
) {
  const Tag = `h${props.level}` as any;

  return (
    <Tag className={`heading heading-${props.type}`}>
      {props.children}
    </Tag>
  );
}

export const css = `@import './_components/Heading.css';`;
