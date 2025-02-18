export const css = "@import './_components/VideoPlayer.css';";

/**
 * Embed a YouTube video.
 * @param props.id - The YouTube ID or URL.
 * @returns A custom element that embeds the YouTube video with Lite YouTube Embed.
 */
export default function (
  props: { id: string },
) {
  const videoid = extractID(props.id);
  return <lite-youtube videoid={videoid}></lite-youtube>;
}

/**
 * Extract a YouTube ID from a string.
 * @param idOrUrl String to test
 * @returns A YouTube video ID or undefined if none matched
 */
function extractID(idOrUrl: string) {
  const idRegExp = /^[A-Za-z0-9-_]+$/;
  if (idRegExp.test(idOrUrl)) return idOrUrl;
  return urlMatcher(idOrUrl);
}

/**
 * Extract a YouTube ID from a URL if it matches the pattern.
 * @param url URL to test
 * @returns A YouTube video ID or undefined if none matched
 */
function urlMatcher(url: string): string | undefined {
  const urlPattern =
    /(?=(\s*))\1(?:<a [^>]*?>)??(?=(\s*))\2(?:https?:\/\/)??(?:w{3}\.)??(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|shorts\/)??([A-Za-z0-9-_]{11})(?:[^\s<>]*)(?=(\s*))\4(?:<\/a>)??(?=(\s*))\5/;
  const match = url.match(urlPattern);
  return match?.[3];
}

export const js = `
  import "/js/youtube-lite.client.js";
`;
