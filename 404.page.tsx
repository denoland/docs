export const layout = "raw.tsx";
export const url = "/404";

export default function (data: Lume.Data) {
  return (
    <main
      id="fourohfour"
      class="max-w-screen-xl md:mx-auto"
    >
      <data.comp.FourOhFour />
    </main>
  );
}

export const sidebar = [
  {
    items: [
      {
        title: "deno.com",
        href: "https://deno.com",
      },
    ],
  },
];

export const navigation = [
  {
    name: "Manual",
    href: "/runtime/",
  },
  {
    name: "API reference",
    href: "/api/",
  },
  {
    name: "Examples",
    href: "/examples/",
  },
  {
    name: "Deploy",
    href: "/deploy/manual/",
  },
  {
    name: "Subhosting",
    href: "/subhosting/manual/",
  },
];
