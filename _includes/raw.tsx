export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  return (
    <>
      <div style={{ scrollbarGutter: "stable" }}>
        {props.children}
        {reference && <props.comp.ToTop />}
      </div>
    </>
  );
}
