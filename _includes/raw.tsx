export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  return (
    <>
      <main
        tabIndex={-1}
        id="content"
        className="raw-container flex flex-col px-8 xlplus:px-0 pt-6 md:pt-12 mt-4 max-w-7xl mx-auto mb-12"
      >
        {props.children}
        {reference && <props.comp.ToTop />}
      </main>
    </>
  );
}
