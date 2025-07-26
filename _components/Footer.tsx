export default function Footer_new() {
  return (
    <footer class="text-sm bg-gray-50 dark:bg-gray-950 p-4 pt-12 sm:px-8 border-t border-t-foreground-tertiary">
      <nav className="flex flex-col gap-y-12 max-w-7xl md:flex-row md:flex-wrap md:justify-between md:w-full md:gap-y-8 md:mx-auto">
        {data.map((category) => (
          <section>
            <h3 class="mb-4 text-base font-bold text-foreground-primary">
              {category.title}
            </h3>
            <ul class="m-0 p-0 list-none">
              {category.items.map((item) => (
                <li>
                  <a
                    class="block mb-2 text-foreground-secondary hover:text-primary"
                    href={item.to ?? item.href}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </nav>
      <p class="m-0 mt-16 mx-auto text-center text-xs text-foreground-secondary">
        Copyright © {new Date().getFullYear()} the Deno authors.
      </p>
    </footer>
  );
}

interface FooterCategory {
  title: string;
  items: FooterItem[];
}

type FooterItem = {
  label: string;
  to: string;
} | {
  label: string;
  href: string;
};

const data = [
  {
    title: "Deno Docs",
    items: [
      {
        label: "Deno Runtime",
        to: "/runtime/",
      },
      {
        label: "Deno Deploy",
        to: "/deploy/manual/",
      },
      {
        label: "Deno Subhosting",
        to: "/subhosting/manual/",
      },
      {
        label: "Examples",
        href: "/examples/",
      },
      {
        label: "Standard Library",
        href: "https://jsr.io/@std",
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        label: "Discord",
        href: "https://discord.gg/deno",
      },
      {
        label: "GitHub",
        href: "https://github.com/denoland",
      },
      {
        label: "Twitter",
        href: "https://twitter.com/deno_land",
      },
      {
        label: "YouTube",
        href: "https://youtube.com/@deno_land",
      },
      {
        label: "Newsletter",
        href: "https://deno.news/",
      },
    ],
  },
  {
    title: "Help & Feedback",
    items: [
      {
        label: "Community Support",
        href: "https://discord.gg/deno",
      },
      {
        label: "Deploy System Status",
        href: "https://denostatus.com",
      },
      {
        label: "Deploy Feedback",
        href: "https://github.com/denoland/deploy_feedback",
      },
      {
        label: "Report a Problem",
        href: "mailto:support@deno.com",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        label: "Blog",
        href: "https://deno.com/blog",
      },
      {
        label: "Careers",
        href: "https://deno.com/jobs",
      },
      {
        label: "Merch",
        href: "https://merch.deno.com/",
      },
      {
        label: "Privacy Policy",
        href: "/deploy/manual/privacy-policy",
      },
    ],
  },
] satisfies FooterCategory[];
