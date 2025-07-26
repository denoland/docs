export default function Banner(props: { children: Element; type: string }) {
  return (
    <div
      className={`flex flex-col gap-4 p-4 sm:p-6 md:p-8 border-l-4 text-runtime-foreground dark:bg-background-secondary w-full my-16 mx-0 ${
        props.type === "deploy"
          ? "border-deploy-500 bg-deploy-50"
          : "border-runtime-500 bg-runtime-background"
      }`}
    >
      {props.children}
    </div>
  );
}
