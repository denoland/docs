export default function OpenGraph(
  { title, description, section, url }: {
    title: string;
    description: string;
    section: string;
    url: string;
  },
) {
  let image;
  if (section == "api") {
    image = `/img/og.webp`;
  } else {
    image = `${url}index.png`;
  }
  return (
    <>
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={description} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@deno_land" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={description} />
      <meta property="og:type" content="article" />
      <meta property="og:site_name" content="Deno" />
      <meta property="og:locale" content="en_US" />
    </>
  );
}
