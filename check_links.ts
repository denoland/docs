import { DOMParser } from "@b-fuze/deno-dom";

export interface CheckOptions {
  include?: { regex: RegExp; follow: boolean }[];
  exclude?: RegExp[];
}

interface CheckItem {
  url: string;
  referrer: string;
}

async function checkLinks(root: URL, options: CheckOptions = {}) {
  const errors: { url: string; referrer: string; code: number }[] = [];

  const stack: CheckItem[] = [{
    url: root.href,
    referrer: "",
  }];
  const checked = new Set<string>();

  let current: CheckItem | undefined;
  while ((current = stack.pop()) !== undefined) {
    if (checked.has(current.url)) continue;
    checked.add(current.url);

    if (options.exclude?.some((reg) => reg.test(current!.url))) {
      continue;
    }

    console.log(
      `%cChecking%c ${current.url}%c <- ${current.referrer}`,
      "color: cyan;",
      "color: inherit",
      "color: gray",
    );
    const res = await fetch(current.url, {
      headers: {
        "accept": "text/html,*/*",
      },
    });
    if (!res.ok) {
      console.error(`  ${res.status}: ${current.url} <- ${current.referrer}`);
      errors.push({
        url: current.url,
        referrer: current.referrer,
        code: res.status,
      });
      await res.body?.cancel();
    } else if (res.headers.get("Content-Type")?.includes("text/html")) {
      const body = await res.text();
      const p = new DOMParser().parseFromString(body, "text/html");

      // Check links
      for (const el of Array.from(p.querySelectorAll("a[href]"))) {
        let link = el.getAttribute("href") ?? "";
        if (link.startsWith("/")) {
          link = new URL(link, res.url).href;
        }

        // Ignore self links
        if (link === current.url || link === res.url) continue;

        // Ignore already checked links
        if (checked.has(link)) continue;

        const includes = options.include ?? [];
        for (let i = 0; i < includes.length; i++) {
          const include = includes[i];
          if (
            include.regex.test(link) &&
            (include.follow || !include.regex.test(res.url))
          ) {
            stack.push({ url: link, referrer: res.url });
            continue;
          }
        }
      }
    } else {
      await res.body?.cancel();
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Could not find these URLs:\n\n${
        errors.map((err) => `- ${err.code} ${err.url} <- ${err.referrer}`).join(
          "\n",
        )
      }`,
    );
  }
}

await checkLinks(new URL("https://deno.com"), {
  exclude: [
    /^https?:\/\/deno\.com\/x/,
    /https:\/\/docs\.deno\.com\/runtime\/manual\/help/,
  ],
  include: [
    { regex: /^https?:\/\/docs\.deno\.com/, follow: false },
    { regex: /^https?:\/\/deno\.com/, follow: true },
  ],
});
