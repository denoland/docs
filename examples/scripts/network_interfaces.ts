/**
 * @title List network interfaces
 * @difficulty beginner
 * @tags cli
 * @run -S <url>
 * @resource {https://docs.deno.com/api/deno/~/Deno.networkInterfaces} Doc: Deno.networkInterfaces
 * @resource {https://docs.deno.com/examples/dns_queries/} Example: DNS queries
 * @group System
 *
 * Deno.networkInterfaces lists every network address of the machine. The
 * most common use is finding the LAN address of the computer, for example
 * to print a URL that teammates on the same network can open. The call
 * needs the system permission, granted with -S (short for --allow-sys).
 */

// Each entry describes one address bound to one interface. An interface
// like en0 typically appears several times, once per IPv4 and IPv6 address.
const interfaces = Deno.networkInterfaces();
console.log(interfaces.length); // e.g. 15

// An entry contains the interface name, address family, the address itself,
// plus the netmask, CIDR notation and MAC address.
const first = interfaces[0];
console.log(first.name, first.family, first.address); // e.g. lo0 IPv4 127.0.0.1

// A small helper to find the LAN address: the first IPv4 address that is
// not on the loopback interface. Addresses starting with 127. only reach
// the machine itself, so they are skipped.
function lanAddress(): string | undefined {
  return Deno.networkInterfaces().find((ni) =>
    ni.family === "IPv4" && !ni.address.startsWith("127.")
  )?.address;
}

console.log(lanAddress()); // e.g. 192.168.1.239

// With that address a local development server can announce a URL that
// other devices on the same network can open.
console.log(`http://${lanAddress()}:8000/`); // e.g. http://192.168.1.239:8000/

// Code written for Node.js gets the same data from the os module, shaped
// as a record keyed by interface name instead of a flat list.
import os from "node:os";
const nodeInterfaces = os.networkInterfaces();
console.log(Object.keys(nodeInterfaces).length); // e.g. 12
console.log(nodeInterfaces["lo0"]?.[0]?.address); // e.g. 127.0.0.1
