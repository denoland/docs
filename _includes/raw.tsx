export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  return (
    <>
      <div className="raw-container">
        {props.children}
        {reference && <props.comp.ToTop />}
      </div>
    </>
  );
}
