/**
 * @title Communicate over QUIC
 * @difficulty intermediate
 * @tags cli
 * @run --unstable-net --allow-net --allow-read <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.QuicEndpoint} Doc: Deno.QuicEndpoint
 * @resource {https://docs.deno.com/api/deno/~/Deno.connectQuic} Doc: Deno.connectQuic
 * @group Network
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>QUIC is the transport protocol underneath HTTP/3. It runs over UDP,
 * always encrypts with TLS, connects faster than TCP plus TLS, and one
 * connection carries many independent streams with no head-of-line
 * blocking. This example starts a QUIC server and client in one process
 * and echoes a message over a bidirectional stream.
 *
 * QUIC always requires TLS, so the server needs a certificate. For local
 * development, generate a self-signed one (note CA:FALSE, clients reject
 * certificates marked as CA when used by a server):
 * <code>openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost" -addext "basicConstraints=critical,CA:FALSE"</code>
 */

const cert = Deno.readTextFileSync("./server.crt");
const key = Deno.readTextFileSync("./server.key");

// A QuicEndpoint binds a UDP socket. Listening on it takes the TLS
// configuration; ALPN protocol names are required and both sides must
// agree on one.
const endpoint = new Deno.QuicEndpoint({ hostname: "localhost", port: 4433 });
const listener = endpoint.listen({ cert, key, alpnProtocols: ["echo"] });

// The server accepts connections, and on each connection accepts incoming
// bidirectional streams. Each stream is an independent, ordered, reliable
// channel: a pair of web streams, just like other Deno networking APIs.
(async () => {
  for await (const incoming of listener) {
    const conn = await incoming.accept();
    const { value: stream } = await conn.incomingBidirectionalStreams
      .getReader().read();
    if (!stream) continue;
    const message = await new Response(stream.readable).text();
    const writer = stream.writable.getWriter();
    await writer.write(new TextEncoder().encode(`echo: ${message}`));
    await writer.close();
  }
})();

// Connect as a client. caCerts trusts our self-signed certificate; with a
// real certificate it is not needed.
const client = await Deno.connectQuic({
  hostname: "localhost",
  port: 4433,
  caCerts: [cert],
  alpnProtocols: ["echo"],
});

// Open a bidirectional stream, send a message, close our sending side,
// and read the reply.
const stream = await client.createBidirectionalStream();
const writer = stream.writable.getWriter();
await writer.write(new TextEncoder().encode("hello over QUIC"));
await writer.close();
console.log(await new Response(stream.readable).text()); // echo: hello over QUIC

client.close();
endpoint.close();
