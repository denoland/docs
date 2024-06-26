export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  if (reference) {
    return (
      <div>
        {props.children}
      </div>
    );
  }

  return (
    <div
      class="absolute top-12 bottom-0 left-0 right-0 overflow-y-auto"
      style={{ scrollbarGutter: "stable" }}
    >
      {props.children}
      <props.comp.Footer />
    </div>
  );
}
