/**
 * @title Upgrade a TCP connection to TLS (STARTTLS)
 * @difficulty intermediate
 * @tags cli
 * @run --allow-net <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.startTls} Doc: Deno.startTls
 * @resource {https://docs.deno.com/examples/tls_connector/} Example: TCP/TLS connector
 * @group Network
 *
 * Some protocols start as plaintext and negotiate encryption mid-connection
 * instead of connecting over TLS from the start. SMTP, IMAP, and Postgres
 * all work this way. Deno.startTls performs that upgrade: it takes an
 * established TCP connection and runs the TLS handshake over it, returning
 * a TlsConn. This example speaks just enough SMTP to a mail server to
 * demonstrate the STARTTLS dance.
 */

// Connect to an SMTP server on the submission port, which expects a
// plaintext greeting before TLS. Helpers for the line-based protocol:
// SMTP commands and replies end with CRLF.
const conn = await Deno.connect({ hostname: "smtp.gmail.com", port: 587 });
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const buffer = new Uint8Array(4096);

async function read(c: Deno.Conn): Promise<string> {
  const n = await c.read(buffer);
  return decoder.decode(buffer.subarray(0, n ?? 0));
}

async function send(c: Deno.Conn, line: string) {
  await c.write(encoder.encode(line + "\r\n"));
}

// The server greets us in plaintext, and EHLO asks what it supports. The
// STARTTLS line in the response advertises that an upgrade is available.
console.log((await read(conn)).split(" ", 2).join(" ")); // 220 smtp.gmail.com
await send(conn, "EHLO localhost");
const features = await read(conn);
console.log(features.includes("STARTTLS")); // true

// Ask for the upgrade. The server answers 220 and from this point on
// expects a TLS handshake on the wire.
await send(conn, "STARTTLS");
console.log((await read(conn)).trim()); // 220 2.0.0 Ready to start TLS

// Deno.startTls wraps the existing connection in TLS. The hostname is used
// to verify the server's certificate, exactly as in Deno.connectTls. The
// original conn must not be used afterwards.
const tlsConn = await Deno.startTls(conn, { hostname: "smtp.gmail.com" });

// The protocol resumes where it left off, now encrypted. RFC 3207 requires
// repeating EHLO after the upgrade because the pre-TLS responses are no
// longer trusted.
await send(tlsConn, "EHLO localhost");
console.log((await read(tlsConn)).split("\r\n")[0]); // 250-smtp.gmail.com at your service

await send(tlsConn, "QUIT");
tlsConn.close();
