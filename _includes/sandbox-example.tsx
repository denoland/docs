export const layout = "doc.tsx";

export default function Raw(data: Lume.Data) {
  return (
    <>
      <p className="italic">
        <a href="https://deno.com/deploy/sandbox/">Deno Sandbox</a>{" "}
        provides a sandboxed Linux microVM. This is useful for evaluating code
        that is not trusted or for testing code that is not safe to run in your
        main runtime.
      </p>

      {data.children}

      <p className="my-8 block">
        For more information, see the{" "}
        <a href="/sandbox/">Deno Sandbox documentation</a>.
      </p>
    </>
  );
}
