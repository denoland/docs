export default function Columns(props: { children: any }) {
  return <section className="columns">{props.children}</section>;
}

export const css = `@import './_components/Columns.css';`;
