export default function Footer_new() {
  return (
    <footer>
      <nav aria-labelledby="footer-navigation" className="footer-nav">
        {data.map((category) => (
          <section className="footer-section">
            <h3 class="footer-section-heading">{category.title}</h3>
            <ul class="footer-list">
              {category.items.map((item) => (
                <li>
                  <a
                    class="footer-link"
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
      <p class="copyright">
        Copyright © {new Date().getFullYear()} the Deno authors.
      </p>
    </footer>
  );
}

export const css = "@import './_components/Footer.css';";

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
