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
        to: "/runtime/manual",
      },
      {
        label: "Deno Deploy",
        to: "/deploy/manual",
      },
      {
        label: "Deno Subhosting",
        to: "/subhosting/manual",
      },
      {
        label: "Examples",
        href: "/examples",
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
        href: "https://www.denostatus.com",
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
        href: "https://www.deno.com/blog",
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

export default function Footer() {
  return (
    <footer class="w-full border-t border-gray-200 pt-12">
      <div class="max-w-screen-xl mx-auto pb-16 px-4 sm:px-8 md:px-16">
        <div class="grid md:grid-cols-2 lg:grid-cols-4 md:-mx-8">
          {data.map((category) => (
            <div class="md:mx-4 mb-12">
              <h3 class="font-bold mb-4">{category.title}</h3>
              <ul>
                {category.items.map((item) => (
                  <li>
                    <a
                      class="block items-center py-1 text-gray-600 hover:text-primary hover:underline"
                      href={item.to ?? item.href}
                    >
                      {item.label}
                      {item.href && (
                        <svg
                          width="13.5"
                          height="13.5"
                          aria-hidden="true"
                          viewBox="0 0 24 24"
                          class="inline  ml-2"
                        >
                          <path
                            fill="currentColor"
                            d="M21 13v10h-21v-19h12v2h-10v15h17v-8h2zm3-12h-10.988l4.035 4-6.977 7.07 2.828 2.828 6.977-7.07 4.125 4.172v-11z"
                          >
                          </path>
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p class="text-center mt-12 text-sm col-span-4">
          Copyright © {new Date().getFullYear()} the Deno authors.
        </p>
      </div>
    </footer>
  );
}
