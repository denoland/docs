export default function (props: { title: string; copy: string }) {
  return (
    <div class="grid grid-cols-1 md:grid-cols-3 mb-6 gap-4">
      <h1 class="text-4xl md:text-5xl mb-2 md:mb-6 font-bold">
        {props.title}
      </h1>
      <p class="text-md max-w-[600px] md:text-lg">
        {props.copy}
      </p>
      <img
        class="w-full h-full"
        src="/deno-looking-up.svg"
        alt="Deno logo"
      />
    </div>
  );
}
