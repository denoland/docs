/**
 * @title Connect two peers with WebTransport
 * @difficulty intermediate
 * @tags cli
 * @run --unstable-net --allow-net --allow-read <url>
 * @resource {https://docs.deno.com/api/web/~/WebTransport} Doc: WebTransport
 * @resource {https://docs.deno.com/api/deno/~/Deno.upgradeWebTransport} Doc: Deno.upgradeWebTransport
 * @group Network
 *
 * <strong>Warning: This is an unstable API that is subject to change or removal at anytime.</strong><br>WebTransport is the web platform's API for low-latency, multiplexed
 * communication over HTTP/3. Browsers can use it where raw QUIC and TCP
 * sockets are unavailable, and unlike WebSockets it offers many independent
 * streams plus unreliable datagrams. Deno provides both the client API and,
 * via Deno.upgradeWebTransport, the server side. This example runs both in
 * one process.
 *
 * WebTransport runs over QUIC, which always requires TLS. Generate a local
 * self-signed certificate with:
 * <code>openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 14 -nodes -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost" -addext "basicConstraints=critical,CA:FALSE"</code>
 */

const cert = Deno.readTextFileSync("./server.crt");
const key = Deno.readTextFileSync("./server.key");

// The server side is a QUIC endpoint speaking the HTTP/3 ALPN protocol.
// Deno.upgradeWebTransport performs the WebTransport handshake on an
// accepted QUIC connection.
const endpoint = new Deno.QuicEndpoint({ hostname: "localhost", port: 4433 });
const listener = endpoint.listen({ cert, key, alpnProtocols: ["h3"] });

(async () => {
  for await (const incoming of listener) {
    const conn = await incoming.accept();
    const transport = await Deno.upgradeWebTransport(conn);
    await transport.ready;
    // Echo the first message on each incoming bidirectional stream.
    const { value: stream } = await transport.incomingBidirectionalStreams
      .getReader().read();
    if (!stream) continue;
    const { value } = await stream.readable.getReader().read();
    const writer = stream.writable.getWriter();
    await writer.write(value);
    await writer.close();
  }
})();

// Browsers normally require a certificate signed by a real CA, but
// serverCertificateHashes lets a client trust a specific self-signed
// certificate by the SHA-256 hash of its DER encoding. This is the
// standard way to develop locally with WebTransport.
const der = Deno.readFileSync("./server.der"); // openssl x509 -in server.crt -outform der -out server.der
const certHash = await crypto.subtle.digest("SHA-256", der);

const transport = new WebTransport("https://localhost:4433", {
  serverCertificateHashes: [{ algorithm: "sha-256", value: certHash }],
});
await transport.ready;

// Streams work like their QUIC counterparts: open a bidirectional stream,
// write, and read the echo back.
const stream = await transport.createBidirectionalStream();
const writer = stream.writable.getWriter();
await writer.write(new TextEncoder().encode("hello WebTransport"));
const { value } = await stream.readable.getReader().read();
console.log(new TextDecoder().decode(value)); // hello WebTransport

transport.close();
endpoint.close();
