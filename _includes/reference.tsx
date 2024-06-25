export const layout = "layout.tsx";

export default function Reference(props: Lume.Data, helpers: Lume.Helpers) {
  return (
    <>
      {props.children}
      <props.comp.Footer />
    </>
  );
}
