export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  return (
    <>
      {props.children}
      <props.comp.Footer />
    </>
  );
}
