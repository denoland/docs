export const layout = "doc.tsx";

export default function Raw(data: Lume.Data) {
  return (
    <>
      <p className="italic">
        <a href="https://deno.com/deploy/sandboxes/">Deno Sandboxes</a>{" "}
        provide a sandboxed environment for evaluating JavaScript code. This is
        useful for evaluating code that is not trusted or for testing code that
        is not safe to run in the main runtime.
      </p>

      {data.children}

      <p className="my-8 block">
        For more information about Sandboxes, see the{" "}
        <a href="/sandboxes/">Sandboxes documentation</a>.
      </p>
    </>
  );
}
