/**
 * @title Running DNS Queries
 * @difficulty beginner
 * @tags cli, deploy
 * @run --allow-net <url>
 * @resource {https://deno.land/api?s=Deno.resolveDns} Doc: Deno.resolveDns
 * @resource {https://developer.mozilla.org/en-US/docs/Glossary/DNS} MDN: DNS
 *
 * There are some cases when running DNS queries is useful. This is
 * usually the case when one would like to use a DNS server not configured
 * on the machine.
 */

// In the most basic basic case, we can query a domain's A record.
// This will give us a list of ipv4 addresses.
const a = await Deno.resolveDns("example.com", "A");
console.log(a);

// We can also query other record types. In this case we are querying
// an MX record which is related to email protocols. Deno supports querying
// A, AAAA, ANAME, CAA, CNAME, MX, NAPTR, NS, PTR, SOA, SRV, and TXT records.
const mx = await Deno.resolveDns("example.com", "MX");
console.log(mx);

// We are also optionally able to specify a nameserver via an ip address
// and (optionally) a port number. To override the system configuration.
const aaaa = await Deno.resolveDns("example.com", "AAAA", {
  nameServer: { ipAddr: "8.8.8.8", port: 53 },
});
console.log(aaaa);
