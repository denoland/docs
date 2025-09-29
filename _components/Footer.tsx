export default function Footer_new() {
  return (
    <footer class="text-smaller bg-gray-50 dark:bg-gray-950 p-4 pt-12 sm:px-8 border-t border-t-foreground-tertiary">
      <nav className="flex flex-col gap-x-4 gap-y-12 max-w-7xl md:flex-row md:flex-wrap md:justify-between md:w-full md:gap-y-8 md:mx-auto">
        {data.map((category) => (
          <section class="flex-auto">
            <h3 class="mb-2 uppercase font-bold text-foreground-primary whitespace-pre">
              {category.title}
            </h3>
            <ul class="m-0 p-0 pl-3 border-l border-l-background-tertiary list-none">
              {category.items.map((item) => (
                <li>
                  <a
                    class="block mb-2 hover:text-primary hover:underline"
                    href={item.to ?? item.href}
                    dangerouslySetInnerHTML={{ __html: item.label }}
                  />
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
        label: "Examples",
        href: "/examples/",
      },
      {
        label: "Standard Library",
        href: "https://jsr.io/@std",
      },
      {
        label: "Deno API Reference",
        href: "/api/deno/~/Deno",
      },
    ],
  },
  {
    title: "Services Docs",
    items: [
      {
        label: "Deno Deploy ",
        to: "/deploy/",
      },
      {
        label: "Deno Deploy Classic",
        to: "/deploy/classic/",
      },
      {
        label: "Deno Subhosting",
        to: "/subhosting/manual/",
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
        label: "YouTube",
        href: "https://youtube.com/@deno_land",
      },
      {
        label: "Bluesky",
        href: "https://bsky.app/profile/deno.land",
      },
      {
        label: "Mastodon",
        href: "https://fosstodon.org/@deno_land",
      },
      {
        label: "Twitter",
        href: "https://twitter.com/deno_land",
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
        label: "Deno Website",
        href: "https://deno.com/",
      },
      {
        label: "Blog",
        href: "https://deno.com/blog",
      },
      {
        label: "Merch",
        href: "https://merch.deno.com/",
      },
      {
        label: "Privacy Policy",
        href: "/deploy/privacy-policy",
      },
    ],
  },
] satisfies FooterCategory[];
