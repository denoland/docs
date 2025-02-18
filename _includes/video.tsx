export const layout = "doc.tsx";

export default function Raw(data: Lume.Data) {
  return (
    <>
      <data.comp.VideoPlayer id={data.videoUrl} />

      {data.children}

      <div className="my-12">
        Find more videos in the <a href="/examples/">Examples page</a>{" "}
        and on our{"  "}
        <a href="https://www.youtube.com/@deno_land">YouTube channel</a>.
      </div>
    </>
  );
}
