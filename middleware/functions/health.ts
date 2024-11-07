export default async function healthRequestHandler(
  _: Request,
): Promise<Response> {
  return new Response("OK", { status: 200 });
}
