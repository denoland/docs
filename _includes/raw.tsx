export const layout = "layout.tsx";

export default function Raw(props: Lume.Data, helpers: Lume.Helpers) {
  const reference = props.url.startsWith("/api");

  return (
    <>
      <div className="raw-container flex flex-col px-8 xl:px-0 pt-6 md:pt-12 mt-4 md:items-center md:justify-center max-w-[1200px] mx-auto mb-12">
        {props.children}
        {reference && <props.comp.ToTop />}
      </div>
    </>
  );
}
